import { prisma, Forum, Thread, FilterCreateOneInput, FilterUpdateOneInput } from "../generated/prisma-client";
import { Request, Response } from "express";
import { setLockExpire } from "./lock";
import { pagesize } from "./consts";
import { verifyJWT, filterUserInfo } from "./check";
import { userThreadsAdd, forumThreadsAdd, forumLastPostUpdate } from "./runtime";
import { pushMessage, MESSAGE_REPLY, MESSAGE_QUOTE, MESSAGE_DIAMOND, MESSAGE_THREAD_URL } from "./message";
import { redLock } from "../server";
import { fileProcess } from "./attach";
import { filterCalculate, filterCheckTypeAvailable, filterObjGenerate, filterClearCache } from "./filter";

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
                    user: filterUserInfo(await prisma.thread({ id: item.id }).user()),
                    lastReply: await prisma.posts({
                        where: {
                            thread: {
                                id: item.id,
                                active: authObj.isAdmin ? undefined : true
                            }
                        },
                        orderBy: "createDate_DESC",
                        first: 1
                    })
                };
            })
        );

        if (fid === "*") {
            res.json({
                code: 1,
                msg: { list: resultArr, top: topArr }
            });
        } else {
            res.json({ code: 1, msg: { list: resultArr, top: topArr, forum: resultForum } });
        }
    } catch (e) {
        res.json({ code: -1 });
    }
};

