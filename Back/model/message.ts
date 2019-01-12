import { prisma, Message } from "../generated/prisma-client"
import { Request, Response } from 'express';
import { verifyJWT } from "./check";

export const pushMessage = async function (fromUid, toUid, msg) {
    await sendMessage(fromUid, toUid, msg);
    // todo: -> mobile email ...
};

export const sendMessage = async function (fromUid, toUid, msg) {
    const result: Message = await prisma.createMessage({
        fromUser: {
            connect: {
                id: fromUid
            }
        }, toUser: {
            connect: {
                id: toUid
            }
        },
        message: msg
    });
    return result;
};

export const messageIsRead = async function (req: Request, res: Response) {
    try {
        verifyJWT(req.get('Authorization'));
        const { mid } = req.params;
        const result: Message = await prisma.updateMessage({
            where: {
                id: mid
            },
            data: {
                isRead: true
            }
        });
        res.json({ code: 1, msg: result });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};
