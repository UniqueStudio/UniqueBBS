import { prisma, Forum } from "../generated/prisma-client"
import { Request, Response } from 'express';
import { redLock } from "../server"
import { pagesize } from "./consts"
import { verifyJWT, filterUserInfo } from "./check"
import { userThreadsAdd, forumThreadsAdd, forumLastPostUpdate } from "./runtime"
import { pushMessage, MESSAGE_REPLY , MESSAGE_QUOTE } from "./message"

export const threadList = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));

        let { fid, page } = req.params;
        page = Number.parseInt(page);

        const whereArr = {
            forum: {
                id: fid === "*" ? undefined : fid,
            },
            active: authObj.isAdmin ? undefined : true
        };

        let resultForum: Forum;
        if (fid !== "*") {
            resultForum = await prisma.forum({
                id: fid
            });

            if (!resultForum) {
                return res.json({ code: -1, msg: "板块不存在！" });
            }
        }

        const resultArrRaw = await prisma.threads({
            where: whereArr,
            skip: (page - 1) * pagesize,
            first: pagesize,
            orderBy: "lastDate_DESC"
        });

        const resultArr = await Promise.all(
            resultArrRaw.map(
                async (item) => {
                    return {
                        thread: item,
                        user: filterUserInfo(await prisma.thread({ id: item.id }).user()),
                        lastReply: await prisma.posts({
                            where: {
                                thread: {
                                    id: item.id
                                }
                            },
                            orderBy: "createDate_DESC",
                            first: 1
                        })[0]
                    };
                })
        );

        if (fid === "*") {
            res.json({ code: 1, msg: { forum: resultForum, list: resultArr } });
        } else {
            res.json({ code: 1, msg: { list: resultArr } });
        }

    } catch (e) {
        res.json({ code: -1 });
    }

};

export const threadInfo = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));
        let { tid, page } = req.params;
        page = Number.parseInt(page);

        const threadInfoObj = { id: tid, active: authObj.isAdmin ? undefined : true };

        const threadInfo = await prisma.thread({
            id: tid
        });
        const threadAuthor = filterUserInfo(await prisma.thread({
            id: tid
        }).user());

        const postArrRaw = await prisma.posts({
            where: {
                thread: threadInfoObj,
                isFirst: false
            },
            skip: (page - 1) * pagesize,
            first: pagesize
        });

        const [firstPost] = await prisma.posts({
            where: {
                thread: {
                    id: tid
                },
                isFirst: true
            }
        });

        const postArr = await Promise.all(
            postArrRaw.map(
                async (item) => ({
                    thread: item,
                    user: filterUserInfo(await prisma.post({
                        id: item.id
                    }).user())
                })
            )
        );

        res.json({
            code: 1, msg: {
                threadInfo, threadAuthor, firstPost, postArr
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadCreate = async function (req: Request, res: Response) {
    try {
        const { fid, subject, message } = req.body;
        const authObj = verifyJWT(req.header('Authorization'));
        const uid = authObj.uid;

        const resultThread = await prisma.createThread({
            subject: subject,
            forum: {
                connect: {
                    id: fid
                }
            },
            user: {
                connect: {
                    id: uid
                }
            },
            createDate: new Date(),
            lastDate: new Date(),
            post: {
                create: {
                    isFirst: true,
                    message: message,
                    forum: {
                        connect: {
                            id: fid
                        }
                    },
                    user: {
                        connect: {
                            id: uid,
                        }
                    },
                    createDate: new Date(),
                }
            }
        }).post({
            first: 1
        });

        const [{ id: newPostPid }] = resultThread;
        await forumThreadsAdd(fid, 1, newPostPid);
        await userThreadsAdd(uid, 1);

        res.json({ code: 1 });

    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }

};

export const threadReply = async function (req: Request, res: Response) {
    try {
        const { tid, message, quote } = req.body;
        const authObj = verifyJWT(req.header('Authorization'));
        const uid = authObj.uid;
        const lock = await redLock.lock(`thread:${tid}`, 200);

        try {
            const threadInfo = await prisma.thread({
                id: tid
            });
            const authorInfo = await prisma.thread({
                id: tid
            }).user();
            const forumInfo = await prisma.thread({
                id: tid
            }).forum();

            const resultThread = await prisma.updateThread({
                where: {
                    id: tid,
                },
                data: {
                    postCount: threadInfo.postCount + 1,
                    lastDate: new Date(),
                    post: {
                        create: {
                            isFirst: false,
                            message: message,
                            forum: {
                                connect: {
                                    id: forumInfo.id
                                }
                            },
                            user: {
                                connect: {
                                    id: uid,
                                }
                            },
                            quote: Number.parseInt(quote),
                            createDate: new Date(),
                            active: true
                        }
                    }
                }
            }).post({
                last: 1
            });

            await forumLastPostUpdate(forumInfo.id, resultThread[0].id);
            if (uid !== authorInfo.id) {
                await pushMessage(uid, authorInfo.id, MESSAGE_REPLY(authorInfo.username, threadInfo.subject));
                if (quote !== -1) {
                    const quotePost = await prisma.post({
                        id: quote
                    });
                    const quotePostAuthor = await prisma.post({
                        id:quote
                    }).user();
                    if(quotePost && quotePostAuthor.id !== uid){
                        await pushMessage(uid, quotePostAuthor.id, MESSAGE_QUOTE(authorInfo.username, threadInfo.subject));
                    }
                }
            }

            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            lock.unlock();
        }

    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadDelete = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));
        const { tid } = req.params;
        const uid = authObj.uid;
        const threadAuthInfo = await prisma.thread({
            id: tid
        }).user();

        if (threadAuthInfo.id !== uid && !(authObj.isAdmin)) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    active: false
                }
            });
            await prisma.updateManyPosts({
                where: {
                    thread: {
                        id: tid
                    }
                },
                data: {
                    active: false
                }
            });

            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postDelete = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));
        const { pid } = req.params;
        const uid = authObj.uid;
        const postAuthInfo = await prisma.post({
            id: pid
        }).user();

        if (postAuthInfo.id !== uid && !(authObj.isAdmin)) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            await prisma.updatePost({
                where: {
                    id: pid
                },
                data: {
                    active: false
                }
            });
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postDeleteHard = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));
        if (!(authObj.isAdmin)) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { pid } = req.params;
            await prisma.deletePost({
                id: pid
            });
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadDeleteHard = async function (req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header('Authorization'));
        if (!(authObj.isAdmin)) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid } = req.params;
            const author = await prisma.thread({
                id: tid
            }).user();
            const thread = await prisma.thread({
                id: tid
            });
            await prisma.deleteThread({
                id: tid
            });
            await prisma.deleteManyPosts({
                thread: {
                    id: tid
                }
            });
            await userThreadsAdd(author.id, -1);
            await forumThreadsAdd(thread.id, -1);
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};