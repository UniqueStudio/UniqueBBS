import {
    redisClientGetAsync,
    redisClientSetAsync
} from "../server";

export const setLockExpire = async function(
    key: string,
    expireSeconds: string
) {
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