import {
    redisClientSetAsync,
    redisClientKeysAsync,
    redisClientDelAsync,
    redisClientIncrAsync,
    redisClientExpireAsync,
    redisClientGetAsync
} from "../server";

async function hzytql() {
    let result = await redisClientGetAsync("hzytql");
    console.log(result);
    console.log(typeof result);
}
hzytql();
