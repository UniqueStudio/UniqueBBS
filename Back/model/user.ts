import { prisma, User } from "../generated/prisma-client"
import fetch from 'node-fetch';
import { scanningURL, userIDURL, userInfoURL, getQRCodeURL, filterUserKeys } from './consts';
import { Request, Response } from 'express';
import { addSaltPasswordOnce, getAccessToken, signJWT } from "./check";

export const userInfo = async function (req: Request, res: Response) {
    const { id } = req.params;
    const result = await prisma.user({
        id: id
    });
    res.json({ code: 1, msg: filterUserInfo(result) });
};

export const userLoginByPwd = async function (req: Request, res: Response) {
    const { nickname, pwd } = req.params;

    const userInfoArr = await prisma.users({
        where: {
            nickname: nickname
        }
    });

    if (userInfoArr.length !== 1) {
        return res.json({ code: -1, msg: "昵称不存在或未设置！" });
    }

    const userInfo = userInfoArr[0];
    if (userInfo.password === "" || userInfo.password === null || userInfo.password === undefined) {
        return res.json({ code: -1, msg: "未设置密码，请通过扫码登录！" });
    }

    const pwd_salt = addSaltPasswordOnce(pwd);
    if (pwd_salt === userInfo.password) {
        const token = signJWT(userInfo.id , userInfo.isAdmin);
        prisma.updateUser({
            where:{
                id: userInfo.id
            },
            data:{
                lastLogin: new Date()
            }
        });
        res.send({ code: 1, msg: { uid : userInfo.id , token } });
    } else {
        return res.json({ code: -1, msg: "密码错误！" });
    }

};

export const updateUserInfoFromWx = async (userid: string) => {
    const accessToken = await getAccessToken();
    const userInfoResponse = await fetch(userInfoURL(accessToken, userid));
    const user = await userInfoResponse.json();
    if (user.errcode !== 0) {
        return false;
    }

    const groups = await prisma.groups();
    let groupList = {};
    let groupKeyList: Array<[number, string]> = [];
    for (let group of groups) {
        groupList["group_k" + group.key] = group.id;
        groupKeyList.push([group.key, group.name]);
    }

    const userGroupArr = user.department;
    let userGroup: Array<{ id: string }> = [];
    for (let userGroupKey of userGroupArr) {
        userGroup.push({
            id: groupList["group_k" + userGroupKey]
        });
    }

    const dataObj = {
        username: user.name,
        mobile: user.mobile,
        avatar: user.avatar,
        userid: user.userid,
        email: user.email,
        lastLogin: new Date(),
        group: {
            connect: userGroup
        },
        isAdmin: user.isleader === 1,
    };

    const userUpdate = await prisma.updateUser({
        where: {
            userid: user.userid
        },
        data: dataObj
    });

    return true;
};

export const handleScan = async function (req: Request, res: Response) {
    try {
        const scanResponse = await fetch(`${scanningURL}${req.params.key}`);
        const scanResult = await scanResponse.text();
        const status = JSON.parse(scanResult.match(/{.+}/)![0]).status;
        if (status === 'QRCODE_SCAN_ING') {
            const loginResponse = await fetch(`${scanningURL}${req.params.key}&lastStatus=${status}`);
            const loginResult = await loginResponse.text();
            const loginObj = JSON.parse(loginResult.match(/{.+}/)![0]);
            if (loginObj.status === 'QRCODE_SCAN_SUCC') {
                const auth_code = loginObj.auth_code;
                const accessToken = await getAccessToken();
                const userIDResponse = await fetch(userIDURL(accessToken, auth_code));
                const userIDResult = await userIDResponse.json();
                const userID = userIDResult.UserId;
                const user = await prisma.users({
                    where: {
                        userid: userID
                    }
                });

                if (!user.length) {
                    res.send({ code: -1, msg: '用户不存在！' });
                } else {
                    let _user = user[0];
                    const token = signJWT(_user.id , _user.isAdmin);
                    prisma.updateUser({
                        where:{
                            id: _user.id
                        },
                        data:{
                            lastLogin: new Date()
                        }
                    });
                    res.send({ code: 1, msg: { uid : _user.id , token } });
                }
                
            } else {
                res.send({ code: -1, msg: '登录失败' });
                return;
            }
        } else {
            res.send({ code: -1, msg: '登录超时，请重新登录' });
            return;
        }
    } catch (err) {
        res.send({ code: -1, msg: err.message });
    }
};

export const handleLogin = async function (req: Request, res: Response) {
    try {
        const response = await fetch(getQRCodeURL);
        const html = await response.text();
        const key = html.match(/key ?: ?"\w+/)![0].replace(/key ?: ?"/, '');
        res.send({ key, type: 'success' });
    } catch (err) {
        res.send({ message: err.message, type: 'warning' });
    }
};

export const filterUserInfo = function (user: User) {
    for (let key of filterUserKeys) {
        delete user[key];
    }
    return user;
};

export const filterUsersInfo = function (users: Array<User>) {
    for (let user of users) {
        user = filterUserInfo(user);
    }
    return users;
};