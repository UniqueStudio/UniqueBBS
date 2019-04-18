import jwt from "jsonwebtoken";
import { secret, accessTokenURL, filterUserKeys, filterMyKeys } from "./consts";
import crypto from "crypto";
import { User } from "../generated/prisma-client";
import { redisClientGetAsync, redisClientSetAsync } from "../server";

export const BACKEND_URL = process.env.BACKEND_URL;

export interface JWTContent {
    uid: string;
    isAdmin: boolean;
    username: string;
}

type Omit<A, B extends keyof A> = Pick<
    A,
    { [K in keyof A]: K extends B ? never : K }[keyof A]
>;
export type MyUser = Omit<User, "password" | "userid">;
export type OtherUser = Omit<User, "nickname" | "password" | "userid">;

export const signJWT = function(
    uid: string,
    isAdmin: boolean,
    username: string
) {
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
    const checkTokenResult = await redisClientGetAsync("ACCESS_TOKEN");
    if (checkTokenResult) {
        return checkTokenResult;
    } else {
        const accessTokenResponse = await fetch(accessTokenURL);
        const accessTokenResult = await accessTokenResponse.json();
        const accessToken: string = accessTokenResult.access_token;
        const expireSeconds: string = accessTokenResult.expires_in;

        await redisClientSetAsync(
            "ACCESS_TOKEN",
            accessToken,
            "EX",
            expireSeconds
        );

        return accessToken;
    }
};

export const filterUserInfo = function(user: User): OtherUser {
    if (user) {
        for (let key of filterUserKeys) {
            delete (user as any)[key];
        }

        user.avatar = filterUserAvatar(user.avatar);
    }
    return user;
};

export const filterMyInfo = function(user: User): MyUser {
    for (let key of filterMyKeys) {
        delete (user as any)[key];
    }
    user.avatar = filterUserAvatar(user.avatar);
    return user;
};

export const filterUsersInfo = function(users: Array<User>): Array<OtherUser> {
    const returnUser = users.map(item => {
        return filterUserInfo(item) as OtherUser;
    });
    return returnUser;
};

export const filterUserAvatar = function(avatar: string) {
    if (avatar === "__default__") {
        avatar = `unique://null`;
    }
    const UNIQUE_PREFIX = "unique://";
    const prefix = avatar.substr(0, UNIQUE_PREFIX.length);
    return prefix === UNIQUE_PREFIX
        ? avatar.replace(/^unique\:\/\//g, `${BACKEND_URL}user/avatar/`)
        : avatar.replace(/^http\:\/\//g, "https://");
};
