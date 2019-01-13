import { prisma, Forum, Thread } from "../generated/prisma-client";
import { Request, Response } from "express";
import {
    redLock,
    redisClientExpireAsync,
    redisClientGetAsync,
    redisClientSetAsync,
    redisClientIncrAsync
} from "../server";
import { pagesize, redisPostKey, RedisLockInterval } from "./consts";
import { verifyJWT, filterUserInfo } from "./check";
import {
    userThreadsAdd,
    forumThreadsAdd,
    forumLastPostUpdate
} from "./runtime";
import {
    pushMessage,
    MESSAGE_REPLY,
    MESSAGE_QUOTE,
    MESSAGE_DIAMOND
} from "./message";

export const threadList = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));

        let { fid, page } = req.params;
        page = Number.parseInt(page);

        const whereArr = {
            forum: {
                id: fid === "*" ? undefined : fid
            },
            active: authObj.isAdmin ? undefined : true,
            top: 0
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

        let topArr: Array<Thread> = [];
        if (page === 1) {
            topArr = await prisma.threads({
                where: {
                    top: 2
                },
                orderBy: "lastDate_DESC"
            });
            if (fid !== "*") {
                topArr.push(
                    ...(await prisma.threads({
                        where: {
                            top: 1,
                            forum: {
                                id: fid
                            }
                        },
                        orderBy: "lastDate_DESC"
                    }))
                );
            }
        }

        const resultArrRaw = await prisma.threads({
            where: whereArr,
            skip: (page - 1) * pagesize,
            first: pagesize,
            orderBy: "lastDate_DESC"
        });

        const resultArr = await Promise.all(
            resultArrRaw.map(async item => {
                return {
                    thread: item,
                    user: filterUserInfo(
                        await prisma.thread({ id: item.id }).user()
                    ),
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
            res.json({
                code: 1,
                msg: { forum: resultForum, list: resultArr, top: topArr }
            });
        } else {
            res.json({ code: 1, msg: { list: resultArr, top: topArr } });
        }
    } catch (e) {
        res.json({ code: -1 });
    }
};

export const threadInfo = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        let { tid, page } = req.params;
        page = Number.parseInt(page);

        const threadInfoObj = {
            id: tid,
            active: authObj.isAdmin ? undefined : true
        };

        const threadInfo = await prisma.thread({
            id: tid
        });

        if (!threadInfo || (!threadInfo.active && !authObj.isAdmin)) {
            return res.json({ code: -1, msg: "主题不存在！" });
        }

        const threadAuthor = filterUserInfo(
            await prisma
                .thread({
                    id: tid
                })
                .user()
        );

        const postArrRaw = await prisma.posts({
            where: {
                thread: threadInfoObj,
                isFirst: false,
                active: authObj.isAdmin ? undefined : true
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
            postArrRaw.map(async item => ({
                post: item,
                user: filterUserInfo(
                    await prisma
                        .post({
                            id: item.id
                        })
                        .user()
                )
            }))
        );

        res.json({
            code: 1,
            msg: {
                threadInfo,
                threadAuthor,
                firstPost,
                postArr
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadCreate = async function(req: Request, res: Response) {
    try {
        const { fid, subject, message } = req.body;
        const { uid } = verifyJWT(req.header("Authorization"));

        const redisKey = redisPostKey(uid);
        const redisValue = await redisClientGetAsync(redisKey);
        if (redisValue) {
            const redisValueNum: number = Number.parseInt(redisValue);
            if (redisValueNum > 3) {
                return res.json({ code: -1, msg: "您的请求过于频繁！" });
            } else {
                await redisClientIncrAsync(redisKey);
                await redisClientExpireAsync(redisKey, RedisLockInterval);
            }
        } else {
            await redisClientSetAsync(redisKey, "1", RedisLockInterval);
        }

        const resultThread = await prisma
            .createThread({
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
                                id: uid
                            }
                        },
                        createDate: new Date()
                    }
                }
            })
            .post({
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

export const threadReply = async function(req: Request, res: Response) {
    try {
        const { tid, message, quote } = req.body;
        const authObj = verifyJWT(req.header("Authorization"));
        const uid = authObj.uid;

        const redisKey = redisPostKey(uid);
        const redisValue = await redisClientGetAsync(redisKey);
        if (redisValue) {
            const redisValueNum: number = Number.parseInt(redisValue);
            if (redisValueNum > 3) {
                return res.json({ code: -1, msg: "您的请求过于频繁！" });
            } else {
                await redisClientIncrAsync(redisKey);
                await redisClientExpireAsync(redisKey, RedisLockInterval);
            }
        } else {
            await redisClientSetAsync(redisKey, "1");
            await redisClientExpireAsync(redisKey, RedisLockInterval);
        }

        const lock = await redLock.lock(`thread:${tid}`, 200);

        try {
            const threadInfo = await prisma.thread({
                id: tid
            });

            if (threadInfo.closed && !authObj.isAdmin) {
                return res.json({
                    code: -1,
                    msg: "该帖子已被关闭，您无权回复！"
                });
            }

            const authorInfo = await prisma
                .thread({
                    id: tid
                })
                .user();
            const forumInfo = await prisma
                .thread({
                    id: tid
                })
                .forum();

            if (!authorInfo || !forumInfo) {
                return res.json({
                    code: -1,
                    msg: "主题不存在！"
                });
            }

            const resultThread = await prisma
                .updateThread({
                    where: {
                        id: tid
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
                                        id: uid
                                    }
                                },
                                quote: Number.parseInt(quote),
                                createDate: new Date(),
                                active: true
                            }
                        }
                    }
                })
                .post({
                    last: 1
                });

            await forumLastPostUpdate(forumInfo.id, resultThread[0].id);
            if (uid !== authorInfo.id) {
                await pushMessage(
                    uid,
                    authorInfo.id,
                    MESSAGE_REPLY(authorInfo.username, threadInfo.subject)
                );
                if (quote !== -1) {
                    const quotePost = await prisma.post({
                        id: quote
                    });
                    const quotePostAuthor = await prisma
                        .post({
                            id: quote
                        })
                        .user();
                    if (quotePost && quotePostAuthor.id !== uid) {
                        await pushMessage(
                            uid,
                            quotePostAuthor.id,
                            MESSAGE_QUOTE(
                                authorInfo.username,
                                threadInfo.subject
                            )
                        );
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

export const threadDelete = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const { tid } = req.params;
        const uid = authObj.uid;
        const threadAuthInfo = await prisma
            .thread({
                id: tid
            })
            .user();

        if (threadAuthInfo.id !== uid && !authObj.isAdmin) {
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

export const postDelete = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const { pid } = req.params;
        const uid = authObj.uid;
        const postAuthInfo = await prisma
            .post({
                id: pid
            })
            .user();

        if (postAuthInfo.id !== uid && !authObj.isAdmin) {
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

export const postDeleteHard = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
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

export const threadDeleteHard = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid } = req.params;
            const author = await prisma
                .thread({
                    id: tid
                })
                .user();
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

export const threadDiamond = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid, setDiamond } = req.body;
            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    diamond: setDiamond === "1"
                }
            });

            const threadAuthor = await prisma
                .thread({
                    id: tid
                })
                .user();

            if (setDiamond === "1") {
                const [firstUser] = await prisma.users({
                    first: 1
                });
                pushMessage(
                    firstUser.id,
                    threadAuthor.id,
                    MESSAGE_DIAMOND(threadInfo.subject)
                );
            }
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadTop = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid, setTop } = req.body;
            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    top: Number.parseInt(setTop)
                }
            });
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadClose = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid, setClose } = req.body;
            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    closed: setClose === "1"
                }
            });
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadRecovery = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { tid, postsBool } = req.params;
            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    active: true
                }
            });

            await prisma.updateManyPosts({
                where: {
                    thread: {
                        id: tid
                    },
                    isFirst: true,
                    active: false
                },
                data: {
                    active: true
                }
            });
            if (postsBool === "1") {
                await prisma.updateManyPosts({
                    where: {
                        id: tid,
                        active: false
                    },
                    data: {
                        active: true
                    }
                });
            }

            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postRecovery = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            return res.json({ code: -1, msg: "您无权操作此帖子！" });
        } else {
            const { pid } = req.params;
            const postInfo = await prisma.updatePost({
                where: {
                    id: pid
                },
                data: {
                    active: true
                }
            });
            res.json({ code: 1 });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadGraph = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const { tid } = req.params;

        const fragment = `fragment PostsWithDate on Post{
            createDate
        }`;
        const PostsWithDate = await prisma
            .posts({
                where: {
                    thread: {
                        id: tid
                        // active: true
                    },
                    user: {
                        id: uid
                    }
                    // active: true
                },
                orderBy: "createDate_ASC"
            })
            .$fragment(fragment);
        res.json({ code: 1, msg: PostsWithDate });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
