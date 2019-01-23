import * as Redis from "redis";
import { promisify } from "util";
export const redisClient = Redis.createClient({
    host: "127.0.0.1",
    port: 6379
});

export const redisClientGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisClientSetAsync: any = promisify(redisClient.set).bind(redisClient);
export const redisClientKeysAsync = promisify(redisClient.keys).bind(redisClient);
export const redisClientDelAsync: any = promisify(redisClient.del).bind(redisClient);
export const redisClientIncrAsync = promisify(redisClient.incr).bind(redisClient);
export const redisClientExpireAsync = promisify(redisClient.expire).bind(redisClient);

(async function() {
    await redisClientDelAsync("hzytql", "tqltqltql");
    console.log("ok");
})();
