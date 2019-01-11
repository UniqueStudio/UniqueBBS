import { prisma } from "../generated/prisma-client"
import { Request, Response } from 'express';
import { redLock } from "../server"

export const threadList = async function (req: Request, res: Response) {
    const { id } = req.params;

};

export const threadInfo = async function (req: Request, res: Response) {
    const { id } = req.params;
    const result = await prisma.thread({
        id: id
    });

    const author = await prisma.thread({
        id: id
    }).user();

    const posts = await prisma.thread({
        id: id
    }).post();

    res.json([result, author, posts]);
};

export const threadCreate = async function (req: Request, res: Response) {
    const { fid, subject, message, uid } = req.body;

    const redLockResourceName = "postThread" + uid;
    await redLock.lock(redLockResourceName, 1000, async (lock) => {
        const userInfo = await prisma.user({
            id: uid
        });

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
                    }
                }
            }
        });

        const resultUser = await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                posts: userInfo.posts + 1
            }
        });

        res.json([resultThread, resultUser]);
        lock.unlock();
    });
};

export const threadReply = async function (req: Request, res: Response) {
    const { tid, message, quote, uid } = req.body;

    const redLockResourceName = "replyThread" + uid;
    await redLock.lock(redLockResourceName, 1000, async (lock)=>{
        const userInfo = await prisma.user({
            id: uid
        });
        const threadInfo = await prisma.thread({
            id: tid
        });
        const forumInfo = await prisma.thread({
            id: tid
        }).forum();
    
        const resultThread = await prisma.updateThread({
            where: {
                id: tid,
            },
            data: {
                postCount: threadInfo.postCount + 1,
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
                        quote: quote
                    }
                }
            }
        });
    
        const resultUser = await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                posts: userInfo.posts + 1
            }
        });
        res.json([resultThread]);
        lock.unlock();
    });
    
};