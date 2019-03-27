import { convertString } from "./check";
import dotenv from "dotenv";
dotenv.config();
export const secret = process.env.SECRET as string;

export const wxMsgToken = process.env.WXMSGTOKEN as string;
export const wxMsgAESKEY = process.env.WXMSGAESKEY as string;
export const wxAppID = process.env.APPID as string;
export const wxSECRET = process.env.WXSECRET as string;
export const agentID = process.env.AGENTID as string;

export const getQRCodeURL = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${wxAppID}&agentid=${agentID}&redirect_uri=https%3A%2F%2Fopen.hustunique.com%2Fauth&state=api`;
export const scanningURL =
    "https://open.work.weixin.qq.com/wwopen/sso/l/qrConnect?key=";
export const getUserListURL = (accessToken: string, department: number) =>
    `https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${accessToken}&department_id=${department.toString()}&fetch_child=1`;
export const getGroupURL = (accessToken: string) =>
    `https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}&id=ID`;
export const accessTokenURL = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${wxAppID}&corpsecret=${wxSECRET}`;
export const userIDURL = (accessToken: string, code: string) =>
    `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`;
export const userInfoURL = (accessToken: string, userid: string) =>
    `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userid}`;

export const regPreviewURL = `${process.env.BACKEND_URL}attach/preview/`;
// export const regPreviewURL = `http://localhost:7010/attach/preview/`;
export const regImgStr = (url: string) =>
    new RegExp(`\\!\\[uniqueImg\\]\\(${convertString(url)}(.*?)\\)`, "g");
export const regNewStr = "![uniqueImg](unique://$1)";

export const pagesize = 20;
export const filterUserKeys = ["nickname", "password", "userid"];
export const filterMyKeys = ["password", "userid"];
