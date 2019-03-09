import { verifyJWT, filterUserInfo } from "./check";
import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { pagesize } from "./consts";

export const postDeleteHard = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
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
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
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

export const postRecovery = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        if (!authObj.isAdmin) {
            res.json({ code: -1, msg: "您无权操作此帖子！" });
            return;
        } else {
            const { pid } = req.params;
            await prisma.updatePost({
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

export const postInfo = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { pid } = req.params;
        const postResult = await prisma.post({
            id: pid
        });

        const postAuthor = await prisma
            .post({
                id: pid
            })
            .user();

        const postThread = await prisma
            .post({
                id: pid
            })
            .thread();

        if (!isAdmin && (!postThread.active || !postResult.active)) {
            res.json({ code: -1, msg: "回帖不存在！" });
            return;
        }

        if (!isAdmin && postAuthor.id !== uid) {
            res.json({ code: -1, msg: "您无权编辑此回帖！" });
            return;
        }

        res.json({ code: 1, msg: postResult });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postUpdate = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { pid } = req.params;
        const { message } = req.body;

        const postAuthor = await prisma
            .post({
                id: pid
            })
            .user();
        const postInfo = await prisma.post({
            id: pid
        });
        const threadInfo = await prisma
            .post({
                id: pid
            })
            .thread();

        if (
            !isAdmin &&
            (postAuthor.id !== uid || !postInfo.active || !threadInfo.active)
        ) {
            res.json({ code: -1, msg: "您无权编辑此回复！" });
            return;
        }

        await prisma.updateManyPosts({
            where: {
                id: pid
            },
            data: {
                message: message
            }
        });

        res.json({ code: 1, msg: threadInfo.id });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postSearch = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { keyword } = req.body;
        const { page } = req.params;

        const keywords = (keyword as string).split(" ");

        const keywordArr1 = keywords.map(item => ({ message_contains: item }));
        const keywordArr2 = keywords.map(item => ({
            thread: {
                subject_contains: item
            }
        }));

        const postResult = await prisma.posts({
            where: {
                OR: [{ AND: keywordArr1 }, { AND: keywordArr2 }]
            },
            orderBy: "createDate_DESC",
            skip: pagesize * (+page - 1),
            first: pagesize
        });

        const result = await Promise.all(
            postResult.map(async item => {
                const thread = await prisma
                    .post({
                        id: item.id
                    })
                    .thread();

                const user = await prisma
                    .post({
                        id: item.id
                    })
                    .user();

                const postCount = await prisma
                    .thread({
                        id: thread.id
                    })
                    .postCount();

                return {
                    id: thread.id,
                    key: item.id,
                    subject: thread.subject,
                    user: filterUserInfo(user),
                    message: item.message,
                    postCount: postCount,
                    createDate: item.createDate,
                    threadCreateDate: thread.createDate
                };
            })
        );

        const count = await prisma
            .postsConnection({
                where: {
                    OR: [{ AND: keywordArr1 }, { AND: keywordArr2 }]
                }
            })
            .aggregate()
            .count();

        res.json({ code: 1, msg: { result, count } });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
