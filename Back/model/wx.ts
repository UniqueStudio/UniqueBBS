import { Request, Response } from "express";
import parser from "fast-xml-parser";
import { wxMsgToken, wxMsgAESKEY, wxAppID } from "./consts";
import { syncUpdateUser, syncCreateUser, syncDeleteUser } from "./sync";

const WXCrypto = require("./module/wx.class");
const wxCrypto = new WXCrypto(wxMsgToken, wxMsgAESKEY, wxAppID);

const WX_CREATE_USER = "create_user";
const WX_UPDATE_USER = "update_user";
const WX_DELETE_USER = "delete_user";

interface UserInfo {
    Name: string;
    UserID: string;
}

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
                UserID: data.UserID
            };

            switch (changeType) {
                case WX_CREATE_USER:
                    syncCreateUser(userInfo.UserID);
                    break;
                case WX_UPDATE_USER:
                    syncUpdateUser(userInfo.UserID, "USERID");
                    break;
                case WX_DELETE_USER:
                    syncDeleteUser(decryptJSON.xml.UserID, "USERID");
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
