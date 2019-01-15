import * as express from "express";
import * as bodyParser from "body-parser";
import {
    userMyInfo,
    userInfo,
    userThreads,
    userPosts,
    userLoginByPwd,
    userInfoUpdate,
    userInfoUpdateFromWx,
    userQRLogin,
    userScan,
    userPwdReset,
    mentorGet,
    mentorSet
} from "./model/user";
import {
    threadDeleteHard,
    threadList,
    threadInfo,
    threadCreate,
    threadReply,
    threadDelete,
    threadDiamond,
    threadTop,
    threadClose,
    threadRecovery,
    threadUpdate,
    threadMove
} from "./model/thread";
import {
    postDeleteHard,
    postDelete,
    postRecovery,
    postUpdate
} from "./model/post";
import { forumList, forumListSimple } from "./model/forum";
import {
    reportCreate,
    reportInfo,
    reportGraph,
    reportList,
    reportUpdate
} from "./model/report";

import * as Redis from "redis";
import * as Redlock from "redlock";
import { messageIsRead, messageList } from "./model/message";
import { promisify } from "util";
import * as multer from "multer";
import {
    fileDownload,
    fileUpload,
    fileName,
    fileDestination,
    fileRemove,
    fileFilter
} from "./model/attach";

const SERVER_VERSION = "1.00";

export const redisClient = Redis.createClient({
    host: "localhost",
    port: 6379
});

export const redisClientGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisClientSetAsync = promisify(redisClient.set).bind(redisClient);
export const redisClientKeysAsync = promisify(redisClient.keys).bind(
    redisClient
);
export const redisClientDelAsync = promisify(redisClient.del).bind(redisClient);
export const redisClientIncrAsync = promisify(redisClient.incr).bind(
    redisClient
);
export const redisClientExpireAsync = promisify(redisClient.expire).bind(
    redisClient
);

redisClient.on("error", err => {
    console.log("Redis Error: " + err);
});

export const redLock = new Redlock([redisClient], {
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
    res.header("X-Powered-By", `Rabbit/${SERVER_VERSION}`);
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const storage = multer.diskStorage({
    destination: fileDestination,
    filename: fileName
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 20971520 },
    fileFilter: fileFilter
}); //20MB

//User & Mentor
app.get("/user/info/:uid", userInfo);
app.get("/user/threads/:uid/:page", userThreads);
app.get("/user/posts/:uid/:page", userPosts);
app.get("/user/my/info", userMyInfo);
app.get("/user/login/qrcode", userQRLogin);
app.get("/user/login/scan/:key/status", userScan);
app.get("/user/mentor/info", mentorGet);
app.post("/user/login/pwd", userLoginByPwd);
app.post("/user/update/normal", userInfoUpdate);
app.post("/user/update/pwd", userPwdReset);
app.post("/user/update/wx", userInfoUpdateFromWx);
app.post("/user/mentor/set", mentorSet);

//Forum
app.get("/forum/list", forumList);
app.get("/forum/listSimple", forumListSimple);

//Thread
app.get("/thread/list/:fid/:page", threadList);
app.get("/thread/info/:tid/:page", threadInfo);
app.post("/thread/create", threadCreate);
app.post("/thread/update/:tid", threadUpdate);
app.post("/thread/move/:tid", threadMove);
app.post("/thread/reply", threadReply);
app.post("/thread/diamond", threadDiamond);
app.post("/thread/top", threadTop);
app.post("/thread/close", threadClose);
app.post("/thread/delete/:tid", threadDelete);
app.post("/thread/deleteHard/:tid", threadDeleteHard);
app.post("/thread/recovery/:tid/:postsBool", threadRecovery);

//Post
app.post("/post/delete/:pid", postDelete);
app.post("/post/update/:pid", postUpdate);
app.post("/post/deleteHard/:pid", postDeleteHard);
app.post("/post/recovery/:pid", postRecovery);

//Message
app.post("/message/read/:id", messageIsRead);
app.get("/message/list/:page", messageList);

//Report
app.get("/report/info/:rid", reportInfo);
app.get("/report/graph/:uid", reportGraph);
app.get("/report/list/:page", reportList);
app.post("/report/create", reportCreate);
app.post("/report/update/:rid", reportUpdate);

//Attach
app.get("/attach/download/:aid", fileDownload);
app.post("/attach/remove/:aid", fileRemove);
app.post("/attach/upload", upload.array("attaches", 10), fileUpload);

app.listen(7010, () => {
    console.log(
        `Rabbit WebServer / ${SERVER_VERSION} is running on port 7010.\nRedis:6379 , MySQL:3306 , graphQL:4466`
    );
});
