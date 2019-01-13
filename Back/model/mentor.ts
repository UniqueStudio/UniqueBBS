import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { verifyJWT, filterUserInfo } from "./check";

export const mentorGet = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const uid: string = authObj.uid;

        const result = await prisma.user({
            id:uid
        }).mentor();

        res.json({ code: 1, msg: filterUserInfo(result) });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const mentorSet = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const uid: string = authObj.uid;

        const { mentorUid } = req.body;

        const mentorInfo = await prisma.user({
            id: mentorUid
        });

        if (!mentorInfo || mentorInfo.id === uid) {
            return res.json({ code: -1, msg: "Mentor不合法！" });
        }

        const result = await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                mentor: {
                    connect: {
                        id: mentorUid
                    }
                }
            }
        });

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
