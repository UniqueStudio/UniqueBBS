import * as jwt from "jsonwebtoken";
import { secret, accessTokenURL, filterUserKeys, filterMyKeys } from "./consts";
import * as crypto from "crypto";
import { User } from "../generated/prisma-client";

export interface JWTContent {
    uid: string;
    isAdmin: boolean;
    username: string;
}

export const signJWT = function(uid: string, isAdmin: boolean, username: string) {
    return jwt.sign(
        {
            uid: uid,
            isAdmin: isAdmin,
            username: username
        },
        secret,
        {
            expiresIn: 86400
        }
    );
};

export const verifyJWT = function(token?: string) {
    if (!token) {
        throw new Error("No token provided");
    }
    if (token.indexOf("Bearer ") === 0) {
        token = token.replace("Bearer ", "");
    }
    return jwt.verify(token, secret) as JWTContent;
};

export const addSaltPassword = function(pwd: string) {
    const firstMD5 = crypto
        .createHash("md5")
        .update(pwd)
        .digest("hex");
    return crypto
        .createHash("md5")
        .update(firstMD5 + secret)
        .digest("hex");
};

export const addSaltPasswordOnce = function(pwd_MD5: string) {
    return crypto
        .createHash("md5")
        .update(pwd_MD5 + secret)
        .digest("hex");
};

export const getAccessToken = async function() {
    const accessTokenResponse = await fetch(accessTokenURL);
    const accessTokenResult = await accessTokenResponse.json();
    const accessToken = accessTokenResult.access_token;
    return accessToken;
};

export const filterUserInfo = function(user: User) {
    for (let key of filterUserKeys) {
        delete user[key];
    }
    return user;
};

export const filterMyInfo = function(user: User) {
    for (let key of filterMyKeys) {
        delete user[key];
    }
    return user;
};

export const filterUsersInfo = function(users: Array<User>) {
    for (let user of users) {
        user = filterUserInfo(user);
    }
    return users;
};

export const convertString = function(str: string): string {
    let result = "";
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
        if (str[i] === "/" || str[i] === ":") {
            result += "\\";
        }
        result += str[i];
    }
    return result;
};
