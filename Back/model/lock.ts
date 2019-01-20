import { redisClientGetAsync, redisClientSetAsync, redisClientIncrAsync, redisClientExpireAsync } from "../server";

export const setLockExpire = async function(key: string, expireSeconds: string) {
    const checkLockResult = await redisClientGetAsync(key);

    if (checkLockResult === "1") {
        return false;
    }
    const lockResult = await redisClientSetAsync(key, "1", "EX", expireSeconds);
    if (lockResult !== "OK") {
        return false;
    }
    return true;
};

export const getLockStatus = async function(key: string) {
    const checkResult = await redisClientGetAsync(key);
    return checkResult !== "1";
};

export const setLockExpireIncr = async function(key: string, expireSeconds: string, maxCount: number) {
    const checkLockResult = await redisClientGetAsync(key);
    if (checkLockResult === null || Number.parseInt(checkLockResult) < maxCount) {
        await redisClientIncrAsync(key);
        await redisClientExpireAsync(key, expireSeconds);
        return true;
    } else {
        return false;
    }
};
