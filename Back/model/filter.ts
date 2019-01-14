const FILTER_CLOSE = 0;
const FILTER_CAN_SEE = 1;
const FILTER_CANNOT_SEE = 2;
const FILTER_EXPIRE_SECONDS = 12 * 60 * 60;

import { redisClientGetAsync, redisClientSetAsync } from "../server";
import { prisma, Group } from "../generated/prisma-client";

export const filterCheckTypeAvailable = function(filterType: string): boolean {
    const typeInt = Number.parseInt(filterType);
    if (Object.is(typeInt, NaN)) {
        return false;
    }
    return typeInt >= FILTER_CLOSE && typeInt <= FILTER_CANNOT_SEE;
};

export const filterObjGenerate = function(
    filterUserArr: Array<string>,
    filterGroupArr: Array<string>,
    filterUserType: string,
    filterGroupType: string
) {
    let userListArr: Array<{ id: string }> = [],
        groupListArr: Array<{ id: string }> = [];
    for (let _user of filterUserArr) {
        userListArr.push({
            id: _user
        });
    }

    for (let _group of filterGroupArr) {
        groupListArr.push({
            id: _group
        });
    }

    return {
        userType: Number.parseInt(filterUserType),
        groupType: Number.parseInt(filterGroupType),
        userList: {
            connect: userListArr
        },
        groupList: {
            connect: groupListArr
        }
    };
};

export const filterCalculate = async function(
    uid: string,
    tid: string,
    isAdmin: boolean
): Promise<boolean> {
    if (isAdmin) return true;

    const filter = await prisma
        .thread({
            id: tid
        })
        .filter();

    const threadAuthor = await prisma
        .thread({
            id: tid
        })
        .user();

    if (filter === null || filter === undefined || threadAuthor.id === uid)
        return true;

    const cacheKey = `filterThread:${uid}:${tid}`;
    const cacheResult = redisClientGetAsync(cacheKey);
    if (cacheResult !== null) {
        return cacheResult === "1";
    }

    let result: boolean | undefined = undefined;

    const filterUserType = filter.userType;
    const filterGroupType = filter.groupType;

    if (filterUserType !== FILTER_CLOSE) {
        const decideFlag: boolean =
            filterUserType === FILTER_CAN_SEE ? true : false;

        const userFilterList = await prisma
            .filter({
                id: filter.id
            })
            .userList();

        for (let userFilterItem of userFilterList) {
            if (userFilterItem.id === uid) {
                result = decideFlag;
                break;
            }
        }
    }

    if (filterGroupType !== FILTER_CLOSE && result !== undefined) {
        const decideFlag: boolean =
            filterGroupType === FILTER_CAN_SEE ? true : false;

        const groupFilterList = await prisma
            .filter({
                id: filter.id
            })
            .groupList();

        for (let groupFilterItem of groupFilterList) {
            const userGroupList: Array<Group> = await prisma
                .user({
                    id: uid
                })
                .group();

            for (let userGroupItem of userGroupList) {
                if (userGroupItem.id === groupFilterItem.id) {
                    result = decideFlag;
                    break;
                }
            }

            if (result !== undefined) {
                break;
            }
        }
    }

    const finalResult: boolean =
        result === undefined ? true : (result as boolean);

    redisClientSetAsync(
        cacheKey,
        finalResult ? "1" : "0",
        "EX",
        FILTER_EXPIRE_SECONDS
    );
    return finalResult;
};
