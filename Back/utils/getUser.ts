import { prisma } from "../generated/prisma-client";
import fetch from "node-fetch";
import { getUserListURL } from "../model/consts";
import { getAccessToken } from "../model/check";

export const getUser = async function() {
    const groups = await prisma.groups();
    let groupList = {};
    let setID = {};
    let existUserID = [];
    let groupKeyList: Array<[number, string]> = [];
    for (let group of groups) {
        groupList["group_k" + group.key] = group.id;
        groupKeyList.push([group.key, group.name]);
    }

    const accessToken = await getAccessToken();

    for (let [groupKey, groupName] of groupKeyList) {
        // const groupID = groupKeyList["group_k" + groupKey];
        console.log(`Fetching User Info Group ${groupName} [${groupKey}]`);

        const groupMemberResponse = await fetch(getUserListURL(accessToken, groupKey));
        const groupMemberResult = await groupMemberResponse.json();
        if (groupMemberResult.errcode !== 0) {
            return console.log("Access Error");
        }

        const userList = groupMemberResult.userlist;
        for (let user of userList) {
            existUserID.push(user.userid);

            if (setID["userid_" + user.userid] === 1) continue;
            setID["userid_" + user.userid] = 1;

            const userGroupArr = user.department;
            let userGroup: Array<{ id: string }> = [];
            for (let userGroupKey of userGroupArr) {
                userGroup.push({
                    id: groupList["group_k" + userGroupKey]
                });
            }

            const exist = await prisma.$exists.user({
                userid: user.userid
            });

            const dataObj = {
                username: user.name,
                mobile: user.mobile,
                avatar: user.avatar.replace(/^http/i, "https"),
                userid: user.userid,
                email: user.email,
                lastLogin: new Date(),
                group: {
                    connect: userGroup
                },
                isAdmin: user.isleader === 1 || user.name === "杨子越"
            };
            let userID;

            if (exist) {
                console.log(`Updating user ${user.name}`);
                const update = await prisma.updateUser({
                    where: {
                        userid: user.userid
                    },
                    data: dataObj
                });
                userID = update.id;
            } else {
                console.log(`Creating user ${user.name}`);
                const create = await prisma.createUser(dataObj);
                userID = create.id;
            }

            if (user.isleader === 1) {
                console.log(`Set Group ${groupName} Master to ${user.name}`);
                const groupUpdate = await prisma.updateGroup({
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
        existUserID.some((item, index, array) => {
            if (userid === item) active = 1;
            return userid === item;
        });
        if (!active) {
            console.log(`Set to unactive user userid=${userid}`);
            setToUnActiveUserList.push(userid);
        }
    }

    const unactiveResult = await prisma.updateManyUsers({
        where: {
            userid_in: setToUnActiveUserList
        },
        data: {
            active: false
        }
    });

    console.log("Exec complete!");
};