export const threadInfo = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        let { tid, page } = req.params;
        page = Number.parseInt(page);

        const threadInfoObj = {
            id: tid,
            active: isAdmin ? undefined : true
        };

        const threadInfo = await prisma.thread({
            id: tid
        });

        if (!threadInfo || (!threadInfo.active && !isAdmin)) {
            return res.json({ code: -1, msg: "主题不存在！" });
        }

        const havePermission = await filterCalculate(uid, tid, isAdmin);
        if (!havePermission) {
            return res.json({ code: -1, msg: "您无权查看此帖子！" });
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
                active: isAdmin ? undefined : true
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
                ),
                group: await prisma
                    .post({
                        id: item.id
                    })
                    .user()
                    .group()
            }))
        );

        const attachArr = await prisma.attaches({
            where: {
                thread: {
                    id: tid
                }
            }
        });

        res.json({
            code: 1,
            msg: {
                threadInfo,
                threadAuthor,
                firstPost,
                postArr,
                attachArr
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadCreate = async function(req: Request, res: Response) {
    try {
        const {
            fid,
            subject,
            message,
            filterSwitch,
            filterUserType,
            filterGroupType,
            filterUserArr,
            filterGroupArr,
            fileListArr
        } = req.body;
        const { uid } = verifyJWT(req.header("Authorization"));

        if (!message || message.length <= 5) {
            return res.json({
                code: -1,
                msg: "每次发言至少5个字以上！"
            });
        }

        if (!subject || subject.length < 5 || subject.length > 50) {
            return res.json({
                code: -1,
                msg: "标题长度限制在5~50字！"
            });
        }

        if (!fid) {
            return res.json({
                code: -1,
                msg: "缺少板块信息！"
            });
        }

        const lockFrequentReply = await setLockExpire(`postUser:${uid}`, "10");
        if (!lockFrequentReply) {
            return res.json({
                code: -1,
                msg: "每10秒只能发言一次，您的请求过快！"
            });
        }

        let filterObj: undefined | FilterCreateOneInput = undefined;
        if (
            filterSwitch === "1" &&
            filterCheckTypeAvailable(filterUserType) &&
            filterCheckTypeAvailable(filterGroupType)
        ) {
            filterObj = {
                create: filterObjGenerate(filterUserArr, filterGroupArr, filterUserType, filterGroupType)
            };
        }

        const lockCreatThread = await redLock.lock(`updateThread:${uid}`, 2000);
        try {
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
                        user: {
                            connect: {
                                id: uid
                            }
                        },
                        createDate: new Date()
                    }
                },
                filter: filterObj
            });

            const [newPost] = await prisma.posts({
                where: {
                    isFirst: true,
                    thread: {
                        id: resultThread.id
                    }
                },
                first: 1,
                orderBy: "createDate_ASC"
            });
            const newPostPid = newPost.id;

            if (fileListArr && fileListArr.length !== 0) {
                fileProcess(fileListArr, newPostPid, resultThread.id, uid);
            }

            await forumThreadsAdd(fid, 1, newPostPid);
            await userThreadsAdd(uid, 1);
            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            lockCreatThread.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadReply = async function(req: Request, res: Response) {
    try {
        const { tid, message, quote } = req.body;
        const { uid, isAdmin, username } = verifyJWT(req.header("Authorization"));

        if (!message || message.length <= 5) {
            return res.json({
                code: -1,
                msg: "每次发言至少5个字以上！"
            });
        }

        const lockFrequentReply = await setLockExpire(`postUser:${uid}`, "10");
        if (!lockFrequentReply) {
            return res.json({
                code: -1,
                msg: "每10秒只能发言一次，您的请求过快！"
            });
        }

        const havePermission = await filterCalculate(uid, tid, isAdmin);
        if (!havePermission) {
            return res.json({ code: -1, msg: "您无权回复此帖子！" });
        }

        const lock = await redLock.lock(`updateThread:${tid}`, 200);

        try {
            const threadInfo = await prisma.thread({
                id: tid
            });

            if (threadInfo.closed && !isAdmin) {
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
                    MESSAGE_REPLY(username, threadInfo.subject),
                    MESSAGE_THREAD_URL(threadInfo.id)
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
                            MESSAGE_QUOTE(authorInfo.username, threadInfo.subject),
                            MESSAGE_THREAD_URL(threadInfo.id)
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
                    MESSAGE_DIAMOND(threadInfo.subject),
                    MESSAGE_THREAD_URL(tid)
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

export const threadUpdate = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { tid } = req.params;
        const {
            subject,
            message,
            filterSwitch,
            filterUserType,
            filterGroupType,
            filterUserArr,
            filterGroupArr,
            fileListArr
        } = req.body;

        const threadAuthor = await prisma
            .thread({
                id: tid
            })
            .user();

        const threadInfo = await prisma.thread({
            id: tid
        });

        if (!isAdmin && (threadAuthor.id !== uid || !threadInfo.active)) {
            return res.json({ code: -1, msg: "您无权编辑此帖子！" });
        }

        const updateLock = await redLock.lock(`updateThread:${tid}`, 1000);
        await filterClearCache(tid);
        try {
            let filterObj: undefined | FilterUpdateOneInput = undefined;
            if (
                filterSwitch === "1" &&
                filterCheckTypeAvailable(filterUserType) &&
                filterCheckTypeAvailable(filterGroupType)
            ) {
                filterObj = {
                    update: filterObjGenerate(filterUserArr, filterGroupArr, filterUserType, filterGroupType)
                };
            }

            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    subject: subject,
                    filter: filterObj
                }
            });

            const postInfo = await prisma.updateManyPosts({
                where: {
                    thread: {
                        id: tid
                    },
                    isFirst: true
                },
                data: {
                    message: message
                }
            });

            if (fileListArr.length !== 0) {
                const postInfo = await prisma
                    .thread({
                        id: threadInfo.id
                    })
                    .post({
                        where: {
                            isFirst: true
                        },
                        orderBy: "createDate_ASC",
                        first: 1
                    });
                fileProcess(fileListArr, postInfo[0].id, threadInfo.id, uid);
            }

            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            updateLock.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadMove = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { tid } = req.params;
        const { toFid } = req.body;

        const threadAuthor = await prisma
            .thread({
                id: tid
            })
            .user();

        const threadInfo = await prisma.thread({
            id: tid
        });

        if (!isAdmin && (threadAuthor.id !== uid || !threadInfo.active)) {
            return res.json({ code: -1, msg: "您无权移动该帖子！" });
        }

        const moveLock = await redLock.lock(`moveThread`, 500);
        try {
            const previousForum = await prisma
                .thread({
                    id: tid
                })
                .forum();
            const newForum = await prisma.forum({
                id: toFid
            });

            await prisma.updateForum({
                where: {
                    id: previousForum.id
                },
                data: {
                    threads: previousForum.threads - 1
                }
            });

            await prisma.updateForum({
                where: {
                    id: toFid
                },
                data: {
                    threads: newForum.threads + 1
                }
            });

            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    forum: {
                        connect: {
                            id: toFid
                        }
                    }
                }
            });
            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            moveLock.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const threadSearch = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { keyword } = req.body;
        const result = await prisma.threads({
            where: {
                subject_contains: keyword
            }
        });
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
