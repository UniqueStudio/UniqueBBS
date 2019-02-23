require("dotenv").config();

// import http from "http";
import { Router } from "express";
import bodyParser from "body-parser";
import { wechatHandleMessage, wechatHandleCheck } from "./model/wx";

const app = Router();
// export const wxServer = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.post("/wx", wechatHandleMessage);
app.get("/wx", wechatHandleCheck);

export default app;
