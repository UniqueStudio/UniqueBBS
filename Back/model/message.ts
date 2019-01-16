import { prisma, Message } from "../generated/prisma-client";
import { Request, Response } from "express";
import { verifyJWT } from "./check";
import { pagesize } from "./consts";

export const MESSAGE_REPLY = (username, subject) => `${username}回复了您的帖子《${subject}》！`;
export const MESSAGE_QUOTE = (username, subject) => `${username}引用了您在帖子《${subject}》中的回复！`;
export const MESSAGE_DIAMOND = subject => `您的帖子《${subject}》被管理员设置为精华帖子！`;

export const pushMessage = async function(fromUid: string, toUid: string, msg: string) {
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
        const authObj = verifyJWT(req.header("Authorization"));
        const uid = authObj.uid;
        const { id } = req.params;
        const result = await prisma.updateManyMessages({
            where: {
                id: id,
                toUser: {
                    id: uid
                },
                isRead: false
            },
            data: {
                isRead: true
            }
        });
        res.json({ code: 1 });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageList = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const uid = authObj.uid;
        let { page } = req.body;
        page = Number.parseInt(page);

        const resultRAW: Array<Message> = await prisma.messages({
            where: {
                toUser: {
                    id: uid
                }
            },
            skip: (page - 1) * pagesize,
            first: pagesize,
            orderBy: "createDate_DESC"
        });

        const result = await Promise.all(
            resultRAW.map(async item => ({
                message: item,
                fromUser: await prisma
                    .message({
                        id: item.id
                    })
                    .fromUser(),
                toUser: await prisma
                    .message({
                        id: item.id
                    })
                    .toUser()
            }))
        );
        res.json({ code: 1, msg: result });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};
