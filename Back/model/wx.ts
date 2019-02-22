import { Request, Response } from "express";
import parser from "fast-xml-parser";
import { wxMsgToken, wxMsgAESKEY, wxAppID, userInfoURL } from "./consts";
import { prisma } from "../generated/prisma-client";
import downloadImg from "../utils/downloadImg";
import processJoinTime from "../utils/processJoinTime";
import fs from "fs";
import { getAccessToken } from "./check";

const WXCrypto = require("./module/wx.class");
const wxCrypto = new WXCrypto(wxMsgToken, wxMsgAESKEY, wxAppID);

const WX_CREATE_USER = "create_user";
const WX_UPDATE_USER = "update_user";
const WX_DELETE_USER = "delete_user";

interface UserInfo {
    Name: string;
    Department: Array<string>;
    IsLeaderInDept: Array<string>;
    Mobile: string;
    Email: string;
    Avatar: string;
    UserID: string;
}

const avatarPath =
    process.env.MODE === "DEV" ? `./upload/avatar` : `/var/bbs/upload/avatar`;

export const wechatHandleMessage = async function(req: Request, res: Response) {
    try {
        const { msg_signature, timestamp, nonce } = req.query;
        const receiveJSON = parser.parse(req.body);
        const encrypt_msg = receiveJSON.xml.Encrypt;

        const check_msg_signature = wxCrypto.encrypt(
            timestamp,
            nonce,
            encrypt_msg
        );
        if (msg_signature === check_msg_signature) {
            const decrypt_msg = wxCrypto.decrypt(encrypt_msg);

            const decryptJSON = parser.parse(decrypt_msg);
            const changeType = decryptJSON.xml.ChangeType;
            const data = decryptJSON.xml;

            const userInfo: UserInfo = {
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
                    createUser(userInfo);
                    break;
                case WX_UPDATE_USER:
                    updateUser(userInfo);
                    break;
                case WX_DELETE_USER:
                    deleteUser(decryptJSON.xml.UserID);
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

const createUser = async function(userInfo: UserInfo) {
    const groupList = userInfo.Department.map(item => ({
        key: Number.parseInt(item)
    }));

    await downloadImg(
        userInfo.Avatar,
        `${avatarPath}/${userInfo.UserID}.avatar`
    );
    const user = await prisma.createUser({
        userid: userInfo.UserID,
        username: userInfo.Name,
        lastLogin: new Date(),
        email: userInfo.Email,
        mobile: userInfo.Mobile,
        avatar: `unique://${userInfo.UserID}`,
        group: {
            connect: groupList
        }
    });

    await getUserJoinTime(user.id, userInfo.UserID);

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

const updateUser = async function(userInfo: UserInfo) {
    await downloadImg(
        userInfo.Avatar,
        `${avatarPath}/${userInfo.UserID}.avatar`
    );

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
            avatar: `unique://${userInfo.UserID}`,
            group: {
                connect: groupList
            }
        }
    });

    await getUserJoinTime(user.id, userInfo.UserID);

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
    try {
        if (fs.existsSync(`${avatarPath}/${UserID}.avatar`)) {
            fs.unlinkSync(`${avatarPath}/${UserID}.avatar`);
        }
    } catch (e) {
        console.log(e.message);
    }

    await prisma.updateUser({
        where: {
            userid: UserID
        },
        data: {
            active: false
        }
    });
};

const getUserJoinTime = async function(id: string, userid: string) {
    try {
        const accessToken = await getAccessToken();
        const userInfoResponse = await fetch(userInfoURL(accessToken, userid));
        const userInfo = await userInfoResponse.json();
        if (userInfo) {
            await prisma.updateUser({
                where: {
                    id: id
                },
                data: {
                    joinTime: processJoinTime(userInfo)
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
};
