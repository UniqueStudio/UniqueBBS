import { prisma } from "../generated/prisma-client"
import { Request, Response } from 'express';
import { redLock } from "../server"
import { pagesize } from "./consts"
import { verifyJWT } from "./check"

export const threadList = async function (req: Request, res: Response) {
    const { id, pageString } = req.params;
    const page = Number.parseInt(pageString);

};

export const threadInfo = async function (req: Request, res: Response) {
    const { id, pageString } = req.params;
    const page = Number.parseInt(pageString);

    
};

export const threadCreate = async function (req: Request, res: Response) {
    try {
        const { fid, subject, message } = req.body;
        const authObj = verifyJWT(req.get('Authorization'));
        const uid = authObj.uid;
        const redLockResourceName = `user:${uid}`;
        await redLock.lock(redLockResourceName, 1000, async (lock) => {
            try {
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

                res.json({ code: 1 });
            } catch (e) {
                res.json({ code: -1, msg: e.message });
            } finally {
                lock.unlock();
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }

};

export const threadReply = async function (req: Request, res: Response) {
    try {
        const { tid, message, quote } = req.body;
        const authObj = verifyJWT(req.get('Authorization'));
        const uid = authObj.uid;

        const redLockResourceNameUser = `user:${uid}`;
        const redLockResourceNameThread = `thread:${tid}`;

        await redLock.lock(redLockResourceNameUser, 1000, async (lock) => {
            try {
                const userInfo = await prisma.user({
                    id: uid
                });
                const resultUser = await prisma.updateUser({
                    where: {
                        id: uid
                    },
                    data: {
                        posts: userInfo.posts + 1
                    }
                });
            } finally {
                lock.unlock();
            }
        });

        await redLock.lock(redLockResourceNameThread, 1000, async (lock) => {
            try {
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

                res.json({ code: 1 });
            } catch (e) {
                res.json({ code: -1, msg: e.message });
            } finally {
                lock.unlock();
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};