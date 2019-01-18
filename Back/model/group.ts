import { prisma, Group, User } from "../generated/prisma-client";
import { verifyJWT } from "./check";
import { Request, Response } from "express";

export const groupUser = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { uid } = req.params;
        const group = await prisma
            .user({
                id: uid
            })
            .group();
        res.json({ code: 1, msg: group });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const groupList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const groupListRaw: Array<Group> = await prisma.groups();
        const groupList = await Promise.all(
            groupListRaw.map(async item => ({
                group: item,
                master: await prisma.group({ id: item.id }).master(),
                count: await prisma
                    .usersConnection({
                        where: {
                            group_some: {
                                id: item.id
                            }
                        }
                    })
                    .aggregate()
                    .count()
            }))
        );
        res.json({ code: 1, msg: groupList });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const groupUserList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { gid } = req.params;
        const groupUserList: Array<User> = await prisma.users({
            where: {
                group_some: {
                    id: gid
                }
            }
        });
        const groupInfo = await prisma.group({
            id: gid
        });
        res.json({ code: 1, msg: { list: groupUserList, info: groupInfo } });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};
