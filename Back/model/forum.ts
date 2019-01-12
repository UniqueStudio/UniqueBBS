import { prisma } from "../generated/prisma-client"
import { verifyJWT } from "./check"
import { Request, Response } from 'express'

export const forumList = async function (req: Request, res: Response) {
    try {
        verifyJWT(req.header('Authorization'));
        const resultRAW = await prisma.forums();
        const result = await Promise.all(resultRAW.map(
            async (item) => ({
                id: item.id,
                name: item.name,
                threads: item.threads,
                lastPost: await prisma.forum({
                    id: item.id
                }).lastPost()
            })
        ));
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const forumListSimple = async function (req: Request, res: Response) {
    try {
        verifyJWT(req.header('Authorization'));
        const result = await prisma.forums();
        res.json();
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const forumCreate = async function (name: string) {
    const result = await prisma.createForum({
        name: name
    });
    return result;
};