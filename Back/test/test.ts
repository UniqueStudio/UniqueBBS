import * as Redis from "redis";
import * as Redlock from "redlock";
import { promisify } from "util";

const redisClient = Redis.createClient({
    host: "localhost",
    port: 6379
});

const redLock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 2000,
    retryJitter: 200
});

export const redisClientGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisClientSetAsync = promisify(redisClient.set).bind(redisClient);
export const redisClientIncrAsync = promisify(redisClient.incr).bind(
    redisClient
);
export const redisClientExpireAsync = promisify(redisClient.expire).bind(
    redisClient
);


const setLockExpire = async function(
    key: string,
    expireSeconds: string
) {
    const checkLockResult = await redisClientGetAsync(key);
    console.log(checkLockResult , typeof checkLockResult);
    if (checkLockResult === "1") {
        return false;
    }
    const lockResult = await redisClientSetAsync(key, "1", "EX", expireSeconds);
    console.log(lockResult , typeof lockResult);
    if (lockResult !== "OK") {
        return false;
    }
    return true;
};

async function hzytql() {
    console.log("INIT");
    const result1 = await setLockExpire("hzytql","10000");
    console.log(result1,typeof result1);
    const result2 = await setLockExpire("hzytql","10000");
    console.log(result2,typeof result2);
}
hzytql();