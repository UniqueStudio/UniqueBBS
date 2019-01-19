import { Request, Response } from "express";
import * as parser from "fast-xml-parser";
import * as crypto from "crypto";
import { wxMsgToken, wxMsgAESKEY } from "./consts";
import { prisma } from "../generated/prisma-client";

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

        const check_msg_signature = returnEncrypted(timestamp, nonce, encrypt_msg);
        if (msg_signature === check_msg_signature || 1) {
            const { msg: decrypt_msg, receiveid } = readMessage(encrypt_msg);

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
        const check_encrypt_msg = returnEncrypted(timestamp, nonce, echostr);
        if (msg_signature === check_encrypt_msg) {
            const { msg: decrypt_msg, receiveid } = readMessage(echostr);
            res.status(200).send(decrypt_msg);
        } else {
            res.status(500);
        }
    } catch {
        res.status(500);
    }
};

const returnEncrypted = function(timestamp: string, nonce: string, msg_encrypt: string): string {
    const str: string = [wxMsgToken, timestamp, nonce, msg_encrypt].sort().join("");
    return crypto
        .createHash("sha1")
        .update(str)
        .digest("hex");
};

const readMessage = function(encrypt_msg: string) {
    const encrypt_msg_decoded = Buffer.from(encrypt_msg, "base64").toString();

    const decipher = crypto.createDecipher("aes-256-ccm", wxMsgAESKEY);
    let decrypted = decipher.update(encrypt_msg_decoded, "hex", "utf8");
    decrypted += decipher.final("utf8");
    const decrypt_msg_rand = decrypted;

    const decrypt_msg_body = decrypt_msg_rand.substr(16);
    const decrypt_msg_length = Number.parseInt(decrypt_msg_body.substr(0, 4));
    const decrypt_msg = decrypt_msg_body.substr(4).substr(0, decrypt_msg_length);
    const receiveid = decrypt_msg_body.substr(4).substr(decrypt_msg_length);

    return {
        msg: decrypt_msg,
        receiveid: receiveid
    };
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
