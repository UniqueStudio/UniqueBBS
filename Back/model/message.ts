import { prisma, Message } from "../generated/prisma-client";
import { Request, Response } from "express";
import { verifyJWT } from "./check";

export const MESSAGE_REPLY = (username, subject) =>
    `${username}回复了您的帖子《${subject}》！`;
export const MESSAGE_QUOTE = (username, subject) =>
    `${username}引用了您在帖子《${subject}》中的回复！`;
export const MESSAGE_DIAMOND = subject =>
    `您的帖子《${subject}》被管理员设置为精华帖子！`;

export const pushMessage = async function(fromUid, toUid, msg) {
    await sendMessage(fromUid, toUid, msg);
    // todo: -> mobile email ...
};

export const sendMessage = async function(fromUid, toUid, msg) {
    const result: Message = await prisma.createMessage({
        fromUser: {
            connect: {
                id: fromUid
            }
        },
        toUser: {
            connect: {
                id: toUid
            }
        },
        message: msg,
        createDate: new Date()
    });
    return result;
};

export const messageIsRead = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
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
