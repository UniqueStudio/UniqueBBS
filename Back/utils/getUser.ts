require("dotenv").config();

import { prisma } from "../generated/prisma-client";
import fetch from "node-fetch";
import { getUserListURL, accessTokenURL } from "../model/consts";
import downloadImg from "../utils/downloadImg";
import processJoinTime from "../utils/processJoinTime";
import fs from "fs";

export const getAccessToken = async function() {
    const accessTokenResponse = await fetch(accessTokenURL);
    const accessTokenResult = await accessTokenResponse.json();
    return accessTokenResult.access_token;
};

export const getUser = async function() {
    const avatarPath =
        process.env.NODE_ENV === "DEV"
            ? `./upload/avatar`
            : `/var/bbs/upload/avatar`;

    if (!fs.existsSync(avatarPath)) fs.mkdirSync(avatarPath);

    const groups = await prisma.groups();
    let groupList = new Map<number, string>();
    let setID = new Map<string, number>();
    let existUserID = [];
    let groupKeyList: Array<[number, string]> = [];
    for (let group of groups) {
        groupList.set(group.key, group.id);
        groupKeyList.push([group.key, group.name]);
    }

    const accessToken = await getAccessToken();

    for (let [groupKey, groupName] of groupKeyList) {
        // const groupID = groupKeyList["group_k" + groupKey];
        console.log(`Fetching User Info Group ${groupName} [${groupKey}]`);

        const groupMemberResponse = await fetch(
            getUserListURL(accessToken, groupKey)
        );
        const groupMemberResult = await groupMemberResponse.json();
        if (groupMemberResult.errcode !== 0) {
            return console.log("Access Error");
        }

        const userList = groupMemberResult.userlist;
        for (let user of userList) {
            existUserID.push(user.userid);

            if (setID.get(user.userid) === 1) continue;
            setID.set(user.userid, 1);

            const userGroupArr = user.department;
            const isOld = (userGroupArr as any[]).some(item => +item >= 14); //老成员只放在一个组内
            let userGroup: Array<{ id: string }> = [];

            if (isOld) {
                userGroup.push({
                    id: groupList.get(14)
                });
            } else {
                for (let userGroupKey of userGroupArr) {
                    const groupID = groupList.get(userGroupKey);
                    if (groupID && +userGroupKey < 14) {
                        userGroup.push({
                            id: groupID
                        });
                    }
                }
            }

            const exist = await prisma.$exists.user({
                userid: user.userid
            });

            await downloadImg(
                user.avatar,
                `${avatarPath}/${user.userid}.avatar`
            );

            const dataObj = {
                username: user.name,
                mobile: user.mobile,
                avatar: `unique://${user.userid}`,
                userid: user.userid,
                email: user.email,
                joinTime: processJoinTime(user),
                group: {
                    connect: userGroup
                },
                isAdmin:
                    user.isleader === 1 ||
                    user.name === "杨子越" ||
                    user.name === "洪志远"
            };
            let userID;

            if (exist) {
                console.log(`Updating user ${user.name}`);
                const update = await prisma.updateUser({
                    where: {
                        userid: user.userid
                    },
                    data: { ...dataObj, active: true }
                });
                userID = update.id;
            } else {
                console.log(`Creating user ${user.name}`);
                const create = await prisma.createUser({
                    ...dataObj,
                    active: true,
                    lastLogin: new Date()
                });
                userID = create.id;
            }

            if (user.isleader === 1) {
                console.log(`Set Group ${groupName} Master to ${user.name}`);
                await prisma.updateGroup({
                    where: {
                        key: groupKey
                    },
                    data: {
                        master: {
                            connect: {
                                id: userID
                            }
                        }
                    }
                });
            }
        }
    }

    console.log("checking unactive users");
    const nowAllUsers = await prisma.users({
        where: {
            active: true
        }
    });

    let setToUnActiveUserList = [];
    for (let user of nowAllUsers) {
        let userid = user.userid;
        let active = 0;
        existUserID.some(item => {
            if (userid === item) active = 1;
            return userid === item;
        });
        if (!active) {
            console.log(`Set to unactive user userid=${userid}`);
            setToUnActiveUserList.push(userid);
        }
    }

    await prisma.updateManyUsers({
        where: {
            userid_in: setToUnActiveUserList
        },
        data: {
            active: false
        }
    });

    console.log("Exec complete!");
};
