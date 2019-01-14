import {
    redisClientSetAsync,
    redisClientKeysAsync,
    redisClientDelAsync
} from "../server";

async function hzytql() {
    await redisClientSetAsync("HZYTQL:1:YZY","hello");
    await redisClientSetAsync("HZYTQL:2:YZY","hello");
    await redisClientSetAsync("HZYTQL:3:YZY","hello");

    const arr = await redisClientKeysAsync("HZYTQL:*:YZY");
    for(let key of arr){
        await redisClientDelAsync(key);
    }
}
hzytql();