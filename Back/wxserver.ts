import https from "https";

require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import { wechatHandleMessage, wechatHandleCheck } from "./model/wx";
import fs from "fs";

const app = express();
export const wxServer = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.post("/wx", wechatHandleMessage);
app.get("/wx", wechatHandleCheck);
