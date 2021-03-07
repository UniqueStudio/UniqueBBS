import {
    prisma,
    Thread,
    FilterCreateOneInput,
    FilterUpdateOneInput
} from "../generated/prisma-client";
import { Request, Response } from "express";
import { setLockExpire } from "./lock";
import { pagesize, regPreviewURL, regImgStr, regNewStr } from "./consts";
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
    MESSAGE_DIAMOND,
    MESSAGE_THREAD_URL,
    MESSAGE_AT,
    messageWxPushUser
} from "./message";
import { redLock } from "../server";
import { fileProcess } from "./attach";
import {
    filterCalculate,
    filterCheckTypeAvailable,
    filterObjGenerate,
    filterClearCache
} from "./filter";
import { atProcess } from "./at";

var lastModifies :{[key:string]:Date} = {};

export const initlastModifies = async function() {
    try {
        (await prisma.forums()).forEach(async item => {
            let fid = item.id;
            lastModifies[fid] = new Date();
        });
        
    } catch (e) {
        console.log(e);
    }
}

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

        const resultArrRaw: Array<Thread> = await prisma.threads({
            where: whereArr,
            skip: (page - 1) * pagesize,
            first: pagesize,
            orderBy: "lastDate_DESC"
        });

        const combinedArrRaw = [...topArr, ...resultArrRaw];

        const resultArr = await Promise.all(
            combinedArrRaw.map(async item => {
                return {
                    thread: item,
                    user: filterUserInfo(
                        await prisma.thread({ id: item.id }).user()
                    ),
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

        if (fid !== "*") {
            const resultForum = await prisma.forum({
                id: fid
            });

            if (!resultForum) {
                res.json({ code: -1, msg: "板块不存在！" });
                return;
            }

            res.json({ code: 1, msg: { list: resultArr, forum: resultForum } });
        } else {
            res.json({
                code: 1,
                msg: { list: resultArr }
            });
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
            res.json({ code: -1, msg: "主题不存在！" });
            return;
        }

        const havePermission = await filterCalculate(uid, tid, isAdmin);
        if (!havePermission) {
            res.json({ code: -1, msg: "您无权查看此帖子！" });
            return;
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
            postArrRaw.map(async item => {
                if (!item.active && !isAdmin) {
                    return {
                        post: {
                            active: false,
                            message: ""
                        },
                        user: null,
                        group: null,
                        quote: null
                    };
                } else {
                    return {
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
                            .group(),
                        quote:
                            item.quote === "-1"
                                ? null
                                : await prisma.post({ id: item.quote })
                    };
                }
            })
        );

        const attachArr = await prisma.attaches({
            where: {
                thread: {
                    id: tid
                }
            }
        });

        const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();

        res.json({
            code: 1,
            msg: {
                threadInfo,
                threadAuthor,
                firstPost,
                postArr,
                attachArr,
                forumInfo
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

/*
return msg: {
    list: [
        {
            threadInfo,
            threadAuthor,
        },
        {
            threadInfo,
            threadAuthor,
        },
        {
            threadInfo,
            threadAuthor,
        },
    ]
}
 */
export const threadGetTop3 = async function (req:Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));

        let { fid } = req.params;
        let topArr: Array<Thread> = [];
        let threadTop1 = await prisma.threads({
            where: {
                top: 1,
                forum: {
                    id: fid
                }
            },
            orderBy: "lastDate_DESC"
        })
        if (threadTop1.length > 0) {
            topArr.push(threadTop1[0]);
        } else {
            topArr.push(null);
        }
        let threadMostPost = await prisma.threads({
            where: {
                top: 0,
                forum: {
                    id: fid
                },
                active: true
            },
            orderBy: "postCount_DESC"
        })
        if (threadMostPost.length > 0) {
            topArr.push(threadMostPost[0]);
        } else {
            topArr.push(null);
        }
        let threadNewUpdate = await prisma.threads({
            where: {
                top: 0,
                forum: {
                    id: fid
                },
                active: true,
            },
            orderBy: "updatedAt_DESC"
        })
        if (threadNewUpdate.length > 1) {
            if (topArr[1] !== null && threadNewUpdate[0].id === topArr[1].id) {
                topArr.push(threadNewUpdate[1]);
            } else {
                topArr.push(threadNewUpdate[0]);
            }
        } else {
            topArr.push(null);
        }
        
        const resultArr = await Promise.all(
            topArr.map(async item => {
                return item? {
                    thread: item,
                    user: filterUserInfo(
                        await prisma.thread({ id: item.id }).user()
                    )
                }: null;
            })
        );
        res.json({ code: 1, msg: {list: resultArr}});
    } catch (e) {
        res.json({ code: -1 , msg: e.message});
    }
}
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
        const { uid, isAdmin, username } = verifyJWT(
            req.header("Authorization")
        );

        if (!message || message.length <= 5) {
            res.json({
                code: -1,
                msg: "每次发言至少5个字！"
            });
            return;
        }

        if (!subject || subject.length < 3 || subject.length > 50) {
            res.json({
                code: -1,
                msg: "标题长度限制在3~50字！"
            });
            return;
        }

        if (!fid) {
            res.json({
                code: -1,
                msg: "缺少板块信息！"
            });
            return;
        }

        const newForum = await prisma.forum({
            id: fid
        });

        if (!newForum) {
            res.json({
                code: -1,
                msg: "目标板块不存在！"
            });
            return;
        }

        const lockFrequentReply = await setLockExpire(`postUser:${uid}`, "10");
        if (!lockFrequentReply) {
            res.json({
                code: -1,
                msg: "每10秒只能发言一次，您的请求过快！"
            });
            return;
        }

        let filterObj: undefined | FilterCreateOneInput = undefined;
        if (
            filterSwitch === "1" &&
            filterCheckTypeAvailable(filterUserType) &&
            filterCheckTypeAvailable(filterGroupType)
        ) {
            filterObj = {
                create: filterObjGenerate(
                    filterUserArr,
                    filterGroupArr,
                    filterUserType,
                    filterGroupType
                )
            };
        }

        const lockCreatThread = await redLock.lock(`updateThread:${uid}`, 2000);
        try {
            const newMessage = message.replace(
                regImgStr(regPreviewURL),
                regNewStr
            );

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
                        message: newMessage,
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
                fileProcess(
                    fileListArr,
                    newPostPid,
                    resultThread.id,
                    uid,
                    isAdmin
                );
            }

            forumThreadsAdd(fid, 1, newPostPid);
            userThreadsAdd(uid, 1);
            atProcess(
                newMessage,
                uid,
                MESSAGE_AT(username, subject, false),
                resultThread.id,
                isAdmin
            );
            res.json({ code: 1, msg: resultThread.id });
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
        const { uid, isAdmin, username } = verifyJWT(
            req.header("Authorization")
        );

        if (!message || message.length <= 5) {
            res.json({
                code: -1,
                msg: "每次发言至少5个字以上！"
            });
            return;
        }

        const lockFrequentReply = await setLockExpire(`postUser:${uid}`, "10");
        if (!lockFrequentReply) {
            res.json({
                code: -1,
                msg: "每10秒只能发言一次，您的请求过快！"
            });
            return;
        }

        const havePermission = await filterCalculate(uid, tid, isAdmin);
        if (!havePermission) {
            res.json({ code: -1, msg: "您无权回复此帖子！" });
            return;
        }

        const lock = await redLock.lock(`updateThread:${tid}`, 200);

        try {
            const threadInfo = await prisma.thread({
                id: tid
            });

            if (threadInfo.closed && !isAdmin) {
                res.json({
                    code: -1,
                    msg: "该帖子已被关闭，您无权回复！"
                });
                return;
            }

            if (quote !== "-1") {
                const quotePostInfo = await prisma.$exists.post({
                    id: quote
                });

                if (!quotePostInfo) {
                    res.json({
                        code: -1,
                        msg: "引用不存在！"
                    });
                    return;
                }

                const quoteParentThreadInfo = await prisma
                    .post({
                        id: quote
                    })
                    .thread();

                if (quoteParentThreadInfo.id !== tid) {
                    res.json({
                        code: -1,
                        msg: "只能引用本帖内的回复！"
                    });
                    return;
                }
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
                res.json({
                    code: -1,
                    msg: "主题不存在！"
                });
                return;
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
                                quote: quote,
                                createDate: new Date(),
                                active: true
                            }
                        }
                    }
                })
                .post({
                    last: 1
                });

            lastModifies[forumInfo.id] = new Date();

            forumLastPostUpdate(forumInfo.id, resultThread[0].id);
            let havePushMessage = 0;
            if (uid !== authorInfo.id) {
                const sendMsg = MESSAGE_REPLY(username, threadInfo.subject);
                const sendUrl = MESSAGE_THREAD_URL(threadInfo.id);
                pushMessage(uid, authorInfo.id, sendMsg, sendUrl);
                messageWxPushUser([authorInfo.id], sendMsg, sendUrl);
                havePushMessage = 1;
            }
            if (quote !== -1 && !havePushMessage) {
                const quotePost = await prisma.post({
                    id: quote
                });

                const quotePostAuthor = await prisma
                    .post({
                        id: quote
                    })
                    .user();
                if (quotePost && quotePostAuthor.id !== uid) {
                    const sendQuoteMsg = MESSAGE_QUOTE(
                        username,
                        threadInfo.subject
                    );
                    const sendQuoteUrl = MESSAGE_THREAD_URL(threadInfo.id);
                    pushMessage(
                        uid,
                        quotePostAuthor.id,
                        sendQuoteMsg,
                        sendQuoteUrl
                    );
                    messageWxPushUser(
                        [quotePostAuthor.id],
                        sendQuoteMsg,
                        sendQuoteUrl
                    );
                }
            }

            atProcess(
                message,
                uid,
                MESSAGE_AT(username, threadInfo.subject, true),
                threadInfo.id,
                isAdmin
            );

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
        const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();
        if (threadAuthInfo.id !== uid && !authObj.isAdmin) {
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    active: false
                }
            });
            lastModifies[forumInfo.id] = new Date();
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            const { tid } = req.params;
            const author = await prisma
                .thread({
                    id: tid
                })
                .user();
            const forum = await prisma
                .thread({
                    id: tid
                })
                .forum();

            await prisma.thread({
                id: tid
            });
            // await prisma.deleteManyPosts({
            //     thread: {
            //         id: tid
            //     }
            // });
            await prisma.deleteThread({
                id: tid
            });
            userThreadsAdd(author.id, -1);
            forumThreadsAdd(forum.id, -1);
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
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
            const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();
            lastModifies[forumInfo.id] = new Date();
            const threadAuthor = await prisma
                .thread({
                    id: tid
                })
                .user();

            if (setDiamond === "1") {
                const sendDiamondMsg = MESSAGE_DIAMOND(threadInfo.subject);
                const sendDiamondUrl = MESSAGE_THREAD_URL(tid);
                pushMessage(
                    authObj.uid,
                    threadAuthor.id,
                    sendDiamondMsg,
                    sendDiamondUrl
                );
                messageWxPushUser(
                    [threadAuthor.id],
                    sendDiamondMsg,
                    sendDiamondUrl
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            const { tid, setTop } = req.body;
            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    top: Number.parseInt(setTop)
                }
            });
            const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();
            lastModifies[forumInfo.id] = new Date();
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            const { tid, setClose } = req.body;
            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    closed: setClose === "1"
                }
            });
            const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();
            lastModifies[forumInfo.id] = new Date();
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            const { tid } = req.params;
            await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    active: true
                }
            });
            const forumInfo = await prisma
            .thread({
                id: tid
            })
            .forum();
            lastModifies[forumInfo.id] = new Date();
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

        const threadAuthor = await prisma
            .thread({
                id: tid
            })
            .user();

        const threadInfo = await prisma.thread({
            id: tid
        });

        if (!isAdmin && (threadAuthor.id !== uid || !threadInfo.active)) {
            res.json({ code: -1, msg: "您无权编辑此帖子！" });
            return;
        }

        const previousForum = await prisma
            .thread({
                id: tid
            })
            .forum();

        const newForum = await prisma.forum({
            id: fid
        });

        if (!newForum) {
            res.json({ code: -1, msg: "目标板块不存在！" });
            return;
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
                    update: filterObjGenerate(
                        filterUserArr,
                        filterGroupArr,
                        filterUserType,
                        filterGroupType
                    )
                };
            }

            if (previousForum.id !== fid) {
                forumThreadsAdd(previousForum.id, -1);
                forumThreadsAdd(fid, 1);
            }

            const threadInfo = await prisma.updateThread({
                where: {
                    id: tid
                },
                data: {
                    subject: subject,
                    filter: filterObj,
                    forum: {
                        connect: {
                            id: fid
                        }
                    }
                }
            });

            const newMessage = message.replace(
                regImgStr(regPreviewURL),
                regNewStr
            );

            await prisma.updateManyPosts({
                where: {
                    thread: {
                        id: tid
                    },
                    isFirst: true
                },
                data: {
                    message: newMessage
                }
            });

            if (fileListArr && fileListArr.length !== 0) {
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
                fileProcess(
                    fileListArr,
                    postInfo[0].id,
                    threadInfo.id,
                    uid,
                    isAdmin
                );
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

export const threadGetNew = async function(req: Request, res: Response) {
    try {
        let { fid } = req.params;
        const authObj = verifyJWT(req.header("Authorization"));
        const { timestamp } = req.body;
        if (parseInt(timestamp) < lastModifies[fid].getTime()) {
            res.json({code: 1, msg: {haveModified: true}});
            return;
        }
        

        const whereArr = {
            forum: {
                id: fid
            },
            active: authObj.isAdmin ? undefined : true,
            top: 0
        };


        let page = 1;
        let okFlag = false;
        let resultArr = [];
        for (;okFlag === false;) {
            const resultArrRaw: Array<Thread> = await prisma.threads({
                where: whereArr,
                skip: (page-1)*pagesize,
                first: pagesize,
                orderBy: "lastDate_DESC"
            });
            
            let i = 0;
            for (; i < resultArrRaw.length; i++) {
                let item = resultArrRaw[i];
                if ((new Date(item.lastDate)) < (new Date(timestamp))) {
                    okFlag = true;
                    break;
                }
                resultArr.push({
                    thread: item,
                    user: filterUserInfo(
                        await prisma.thread({ id: item.id }).user()
                    ),
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
                })
            }
            if (okFlag === true || i === resultArrRaw.length) break;
        }
        res.json({ code: 1, msg: { list: resultArr } });
    } catch (e) {
        res.json({ code: -1 });
    }
}

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
            res.json({ code: -1, msg: "您无权移动该帖子！" });
            return;
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
            lastModifies[previousForum.id] = new Date();
            lastModifies[newForum.id] = new Date();
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

export const threadRuntime = async function(req: Request, res: Response) {
    try {
        const { isAdmin } = verifyJWT(req.header("Authorization"));
        if (!isAdmin) {
            res.json({ code: -1, msg: "No Permission" });
            return;
        }
        const threadList = await prisma.threads();
        for (const thread of threadList) {
            const postCount = await prisma
                .postsConnection({
                    where: {
                        thread: {
                            id: thread.id
                        }
                    }
                })
                .aggregate()
                .count();
            if (thread.postCount !== postCount) {
                await prisma.updateThread({
                    where: {
                        id: thread.id
                    },
                    data: {
                        postCount: postCount
                    }
                });
            }
        }

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
