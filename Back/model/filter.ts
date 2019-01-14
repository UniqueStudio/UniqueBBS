const FILTER_CLOSE = 0;
const FILTER_CAN_SEE = 1;
const FILTER_CANNOT_SEE = 2;
const FILTER_EXPIRE_SECONDS = 12 * 60 * 60;

import {
    redisClientGetAsync,
    redisClientSetAsync,
    redisClientKeysAsync,
    redisClientDelAsync
} from "../server";
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
    const userListArr: Array<{ id: string }> = filterUserArr.map(item => ({
        id: item
    }));

    const groupListArr: Array<{ id: string }> = filterGroupArr.map(item => ({
        id: item
    }));

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

        userFilterList.some(item => {
            if (item.id === uid) {
                result = decideFlag;
            }
            return item.id === uid;
        });
    }

    if (filterGroupType !== FILTER_CLOSE && result !== undefined) {
        const decideFlag: boolean = filterGroupType === FILTER_CAN_SEE;

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

            userGroupList.some(item => {
                if (item.id === groupFilterItem.id) {
                    result = decideFlag;
                }
                return item.id === groupFilterItem.id;
            });

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

export const filterClearCache = async function(tid: string) {
    const arr = await redisClientKeysAsync(`filterThread:*:${tid}`);
    arr.forEach(item => {
        redisClientDelAsync(item);
    });
};
