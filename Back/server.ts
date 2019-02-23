require("dotenv").config();

import express, { Router } from "express";
import bodyParser from "body-parser";
import Redis from "redis";
import Redlock from "redlock";
import { promisify } from "util";
import multer from "multer";
import socket from "socket.io";
import http from "http";
<<<<<<< HEAD
import wxServer from "./wxserver";
=======
// import fs from "fs";
import { wxServer } from "./wxserver";
>>>>>>> a831f7509b49943b84682de7de0e70ee865d01de

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
    mentorInfo,
    mentorMyInfo,
    mentorSet,
    userSearch,
    userRuntime,
    mentorMyMentees,
    userAvatar
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
    threadMove,
    threadSearch,
    threadRuntime
} from "./model/thread";
import {
    postDeleteHard,
    postDelete,
    postRecovery,
    postUpdate,
    postSearch,
    postInfo
} from "./model/post";
import { forumList, forumListSimple, forumRuntime } from "./model/forum";
import {
    reportCreate,
    reportInfo,
    reportGraph,
    reportList,
    reportUpdate,
    reportCanPost
} from "./model/report";
import {
    fileDownload,
    fileUpload,
    fileName,
    fileDestination,
    fileRemove,
    fileFilter,
    fileGetUnlink,
    fileClearAllUnlink,
    filePreview,
    fileExpire
} from "./model/attach";
import { groupList, groupUserList, groupUser } from "./model/group";
import {
    messageIsRead,
    messageList,
    messageDelete,
    messageReadAll,
    messageDeleteAll,
    messageCount
} from "./model/message";
import { socketLogin, socketDisconnect } from "./model/socket";
import { atResult } from "./model/at";

const SERVER_VERSION = "1.02";

export const MODE = process.env.NODE_ENV;

export const redisClient = Redis.createClient({
    host: MODE === "DEV" ? "localhost" : "redis",
    port: 6379
});

export const redisClientGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisClientSetAsync: any = promisify(redisClient.set).bind(
    redisClient
);
export const redisClientKeysAsync = promisify(redisClient.keys).bind(
    redisClient
);
export const redisClientDelAsync: any = promisify(redisClient.del).bind(
    redisClient
);
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

<<<<<<< HEAD
const root = express();
const server = http.createServer(root);
=======
const app = express();
// const server = https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.crt')
// }, app);
const server = http.createServer(app);
>>>>>>> a831f7509b49943b84682de7de0e70ee865d01de
export const io = socket(server);

io.on("connection", socket => {
    socket.on("login", socketLogin(socket));
    socket.on("disconnect", socketDisconnect(socket));
});

const app = Router();

app.use(bodyParser.json({ limit: "1mb" }));

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

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("X-Powered-By", `Rabbit/${SERVER_VERSION}`);
    next();
});

//User & Mentor
app.get("/user/info/:uid", userInfo);
app.get("/user/avatar/:uid", userAvatar);
app.get("/user/threads/:uid/:page", userThreads);
app.get("/user/posts/:uid/:page", userPosts);
app.get("/user/my/info", userMyInfo);
app.get("/user/runtime", userRuntime);
app.get("/user/login/qrcode", userQRLogin);
app.get("/user/login/scan/:key/status", userScan);
app.get("/user/mentor/info/:uid", mentorInfo);
app.get("/user/mentor/my", mentorMyInfo);
app.get("/user/mentor/students", mentorMyMentees);
app.post("/user/login/pwd", userLoginByPwd);
app.post("/user/update/normal", userInfoUpdate);
app.post("/user/update/pwd", userPwdReset);
app.post("/user/update/wx", userInfoUpdateFromWx);
app.post("/user/mentor/set", mentorSet);
app.post("/user/search", userSearch);

//Forum
app.get("/forum/list", forumList);
app.get("/forum/runtime", forumRuntime);
app.get("/forum/listSimple", forumListSimple);

//Thread
app.get("/thread/list/:fid/:page", threadList);
app.get("/thread/info/:tid/:page", threadInfo);
app.get("/thread/runtime", threadRuntime);
app.post("/thread/create", threadCreate);
app.post("/thread/update/:tid", threadUpdate);
app.post("/thread/move/:tid", threadMove);
app.post("/thread/reply", threadReply);
app.post("/thread/diamond", threadDiamond);
app.post("/thread/top", threadTop);
app.post("/thread/close", threadClose);
app.post("/thread/search", threadSearch);
app.post("/thread/delete/:tid", threadDelete);
app.post("/thread/deleteHard/:tid", threadDeleteHard);
app.post("/thread/recovery/:tid", threadRecovery);

//Post
app.get("/post/info/:pid", postInfo);
app.post("/post/delete/:pid", postDelete);
app.post("/post/update/:pid", postUpdate);
app.post("/post/search", postSearch);
app.post("/post/deleteHard/:pid", postDeleteHard);
app.post("/post/recovery/:pid", postRecovery);

//Group
app.get("/group/list", groupList);
app.get("/group/users/:gid", groupUserList);
app.get("/group/user/:uid", groupUser);

//Message
app.get("/message/list/:page", messageList);
app.get("/message/count", messageCount);
app.post("/message/read/:id", messageIsRead);
app.post("/message/delete/:id", messageDelete);
app.post("/message/all/read", messageReadAll);
app.post("/message/all/delete", messageDeleteAll);

//Report
app.get("/report/can", reportCanPost);
app.get("/report/info/:rid", reportInfo);
app.get("/report/list/:uid/:page", reportList);
app.post("/report/graph/:uid", reportGraph);
app.post("/report/create", reportCreate);
app.post("/report/update/:rid", reportUpdate);

//Attach
app.get("/attach/download/:aid/:token", fileDownload);
app.get("/attach/preview/:aid", filePreview);
app.get("/attach/unlink", fileGetUnlink);
app.get("/attach/expire/:tid", fileExpire);
app.get("/attach/unlinkAll", fileClearAllUnlink);
app.post("/attach/remove/:aid", fileRemove);
app.post("/attach/upload", upload.single("attaches"), fileUpload);

//At
app.post("/at", atResult);

root.use("/api", app);
root.use("/wxapi", wxServer);

server.listen(7010, () => {
    console.log(
        `Rabbit WebServer / ${SERVER_VERSION} is running on port 7010.\nRedis:6379 , MySQL:3306 , graphQL:4466`
    );
});
