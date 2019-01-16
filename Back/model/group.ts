import { prisma, Group, User } from "../generated/prisma-client";
import { verifyJWT } from "./check";
import { Request, Response } from "express";

export const groupList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const groupList: Array<Group> = await prisma.groups();
        res.json({ code: 1, msg: groupList });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const groupMemberList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { gid } = req.params;
        const groupMemberList: Array<User> = await prisma.users({
            where: {
                group_some: {
                    id: gid
                }
            }
        });
        res.json({ code: 1, msg: groupMemberList });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};
