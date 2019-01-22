import { Request, Response } from "express";
import * as parser from "fast-xml-parser";
import { wxMsgToken, wxMsgAESKEY, wxAppID } from "./consts";
import { prisma } from "../generated/prisma-client";
const WXCrypto = require("./module/wx.class")
const wxCrypto = new WXCrypto(wxMsgToken, wxMsgAESKEY, wxAppID);

const WX_CREATE_USER = "create_user";
const WX_UPDATE_USER = "update_user";
const WX_DELETE_USER = "delete_user";

interface userInfo {
    Name: string;
    Department: Array<string>;
    IsLeaderInDept: Array<string>;
    Mobile: string;
    Email: string;
    Avatar: string;
    UserID: string;
}

export const wechatHandleMessage = async function(req: Request, res: Response) {
    try {
        const { msg_signature, timestamp, nonce } = req.query;
        const receiveJSON = parser.parse(req.body);
        const encrypt_msg = receiveJSON.xml.Encrypt;

        const check_msg_signature = wxCrypto.encrypt(timestamp, nonce, encrypt_msg);
        if (msg_signature === check_msg_signature) {
            const decrypt_msg = wxCrypto.decrypt(encrypt_msg);

            const decryptJSON = parser.parse(decrypt_msg);
            const changeType = decryptJSON.xml.ChangeType;
            const data = decryptJSON.xml;

            const userInfo: userInfo = {
                Name: data.Name,
                Department: data.Department.split(","),
                IsLeaderInDept: data.IsLeaderInDept.split(","),
                Mobile: data.Mobile,
                Email: data.Email,
                Avatar: data.Avatar,
                UserID: data.UserID
            };

            switch (changeType) {
                case WX_CREATE_USER:
                    await createUser(userInfo);
                    break;
                case WX_UPDATE_USER:
                    await updateUser(userInfo);
                    break;
                case WX_DELETE_USER:
                    await deleteUser(decryptJSON.xml.UserID);
                    break;
            }

            res.status(200).send(decrypt_msg);
        } else {
            res.status(500);
        }
    } catch {
        res.status(500);
    }
};

export const wechatHandleCheck = async function(req: Request, res: Response) {
    try {
        const { msg_signature, timestamp, nonce, echostr } = req.query;
        const check_msg_signature = wxCrypto.encrypt(timestamp, nonce, echostr);
        if (msg_signature === check_msg_signature) {
            const decrypt_msg = wxCrypto.decrypt(echostr);
            res.status(200).send(decrypt_msg);
        } else {
            res.status(500);
        }
    } catch {
        res.status(500);
    }
};

const createUser = async function(userInfo: userInfo) {
    const groupList = userInfo.Department.map(item => ({
        key: Number.parseInt(item)
    }));
    const user = await prisma.createUser({
        userid: userInfo.UserID,
        username: userInfo.Name,
        lastLogin: new Date(),
        email: userInfo.Email,
        mobile: userInfo.Mobile,
        avatar: userInfo.Avatar,
        group: {
            connect: groupList
        }
    });
    userInfo.IsLeaderInDept.forEach(async (item, index) => {
        if (item === "1") {
            const key = groupList[index].key;
            await prisma.updateGroup({
                where: {
                    key: key
                },
                data: {
                    master: {
                        connect: { id: user.id }
                    }
                }
            });
        }
    });
};

const updateUser = async function(userInfo: userInfo) {
    const groupList = userInfo.Department.map(item => ({
        key: Number.parseInt(item)
    }));
    const user = await prisma.updateUser({
        where: {
            userid: userInfo.UserID
        },
        data: {
            username: userInfo.Name,
            lastLogin: new Date(),
            email: userInfo.Email,
            mobile: userInfo.Mobile,
            avatar: userInfo.Avatar,
            group: {
                connect: groupList
            }
        }
    });
    userInfo.IsLeaderInDept.forEach(async (item, index) => {
        if (item === "1") {
            const key = groupList[index].key;
            await prisma.updateGroup({
                where: {
                    key: key
                },
                data: {
                    master: {
                        connect: { id: user.id }
                    }
                }
            });
        }
    });
};

const deleteUser = async function(UserID: string) {
    await prisma.updateUser({
        where: {
            userid: UserID
        },
        data: {
            active: false
        }
    });
};
