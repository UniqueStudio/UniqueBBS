import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { verifyJWT } from "./check";
import { pagesize } from "./consts";
import { getTodayFirstTimestamp, getTodayLastTimestamp } from "./time";
import { setLockExpire, getLockStatus } from "./lock";
import { redisClientSetAsync, redisClientGetAsync } from "../server";

export const reportCreate = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const { time, content, plan, solution, conclusion, isWeekReport, extra } = req.body;

        const isWeek: boolean = isWeekReport === "1";

        const todayDate = new Date();
        if (isWeek) {
            //Weekly Report
            const resultLock = await setLockExpire(`weeklyReport:${uid}`, (5 * 24 * 60 * 60).toString());
            if (!resultLock) {
                return res.json({
                    code: -1,
                    msg: "每5天只能发表一篇Weekly Report！"
                });
            }
        } else {
            //Daily Report
            const lastTime = getTodayLastTimestamp();

            const resultLock = await setLockExpire(
                `dailyReport:${uid}`,
                Math.floor((lastTime.getTime() - todayDate.getTime()) / 1000).toString()
            );
            if (!resultLock) {
                return res.json({
                    code: -1,
                    msg: "每天只能发表一篇Daily Report！"
                });
            }
        }

        const message = `**学习时间:**${time}\n**学习内容:**${content}\n**学习计划:**${plan}\n**解决问题:**${solution}\n**学习总结:**${conclusion}\n${extra}`;

        const result = await prisma.createReport({
            message,
            isWeek,
            createDate: new Date(),
            user: {
                connect: {
                    id: uid
                }
            }
        });
        const lastTime = getTodayLastTimestamp();
        const obj = { time, content, plan, solution, conclusion, extra };
        await redisClientSetAsync(
            `report:${result.id}`,
            JSON.stringify(obj),
            "EX",
            Math.floor((lastTime.getTime() - todayDate.getTime()) / 1000).toString()
        );

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportCanPost = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));

        const weeklyStatus = await getLockStatus(`weeklyReport:${uid}`);
        const dailyStatus = await getLockStatus(`dailyReport:${uid}`);

        res.json({
            code: 1,
            msg: {
                weekly: weeklyStatus,
                daily: dailyStatus
            }
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportInfo = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { rid } = req.params;

        const reportCache = await redisClientGetAsync(`report:${rid}`);

        if (reportCache === null) {
            return res.json({ code: -1, msg: "该Report无法编辑！" });
        }

        const reportInfo = await prisma.report({
            id: rid
        });

        const reportAuthor = await prisma
            .report({
                id: rid
            })
            .user();

        const todayFirstTimeStamp = getTodayFirstTimestamp().getTime();
        if (new Date(reportInfo.createDate).getTime() < todayFirstTimeStamp && !isAdmin) {
            return res.json({ code: 1, msg: "该Report仅限当天更改！如果您想更改，请联系管理员！" });
        }

        if (!isAdmin && uid !== reportAuthor.id) {
            return res.json({ code: -1, msg: "您无权编辑此Report！" });
        }

        res.json({
            code: 1,
            msg: JSON.parse(reportCache)
        });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportGraph = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { uid } = req.params;

        const fragment = `fragment ReportsGraph on Report{
            createDate
            isWeek
        }`;

        const list = await prisma
            .reports({
                where: {
                    user: {
                        id: uid
                    },
                    createDate_gte: new Date(new Date().getTime() - 366 * 24 * 60 * 60 * 1000)
                },
                orderBy: "createDate_ASC"
            })
            .$fragment(fragment);

        res.json({ code: 1, msg: list });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportList = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { uid, page } = req.params;
        const list = await prisma.reports({
            where: {
                user: {
                    id: uid
                }
            },
            orderBy: "createDate_DESC",
            skip: (page - 1) * pagesize,
            first: pagesize
        });

        res.json({ code: 1, msg: list });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportUpdate = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { rid } = req.params;
        const { time, content, plan, solution, conclusion, extra } = req.body;

        const reportCache = await redisClientGetAsync(`report:${rid}`);

        if (reportCache === null) {
            return res.json({ code: -1, msg: "该Report无法编辑！" });
        }

        const reportInfo = await prisma.report({
            id: rid
        });
        const reportAuthor = await prisma
            .report({
                id: rid
            })
            .user();

        const todayFirstTimeStamp = getTodayFirstTimestamp().getTime();

        if (new Date(reportInfo.createDate).getTime() < todayFirstTimeStamp && !isAdmin) {
            return res.json({ code: 1, msg: "该Report仅限当天更改！如果您想更改，请联系管理员！" });
        }

        if (!isAdmin && uid !== reportAuthor.id) {
            return res.json({ code: -1, msg: "您无权编辑此Report！" });
        }

        const message = `**学习时间:**${time}\n**学习内容:**${content}\n**学习计划:**${plan}\n**解决问题:**${solution}\n**学习总结:**${conclusion}\n${extra}`;
        const obj = { time, content, plan, solution, conclusion, extra };
        await redisClientSetAsync(
            `report:${rid}`,
            JSON.stringify(obj),
            "EX",
            Math.floor((getTodayLastTimestamp().getTime() - new Date().getTime()) / 1000).toString()
        );

        const result = await prisma.updateReport({
            where: {
                id: rid
            },
            data: {
                message
            }
        });

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
