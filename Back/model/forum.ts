import { prisma } from "../generated/prisma-client";
import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { filterUserInfo } from "./check";

export const forumList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const resultRAW = await prisma.forums();
        const result = await Promise.all(
            resultRAW.map(async item => ({
                id: item.id,
                name: item.name,
                threads: item.threads,
                icon: item.icon,
                description: item.description,
                lastPost: await prisma
                    .forum({
                        id: item.id
                    })
                    .lastPost(),
                lastPostInfo: {
                    user: filterUserInfo(
                        await prisma
                            .forum({
                                id: item.id
                            })
                            .lastPost()
                            .user()
                    ),
                    thread: await prisma
                        .forum({
                            id: item.id
                        })
                        .lastPost()
                        .thread()
                }
            }))
        );
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const forumListSimple = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const result = await prisma.forums();
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const forumCreate = async function(name: string, icon: string) {
    const result = await prisma.createForum({
        name: name,
        icon: icon
    });
    return result;
};

export const forumRuntime = async function(req: Request, res: Response) {
    try {
        const { isAdmin } = verifyJWT(req.header("Authorization"));
        if (!isAdmin) {
            res.json({ code: -1, msg: "No Permission" });
            return;
        }
        const forumList = await prisma.forums();
        for (const forum of forumList) {
            const threads = await prisma
                .threadsConnection({
                    where: {
                        forum: {
                            id: forum.id
                        }
                    }
                })
                .aggregate()
                .count();
            if (forum.threads !== threads) {
                await prisma.updateForum({
                    where: {
                        id: forum.id
                    },
                    data: {
                        threads: threads
                    }
                });
            }
        }

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};


export const forumListTop = async function(req: Request, res: Response) {
    req.header('Content-Type');
    res.json({ code: 1, msg: 'unfinished'});
}