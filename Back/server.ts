import * as express from "express";
import * as bodyParser from "body-parser";
import {
    userMyInfo,
    userInfo,
    userLoginByPwd,
    userInfoUpdate,
    userInfoUpdateFromWx,
    userQRLogin,
    userScan,
    userPwdReset
} from "./model/user";
import {
    threadDeleteHard,
    postDeleteHard,
    postDelete,
    threadList,
    threadInfo,
    threadCreate,
    threadReply,
    threadDelete,
    threadDiamond,
    threadTop,
    threadClose,
    threadRecovery,
    postRecovery,
    threadGraph
} from "./model/thread";
import { forumList, forumListSimple } from "./model/forum";
import * as Redis from "redis";
import * as Redlock from "redlock";
import { messageIsRead, messageList } from "./model/message";

const VERSION = "1.00";

export const redisServer = Redis.createClient({
    host: "localhost",
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
app.use(
    bodyParser.json({
        limit: "1mb"
    })
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("X-Powered-By", "Rabbit/1.0");
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
//User
app.get("/user/info/:uid", userInfo);
app.get("/user/my/info", userMyInfo);
app.get("/user/login/qr", userQRLogin);
app.get("/user/login/scan/:key/status", userScan);
app.post("/user/login/pwd", userLoginByPwd);
app.post("/user/update/normal", userInfoUpdate);
app.post("/user/update/pwd", userPwdReset);
app.post("/user/update/wx", userInfoUpdateFromWx);

//Forum
app.get("/forum/list", forumList);
app.get("/forum/listSimple", forumListSimple);

//Thread
app.get("/thread/list/:fid/:page", threadList);
app.get("/thread/info/:tid/:page", threadInfo);
app.get("/thread/graph/:tid", threadGraph);
app.post("/thread/create", threadCreate);
app.post("/thread/reply", threadReply);
app.post("/thread/diamond", threadDiamond);
app.post("/thread/top", threadTop);
app.post("/thread/close", threadClose);
app.post("/thread/delete/:tid", threadDelete);
app.post("/thread/deleteHard/:tid", threadDeleteHard);
app.post("/thread/recovery/:tid/:postsBool", threadRecovery);

//Post
app.post("/post/delete/:pid", postDelete);
app.post("/post/deleteHard/:pid", postDeleteHard);
app.post("/post/recovery/:pid", postRecovery);

//Message
app.post("/message/read/:id", messageIsRead);
app.get("/message/list/:page", messageList);

app.listen(7010, () => {
    console.log(
        `Rabbit WebServer / ${VERSION} is running on port 7010.\nRedis:6379 , MySQL:3306 , graphQL:4466`
    );
});
