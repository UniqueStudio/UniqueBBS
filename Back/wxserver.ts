require("dotenv").config();

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { wechatHandleMessage, wechatHandleCheck } from "./model/wx";

const app = express();
// export const wxServer = https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.crt')
// }, app);

export const wxServer = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.post("/wx", wechatHandleMessage);
app.get("/wx", wechatHandleCheck);
