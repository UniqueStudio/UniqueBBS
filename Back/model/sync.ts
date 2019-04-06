import { prisma } from "../generated/prisma-client";
import { getAccessToken } from "./check";
import { userInfoURL } from "./consts";
import downloadImg from "../utils/downloadImg";
import processJoinTime from "../utils/processJoinTime";

export const syncPrepare = async function(id: string, MODE: "UID" | "USERID") {
    let userInfoURLPar = "";
    if (MODE === "USERID") {
        userInfoURLPar = id;
    } else {
        const userInfo = await prisma.user(
            MODE === "UID"
                ? {
                      id: id
                  }
                : {
                      userid: id
                  }
        );
        userInfoURLPar = userInfo.userid;
    }

    const accessToken = await getAccessToken();
    const userInfoResponse = await fetch(
        userInfoURL(accessToken, userInfoURLPar)
    );
    const user = await userInfoResponse.json();
    if (user.errcode !== 0) {
        throw new Error("Network err");
    }

    const groups = await prisma.groups();
    let groupList = new Map<number, string>();
    let groupKeyList: Array<[number, string]> = [];
    for (let group of groups) {
        groupList.set(group.key, group.id);
        groupKeyList.push([group.key, group.name]);
    }

    const userGroupArr = user.department;
    const isOld = (userGroupArr as any[]).some(item => +item >= 14);
    let userGroup: Array<{ id: string }> = [];
    if (isOld) {
        userGroup.push({
            id: groupList.get(14)
        });
    } else {
        for (let userGroupKey of userGroupArr) {
            const id = groupList.get(userGroupKey);
            if (id && +userGroupKey < 14) {
                userGroup.push({
                    id: id
                });
            }
        }
    }

    const avatarPath =
        process.env.NODE_ENV === "DEV"
            ? `./upload/avatar`
            : `/var/bbs/upload/avatar`;
    await downloadImg(user.avatar, `${avatarPath}/${user.userid}.avatar`);

    const dataObj = {
        username: user.name,
        mobile: user.mobile,
        avatar: `unique://${user.userid}`,
        userid: user.userid,
        email: user.email,
        lastLogin: new Date(),
        joinTime: processJoinTime(user),
        group: {
            connect: userGroup
        },
        isAdmin: user.isleader === 1 || user.name === "杨子越"
    };
    return { dataObj, userid: user.userid };
};

export const syncCreateUser = async function(userid: string) {
    const { dataObj } = await syncPrepare(userid, "USERID");
    await prisma.createUser({
        ...dataObj,
        lastLogin: new Date()
    });
};

export const syncUpdateUser = async function(
    id: string,
    MODE: "UID" | "USERID"
) {
    const { dataObj, userid } = await syncPrepare(id, MODE);
    await prisma.updateUser({
        where: {
            userid: userid
        },
        data: dataObj
    });
};

export const syncDeleteUser = async function(
    id: string,
    MODE: "UID" | "USERID"
) {
    await prisma.updateUser({
        where:
            MODE === "UID"
                ? {
                      id: id
                  }
                : {
                      userid: id
                  },
        data: {
            active: false
        }
    });
};
