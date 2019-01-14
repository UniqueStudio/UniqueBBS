import * as jwt from "jsonwebtoken";
import { secret, accessTokenURL, filterUserKeys, filterMyKeys } from "./consts";
import * as crypto from "crypto";
import { User } from "../generated/prisma-client";

export interface JWTContent {
    uid: string;
    isAdmin: boolean;
}

export const signJWT = (uid: string, isAdmin: boolean) => {
    return jwt.sign(
        {
            uid: uid,
            isAdmin: isAdmin
        },
        secret,
        {
            expiresIn: 86400
        }
    );
};

export const verifyJWT = (token?: string) => {
    if (!token) {
        throw new Error("No token provided");
    }
    if (token.indexOf("Bearer ") === 0) {
        token = token.replace("Bearer ", "");
    }
    return jwt.verify(token, secret) as JWTContent;
};

export const addSaltPassword = (pwd: string) => {
    const md5 = crypto.createHash("md5");
    const firstMD5 = md5.update(pwd).digest("hex");
    const md5_2 = crypto.createHash("md5");
    return md5_2.update(firstMD5 + secret).digest("hex");
};

export const addSaltPasswordOnce = (pwd_MD5: string) => {
    const md5 = crypto.createHash("md5");
    return md5.update(pwd_MD5 + secret).digest("hex");
};

export const getAccessToken = async () => {
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
