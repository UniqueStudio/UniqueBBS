require("dotenv").config();

import * as express from "express";
import * as bodyParser from "body-parser";
import { wechatHandleMessage, wechatHandleCheck } from "./model/wx";

export const wxServer = express();

wxServer.use(bodyParser.urlencoded({ extended: true }));
wxServer.use(bodyParser.text());

wxServer.post("/wx", wechatHandleMessage);
wxServer.get("/wx", wechatHandleCheck);
