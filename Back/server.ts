import * as express from "express"
import * as bodyParser from "body-parser"
import { userInfo, userLoginByPwd, userInfoUpdate, userInfoUpdateFromWx, userQRLogin, userScan } from "./model/user"
import { threadDeleteHard , postDeleteHard , postDelete , threadList, threadInfo , threadCreate , threadReply , threadDelete } from "./model/thread"
import { forumList, forumListSimple } from "./model/forum"
import * as Redis from "redis"
import * as Redlock from "redlock"


export const redisServer = Redis.createClient({
    host: 'localhost',
    port: 6379
});

redisServer.on("error", err => {
    console.log("Redis Error: " + err);
});

export const redLock = new Redlock([redisServer], {
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
app.get("/user/info/:uid", userInfo);
app.post("/user/login/pwd", userLoginByPwd);
app.post("/user/update/normal", userInfoUpdate);
app.post("/user/update/wx", userInfoUpdateFromWx);
app.get('/user/login/qr', userQRLogin);
app.get('/user/login/scan/:key/status', userScan);

//Forum
app.get('/forum/list', forumList);
app.get('/forum/listSimple', forumListSimple);

//Thread
app.get('/thread/list/:fid/:page', threadList);
app.get('/thread/info/:tid/:page', threadInfo);
app.post('/thread/create', threadCreate);
app.post('/thread/reply', threadReply);
app.post('/thread/delete/:tid', threadDelete);
app.post('/post/delete/:pid', postDelete);
app.post('/thread/deleteHard/:tid', threadDeleteHard);
app.post('/post/deleteHard/:pid', postDeleteHard);

app.listen(7010, () => {
    console.log("uniqueBBS server is running on port 7010.\nRedis:6379 , MySQL:3306 , graphQL:4466");
});