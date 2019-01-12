import express from "express"
import bodyParser from "body-parser"
import { userInfo } from "./model/user"
import { threadInfo } from "./model/thread"
import * as Redis from "redis"
import * as Redlock from "redlock"


export const redisServer = Redis.createClient({
    host: 'redis'
});

redisServer.on("error", err => {
    console.log("Redis Error: " + err);
});

export const redLock = new Redlock([redisServer],{
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200    
});

const app = express();
app.use(bodyParser.json({
    limit: '1mb'
}));

//User
app.get("/user_info/:id", userInfo);
//Thread
app.get("/thread/:id", threadInfo);


app.listen(7010, () => {
    console.log("uniqueBBS server is running on port 7010.");
});