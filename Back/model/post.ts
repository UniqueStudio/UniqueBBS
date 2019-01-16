import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";

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

        if (!isAdmin && (postAuthor.id !== uid || !postInfo.active)) {
            return res.json({ code: -1, msg: "您无权编辑此回复！" });
        }

        await prisma.updateManyPosts({
            where: {
                id: pid
            },
            data: {
                message: message
            }
        });

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const postSearch = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { keyword } = req.body;
        const result = await prisma.posts({
            where: {
                message_contains: keyword
            }
        });
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
