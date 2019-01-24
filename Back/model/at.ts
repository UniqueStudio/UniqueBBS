import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { pushMessageGroup, pushMessage, MESSAGE_THREAD_URL } from "./message";

export interface atInfo {
    at: string;
    type: "group" | "user" | null;
    id: string | null;
}

export const atReg = /(?<=@)(.+?)(?=\s)/gi;

export const atFind = async function(at: string): Promise<atInfo> {
    const userResult = await prisma.users({
        where: {
            username: at
        }
    });
    if (userResult.length === 1) {
        return { at: at, type: "user", id: userResult[0].id };
    }
    const groupResult = await prisma.groups({
        where: {
            name: at
        }
    });
    if (groupResult.length === 1) {
        return { at: at, type: "group", id: groupResult[0].id };
    }

    return { at: at, type: null, id: null };
};

export const atResult = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { keywords } = req.body;
        const resultArr: Array<atInfo> = [];
        for (let keyword of keywords as Array<string>) {
            const result = await atFind(keyword);
            if (result.type !== null) {
                result.at = "@" + result.at;
                resultArr.push(result);
            }
        }
        res.json({ code: 1, msg: resultArr });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const atProcess = async function(
    keywords: string,
    fromUid: string,
    sendMessage: string,
    tid: string,
    isAdmin: boolean
) {
    const keywordsArr = keywords.match(atReg);
    if (!keywordsArr) return;
    for (const keyword of keywordsArr) {
        const atResult = await atFind(keyword);
        if (atResult.type === "user") {
            await pushMessage(
                fromUid,
                atResult.id,
                sendMessage,
                MESSAGE_THREAD_URL(tid)
            );
        } else if (atResult.type === "group" && isAdmin) {
            await pushMessageGroup(
                fromUid,
                atResult.id,
                sendMessage,
                MESSAGE_THREAD_URL(tid)
            );
        }
    }
};
