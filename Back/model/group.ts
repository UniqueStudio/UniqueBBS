import { prisma, User, Group } from "../generated/prisma-client"
import { verifyJWT } from "./check"
import { Request, Response } from 'express'
import { filterUsersInfo } from "./user"

export const getGroupUserList = async function (req: Request, res: Response) {
    try {
        verifyJWT(req.get('Authorization'));
        const { gid } = req.body;
        const userList: Array<User> = await prisma.users({
            where: {
                group_some: {
                    id: gid
                }
            }
        });
        res.json({ code: 1, msg: filterUsersInfo(userList) });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const getGroupList = async function (req: Request, res: Response) {
    try {
        verifyJWT(req.get('Authorization'));
        const groupList: Array<Group> = await prisma.groups();
        res.json({ code: 1, msg: groupList });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};