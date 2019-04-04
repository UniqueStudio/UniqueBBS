import { prisma, Message } from "../generated/prisma-client";
import { Request, Response } from "express";
import { verifyJWT, filterUserInfo, getAccessToken } from "./check";
import { pagesize, wxMsgPushURL } from "./consts";
import { socketPushMessage } from "./socket";

export const MESSAGE_REPLY = (username: string, subject: string) =>
    `${username}回复了您的帖子《${subject}》！`;
export const MESSAGE_QUOTE = (username: string, subject: string) =>
    `${username}引用了您在帖子《${subject}》中的回复！`;
export const MESSAGE_DIAMOND = (subject: string) =>
    `您的帖子《${subject}》被管理员设置为精华帖子！`;
export const MESSAGE_SET_MENTOR = (fromUsername: string) =>
    `${fromUsername}将您设为了Mentor！`;
export const MESSAGE_AT = (
    fromUsername: string,
    subject: string,
    isReply: Boolean
) =>
    `${fromUsername}在帖子《${subject}》${isReply ? "的回复" : ""}中提到了您。`;

export type WxPushMsgToObj =
    | {
          touser: string;
      }
    | { toparty: string };

export const MESSAGE_THREAD_URL = (tid: string) => `/thread/info/${tid}/1`;
export const MESSAGE_REPORT_URL = `/report/mentor`;

export const pushMessage = async function(
    fromUid: string,
    toUid: string,
    msg: string,
    url?: string
) {
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
        createDate: new Date(),
        url: url
    });
    await socketPushMessage(toUid, msg);
    return result;
};

export const pushMessageGroup = async function(
    fromUid: string,
    toGroup: string,
    msg: string,
    url?: string
) {
    const groupUserListRaw = await prisma.users({
        where: {
            group_some: {
                id: toGroup
            }
        }
    });

    const groupUserList = groupUserListRaw.filter(item => item.id !== fromUid);

    for (const user of groupUserList) {
        if (url) {
            await pushMessage(fromUid, user.id, msg, url);
        } else {
            await pushMessage(fromUid, user.id, msg);
        }
    }
};

export const messageIsRead = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { id } = req.params;

        const messageInfo = await prisma.message({
            id: id
        });

        if (!messageInfo) {
            res.json({ code: -1, msg: "此条消息不存在！" });
            return;
        }

        if (messageInfo.isRead) {
            res.json({ code: 1 });
            return;
        }

        const messageToUserInfo = await prisma
            .message({
                id: id
            })
            .toUser();

        if (!isAdmin && uid !== messageToUserInfo.id) {
            res.json({ code: -1, msg: "您无权操作此条消息。" });
            return;
        }

        await prisma.updateMessage({
            where: {
                id: id
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
        const { uid } = verifyJWT(req.header("Authorization"));
        let { page } = req.params;
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
                messageItem: item,
                fromUser: filterUserInfo(
                    await prisma
                        .message({
                            id: item.id
                        })
                        .fromUser()
                )
            }))
        );
        res.json({ code: 1, msg: result });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageDelete = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { id } = req.params;
        const messageInfo = await prisma.message({
            id: id
        });

        if (!messageInfo) {
            res.json({ code: -1, msg: "此条消息不存在！" });
            return;
        }

        const messageToUserInfo = await prisma
            .message({
                id: id
            })
            .toUser();

        if (!isAdmin && uid !== messageToUserInfo.id) {
            res.json({ code: -1, msg: "您无权操作此条消息。" });
            return;
        }

        await prisma.deleteMessage({
            id: id
        });

        res.json({ code: 1 });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageReadAll = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        await prisma.updateManyMessages({
            where: {
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

export const messageDeleteAll = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        await prisma.deleteManyMessages({
            toUser: {
                id: uid
            }
        });
        res.json({ code: 1 });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageCount = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const total = await prisma
            .messagesConnection({
                where: {
                    toUser: {
                        id: uid
                    }
                }
            })
            .aggregate()
            .count();
        const unread = await prisma
            .messagesConnection({
                where: {
                    toUser: {
                        id: uid
                    },
                    isRead: false
                }
            })
            .aggregate()
            .count();

        const [last] = await prisma.messages({
            where: {
                toUser: {
                    id: uid
                }
            },
            orderBy: "createDate_DESC",
            first: 1
        });

        res.json({ code: 1, msg: { total, unread, last } });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageSuperPush = async function(req: Request, res: Response) {
    try {
        const { isAdmin } = verifyJWT(req.header("Authorization"));
        if (!isAdmin) {
            res.json({ code: -1, msg: "您无权向团队成员推送消息！" });
            return;
        }
        const { groupLists, content, url } = req.body;

        if (!content) {
            res.json({ code: -1, msg: "请输入要推送的通知内容！" });
            return;
        }

        messageWxPushGroup(groupLists, content, url, "团队公告");

        (async () => {
            const [adminAccount] = await prisma.users({
                where: {
                    username: "杨子越"
                }
            });

            const willPushUids: string[] = [];

            for (const gid of groupLists as string[]) {
                const users = await prisma.users({
                    where: {
                        group_some: {
                            id: gid
                        }
                    }
                });
                willPushUids.push(...users.map(item => item.id));
            }

            const uniquePushUids = [...new Set(willPushUids)];
            for (const uid of uniquePushUids) {
                await pushMessage(adminAccount.id, uid, content, url);
            }
        })();

        res.json({ code: 1 });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const messageWxPushUser = async function(
    uids: string[],
    content: string,
    url?: string,
    title?: string
) {
    try {
        const userIdLists = await Promise.all(
            uids.map(async item => {
                const userInfo = await prisma.user({
                    id: item
                });
                return userInfo.userid;
            })
        );

        const userIdsString = userIdLists.filter(item => !!item).join("|");

        const toObj = {
            touser: userIdsString
        } as WxPushMsgToObj;

        await messageWxPush(toObj, content, url, title);
    } catch (e) {
        console.log(e.message);
    }
};

export const messageWxPushGroup = async function(
    gids: string[],
    content: string,
    url?: string,
    title?: string
) {
    try {
        const groupKeyLists = await Promise.all(
            gids.map(async item => {
                const groupInfo = await prisma.group({
                    id: item
                });
                return groupInfo.key;
            })
        );

        const groupKeyString = groupKeyLists.filter(item => !!item).join("|");

        const toObj = {
            toparty: groupKeyString
        } as WxPushMsgToObj;

        await messageWxPush(toObj, content, url, title);
    } catch (e) {
        console.log(e.message);
    }
};

export const messageWxPush = async function(
    toSomeObj: WxPushMsgToObj,
    content: string,
    url?: string,
    title?: string
) {
    try {
        if (url && url.substr(0, 1) === "/") {
            url = "https://bbs.hustunique.com" + url;
        }

        const reqBody = {
            ...toSomeObj,
            msgtype: "textcard",
            agentid: process.env.AGENTID,
            textcard: {
                title: title ? title : "论坛消息提醒",
                description: content,
                url: url ? url : "https://bbs.hustunique.com/user/my/notice/1",
                btntxt: "消息中心"
            }
        };

        const accessToken = await getAccessToken();
        await fetch(wxMsgPushURL(accessToken), {
            method: "post",
            body: JSON.stringify(reqBody)
        });
    } catch (e) {
        console.log(e.message);
    }
};
