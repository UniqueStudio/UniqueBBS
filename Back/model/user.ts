import { prisma, User } from "../generated/prisma-client";
import fetch from "node-fetch";
import { scanningURL, userIDURL, getQRCodeURL, pagesize } from "./consts";
import { Request, Response } from "express";
import {
    addSaltPasswordOnce,
    getAccessToken,
    signJWT,
    verifyJWT,
    filterMyInfo,
    filterUserInfo,
    filterUsersInfo
} from "./check";
import {
    pushMessage,
    MESSAGE_SET_MENTOR,
    MESSAGE_REPORT_URL,
    messageWxPushUser
} from "./message";
import { syncUpdateUser } from "./sync";
import { setLockExpireIncr } from "./lock";
import { filterUserAvatar } from "./check";
import fs from "fs";
import { MODE } from "../server";

export const userInfo = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { uid } = req.params;
        const result = await prisma.user({
            id: uid
        });
        const group = await prisma
            .user({
                id: uid
            })
            .group();
        res.json({
            code: 1,
            msg: { user: filterUserInfo(result), group: group }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userThreads = async function(req: Request, res: Response) {
    try {
        const { uid: myUid, isAdmin } = verifyJWT(req.header("Authorization"));
        let { uid, page } = req.params;
        page = Number.parseInt(page);

        const result = await prisma.threads({
            where: {
                user: {
                    id: uid,
                    active: myUid === uid || isAdmin ? undefined : true
                }
            },
            orderBy: "lastDate_DESC",
            skip: (page - 1) * pagesize,
            first: pagesize
        });

        const number = await prisma
            .threadsConnection({
                where: {
                    user: {
                        id: uid,
                        active: myUid === uid || isAdmin ? undefined : true
                    }
                }
            })
            .aggregate()
            .count();

        res.json({ code: 1, msg: { list: result, count: number } });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userPosts = async function(req: Request, res: Response) {
    try {
        const { uid: myUid, isAdmin } = verifyJWT(req.header("Authorization"));
        let { uid, page } = req.params;
        page = Number.parseInt(page);

        const resultRaw = await prisma.posts({
            where: {
                user: {
                    id: uid,
                    active: myUid === uid || isAdmin ? undefined : true
                }
            },
            orderBy: "createDate_DESC",
            skip: (page - 1) * pagesize,
            first: pagesize
        });

        const result = await Promise.all(
            resultRaw.map(async item => ({
                post: item,
                thread: await prisma.post({ id: item.id }).thread()
            }))
        );

        const count = await prisma
            .postsConnection({
                where: {
                    user: {
                        id: uid,
                        active: myUid === uid || isAdmin ? undefined : true
                    }
                }
            })
            .aggregate()
            .count();

        res.json({ code: 1, msg: { list: result, count } });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userMyInfo = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const result = await prisma.user({
            id: uid
        });
        const group = await prisma
            .user({
                id: uid
            })
            .group();
        res.json({
            code: 1,
            msg: { user: filterMyInfo(result), group: group }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userLoginByPwd = async function(req: Request, res: Response) {
    const { nickname, pwd } = req.body;
    const userInfoArr = await prisma.users({
        where: {
            nickname: nickname
        }
    });

    if (userInfoArr.length !== 1) {
        res.json({
            code: -1,
            msg: `昵称${nickname}不存在！请设置昵称后再登录！`
        });
        return;
    }

    const userInfo = userInfoArr[0];
    if (
        userInfo.password === "" ||
        userInfo.password === null ||
        userInfo.password === undefined
    ) {
        res.json({ code: -1, msg: "未设置密码，请通过扫码登录！" });
        return;
    }

    const pwd_salt = addSaltPasswordOnce(pwd);
    if (pwd_salt === userInfo.password) {
        if (!userInfo.active) {
            res.json({
                code: -1,
                msg: "当前账号不活跃，无法登录！"
            });
            return;
        }

        const token = signJWT(userInfo.id, userInfo.isAdmin, userInfo.username);
        prisma.updateUser({
            where: {
                id: userInfo.id
            },
            data: {
                lastLogin: new Date()
            }
        });
        res.json({
            code: 1,
            msg: {
                uid: userInfo.id,
                token,
                isAdmin: userInfo.isAdmin,
                avatar: filterUserAvatar(userInfo.avatar),
                username: userInfo.username,
                userid: userInfo.userid
            }
        });
    } else {
        res.json({ code: -1, msg: "密码错误！" });
        return;
    }
};

export const userPwdReset = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const uid = authObj.uid;
        const { previousPwd, newPwd } = req.body;
        const nowUser = await prisma.user({
            id: uid
        });

        const previousPwdSalted = addSaltPasswordOnce(previousPwd);
        if (
            previousPwdSalted !== nowUser.password &&
            nowUser.password !== null &&
            nowUser.password !== undefined
        ) {
            res.json({
                code: -1,
                msg: "您当前的密码输入错误，请重新输入！"
            });
            return;
        } else {
            await prisma.updateUser({
                where: {
                    id: uid
                },
                data: {
                    password: addSaltPasswordOnce(newPwd)
                }
            });
        }
        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userInfoUpdate = async function(req: Request, res: Response) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));
        const uid = authObj.uid;
        const {
            studentID,
            dormitory,
            qq,
            wechat,
            major,
            className,
            nickname,
            signature
        } = req.body;

        const checkUser = await prisma.users({
            where: {
                nickname: nickname
            }
        });

        if (studentID.length >= 20) {
            res.json({ code: -1, msg: "学号过长，请检查后再输入！" });
            return;
        }
        if (dormitory.length >= 20) {
            res.json({ code: -1, msg: "宿舍号过长，请检查后再输入！" });
            return;
        }
        if (qq.length >= 20) {
            res.json({ code: -1, msg: "QQ号过长，请检查后再输入！" });
            return;
        }
        if (major.length >= 20) {
            res.json({ code: -1, msg: "专业过长，请检查后再输入！" });
            return;
        }
        if (className.length >= 20) {
            res.json({ code: -1, msg: "班级过长，请检查后再输入！" });
            return;
        }
        if (signature.length >= 100) {
            res.json({
                code: -1,
                msg: "个人签名最多100字符，请重新输入！"
            });
            return;
        }
        if (checkUser.length !== 0 && checkUser[0].id !== uid) {
            res.json({ code: -1, msg: "该昵称已被占用！" });
            return;
        }

        await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                studentID,
                dormitory,
                qq,
                wechat,
                major,
                className,
                nickname,
                signature
            }
        });
        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userInfoUpdateFromWx = async function(
    req: Request,
    res: Response
) {
    try {
        const authObj = verifyJWT(req.header("Authorization"));

        const wxUpdateLock = await setLockExpireIncr(
            `wxUpdateUser:${authObj.uid}`,
            "300",
            2
        );
        if (!wxUpdateLock) {
            res.json({
                code: -1,
                msg: "每5分钟只能同步2次微信个人信息，请稍后重试！"
            });
            return;
        }

        syncUpdateUser(authObj.uid, "UID");

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userScan = async function(req: Request, res: Response) {
    try {
        const scanResponse = await fetch(`${scanningURL}${req.params.key}`);
        const scanResult = await scanResponse.text();
        const status = JSON.parse(scanResult.match(/{.+}/)![0]).status;
        if (status === "QRCODE_SCAN_ING") {
            const loginResponse = await fetch(
                `${scanningURL}${req.params.key}&lastStatus=${status}`
            );
            const loginResult = await loginResponse.text();
            const loginObj = JSON.parse(loginResult.match(/{.+}/)![0]);
            if (loginObj.status === "QRCODE_SCAN_SUCC") {
                const auth_code = loginObj.auth_code;
                const accessToken = await getAccessToken();
                const userIDResponse = await fetch(
                    userIDURL(accessToken, auth_code)
                );
                const userIDResult = await userIDResponse.json();
                const userID = userIDResult.UserId;
                const user = await prisma.users({
                    where: {
                        userid: userID
                    }
                });

                if (!user.length) {
                    res.json({ code: -2, msg: "用户不存在！" });
                } else {
                    let _user = user[0];
                    if (!_user.active) {
                        res.json({
                            code: -2,
                            msg: "当前账号不活跃，请联系管理员！"
                        });
                        return;
                    }
                    const token = signJWT(
                        _user.id,
                        _user.isAdmin,
                        _user.username
                    );
                    prisma.updateUser({
                        where: {
                            id: _user.id
                        },
                        data: {
                            lastLogin: new Date()
                        }
                    });
                    res.json({
                        code: 1,
                        msg: {
                            uid: _user.id,
                            token,
                            isAdmin: _user.isAdmin,
                            avatar: filterUserAvatar(_user.avatar),
                            username: _user.username
                        }
                    });
                }
            } else {
                res.json({ code: -1, msg: "登录失败！" });
            }
        } else {
            res.json({ code: -2, msg: "登录超时，请重新登录！" });
        }
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const userQRLogin = async function(_req: Request, res: Response) {
    try {
        const response = await fetch(getQRCodeURL);
        const html = await response.text();
        const key = html.match(/key ?: ?"\w+/)![0].replace(/key ?: ?"/, "");
        res.json({ code: 1, msg: key });
    } catch (err) {
        res.json({ code: -1, msg: err.message });
    }
};

export const mentorInfo = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));

        const { uid } = req.params;

        const myInfo = await prisma.user({
            id: uid
        });

        const result = await prisma
            .user({
                id: uid
            })
            .mentor();
        if (result) {
            res.json({
                code: 1,
                msg: {
                    user: filterUserInfo(myInfo),
                    mentor: filterUserInfo(result)
                }
            });
        } else {
            res.json({
                code: 1,
                msg: { user: filterUserInfo(myInfo), mentor: null }
            });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const mentorMyInfo = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));

        const myInfo = await prisma.user({
            id: uid
        });

        const result = await prisma
            .user({
                id: uid
            })
            .mentor();
        if (result) {
            res.json({
                code: 1,
                msg: {
                    user: filterUserInfo(myInfo),
                    mentor: filterUserInfo(result)
                }
            });
        } else {
            res.json({
                code: 1,
                msg: { user: filterUserInfo(myInfo), mentor: null }
            });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const mentorMyMentees = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));

        const myMentor = await prisma
            .user({
                id: uid
            })
            .mentor();

        const myStudentsInfo: Array<User> = await prisma.users({
            where: {
                mentor: {
                    id: uid
                }
            }
        });

        const myInfo = await prisma.user({
            id: uid
        });

        if (myMentor) {
            res.json({
                code: 1,
                msg: {
                    students: filterUsersInfo(myStudentsInfo),
                    mentor: filterUserInfo(myMentor),
                    my: filterUserInfo(myInfo)
                }
            });
        } else {
            res.json({
                code: 1,
                msg: {
                    students: filterUsersInfo(myStudentsInfo),
                    mentor: null,
                    my: filterUserInfo(myInfo)
                }
            });
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const mentorSet = async function(req: Request, res: Response) {
    try {
        const { uid, username } = verifyJWT(req.header("Authorization"));

        const previousMentor = await prisma
            .user({
                id: uid
            })
            .mentor();

        const { mentorName } = req.body;

        const mentorInfoList = await prisma.users({
            where: {
                username_contains: mentorName
            }
        });

        if (mentorInfoList.length !== 1 || mentorInfoList[0].id === uid) {
            res.json({ code: -1, msg: "Mentor不合法！" });
            return;
        }

        const [mentorInfo] = mentorInfoList;

        if (previousMentor && previousMentor.id === mentorInfo.id) {
            res.json({ code: 1 });
            return;
        }

        await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                mentor: {
                    connect: {
                        id: mentorInfo.id
                    }
                }
            }
        });

        const sendSetMentorMsg = MESSAGE_SET_MENTOR(username);

        pushMessage(uid, mentorInfo.id, sendSetMentorMsg, MESSAGE_REPORT_URL);
        messageWxPushUser(
            [mentorInfo.id],
            sendSetMentorMsg,
            MESSAGE_REPORT_URL
        );

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userSearch = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { keyword } = req.body;
        const result = await prisma.users({
            where: {
                OR: [
                    {
                        id_contains: keyword
                    },
                    {
                        username_contains: keyword
                    },
                    {
                        userid_contains: keyword
                    }
                ]
            }
        });
        res.json({ code: 1, msg: filterUsersInfo(result) });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userRuntime = async function(req: Request, res: Response) {
    try {
        const { isAdmin } = verifyJWT(req.header("Authorization"));
        if (!isAdmin) {
            res.json({ code: -1, msg: "No Permission" });
            return;
        }

        const userList = await prisma.users();
        for (const user of userList) {
            const threads = await prisma
                .threadsConnection({
                    where: {
                        user: {
                            id: user.id
                        }
                    }
                })
                .aggregate()
                .count();
            if (user.threads !== threads) {
                await prisma.updateUser({
                    where: {
                        id: user.id
                    },
                    data: {
                        threads: threads
                    }
                });
            }
        }
        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const userAvatar = async function(req: Request, res: Response) {
    const { uid } = req.params;
    try {
        const fileExistence = fs.existsSync(
            MODE === "DEV"
                ? `./upload/avatar/${uid}.avatar`
                : `/var/bbs/upload/avatar/${uid}.avatar`
        );
        if (fileExistence) {
            res.download(
                MODE === "DEV"
                    ? `./upload/avatar/${uid}.avatar`
                    : `/var/bbs/upload/avatar/${uid}.avatar`
            );
        } else {
            res.download(`./utils/defaultAvatar.png`);
        }
    } catch (e) {
        res.download(`./utils/defaultAvatar.png`);
    }
};
