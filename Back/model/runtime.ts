import { prisma } from "../generated/prisma-client";
import { redLock } from "../server";

export const userThreadsAdd = async function(uid, addNum: number = 1) {
    const redLockResourceNameUser = `user:${uid}`;
    const lock = await redLock.lock(redLockResourceNameUser, 200);
    try {
        const userInfo = await prisma.user({
            id: uid
        });
        const resultUser = await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                threads: userInfo.threads + addNum
            }
        });
    } finally {
        lock.unlock();
    }

    return true;
};

export const forumLastPostUpdate = async function(fid, lastPostID) {
    const redLockResourceNameUser = `forum:${fid}`;
    const lock = await redLock.lock(redLockResourceNameUser, 200);

    try {
        const resultForum = await prisma.updateForum({
            where: {
                id: fid
            },
            data: {
                lastPost: {
                    connect: {
                        id: lastPostID
                    }
                }
            }
        });
    } finally {
        lock.unlock();
    }
    return true;
};

export const forumThreadsAdd = async function(
    fid,
    addNum: number = 1,
    lastPostID?
) {
    const redLockResourceNameUser = `forum:${fid}`;
    const lock = await redLock.lock(redLockResourceNameUser, 200);

    try {
        const forumInfo = await prisma.forum({
            id: fid
        });

        let dataObj: object;

        if (lastPostID) {
            dataObj = {
                threads: forumInfo.threads + addNum,
                lastPost: {
                    connect: {
                        id: lastPostID
                    }
                }
            };
        } else {
            dataObj = {
                threads: forumInfo.threads + addNum
            };
        }

        const resultForum = await prisma.updateForum({
            where: {
                id: fid
            },
            data: dataObj
        });
    } finally {
        lock.unlock();
    }
    return true;
};

export const threadPostCountAdd = async function(tid, addNum: number = 1) {
    const redLockResourceNameUser = `thread:${tid}`;
    const lock = await redLock.lock(redLockResourceNameUser, 200);
    try {
        const threadInfo = await prisma.thread({
            id: tid
        });
        const resultThread = await prisma.updateThread({
            where: {
                id: tid
            },
            data: {
                postCount: threadInfo.postCount + addNum
            }
        });
    } finally {
        lock.unlock();
    }
    return true;
};
