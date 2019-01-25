import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { verifyJWT } from "./check";
import { pagesize } from "./consts";
import { getTodayFirstTimestamp, getTodayLastTimestamp } from "./time";
import { setLockExpire, getLockStatus } from "./lock";
import { redisClientSetAsync, redisClientGetAsync } from "../server";

export const REPORT_TEMPLATE = (
    time: string,
    content: string,
    plan: string,
    solution: string,
    conclusion: string,
    extra: string
) => {
    if (extra.length > 0) {
        return `- **学习时间:** ${time}\n- **学习内容:**\n${content}\n- **学习计划:**\n${plan}\n- **解决问题:**\n${solution}\n- **学习总结:**\n${conclusion}\n\n- ${extra}`;
    } else {
        return `- **学习时间:** ${time}\n- **学习内容:**\n${content}\n- **学习计划:**\n${plan}\n- **解决问题:**\n${solution}\n- **学习总结:**\n${conclusion}`;
    }
};

export const reportCreate = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const {
            time,
            content,
            plan,
            solution,
            conclusion,
            isWeekReport,
            extra
        } = req.body;

        if (time.length === 0 || time.length >= 50) {
            return res.json({ code: -1, msg: "学习时间长度限制0~50字！" });
        }
        if (content.length === 0 || content.length >= 500) {
            return res.json({ code: -1, msg: "学习内容长度限制0~500字！" });
        }
        if (content.length === 0 || content.length >= 500) {
            return res.json({ code: -1, msg: "学习计划长度限制0~500字！" });
        }
        if (solution.length === 0 || solution.length >= 500) {
            return res.json({ code: -1, msg: "解决问题长度限制0~500字！" });
        }
        if (conclusion.length === 0 || conclusion.length >= 500) {
            return res.json({ code: -1, msg: "学习总结长度限制0~500字！" });
        }

        const isWeek: boolean = isWeekReport === "1";

        const todayDate = new Date();
        if (isWeek) {
            //Weekly Report
            const resultLock = await setLockExpire(
                `weeklyReport:${uid}`,
                (5 * 24 * 60 * 60).toString()
            );
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
                Math.floor(
                    (lastTime.getTime() - todayDate.getTime()) / 1000
                ).toString()
            );
            if (!resultLock) {
                return res.json({
                    code: -1,
                    msg: "每天只能发表一篇Daily Report！"
                });
            }
        }

        const message = REPORT_TEMPLATE(
            time,
            content,
            plan,
            solution,
            conclusion,
            extra
        );

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
            Math.floor(
                (lastTime.getTime() - todayDate.getTime()) / 1000
            ).toString()
        );

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
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
        if (
            new Date(reportInfo.createDate).getTime() < todayFirstTimeStamp &&
            !isAdmin
        ) {
            return res.json({
                code: 1,
                msg: "该Report仅限当天更改！如果您想更改，请联系管理员！"
            });
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
    return 1;
};

export const reportGraph = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { uid } = req.params;
        const { year } = req.body;

        const fragment = `fragment ReportsGraph on Report{
            createDate
            isWeek
        }`;
        const beginDateRaw = new Date();

        if (year) {
            const yearNumber: number = Number.parseInt(year);
            const nowYear = new Date().getFullYear();
            const allowYear = [1, 2, 3];
            if (!allowYear.some(item => item === yearNumber)) {
                return res.json({ code: -1, msg: "Cannot Support Year" });
            }
            beginDateRaw.setFullYear(nowYear + yearNumber * -1, 11, 31);
        }

        beginDateRaw.setHours(0);
        beginDateRaw.setMinutes(0);
        beginDateRaw.setSeconds(0);

        const extraBlockCount = beginDateRaw.getDay() + 1;
        const beginDate = new Date(
            beginDateRaw.getTime() -
                (extraBlockCount + 363) * 24 * 60 * 60 * 1000
        );

        const list = await prisma
            .reports({
                where: {
                    user: {
                        id: uid
                    },
                    createDate_gte: beginDate
                },
                orderBy: "createDate_ASC"
            })
            .$fragment(fragment);

        res.json({ code: 1, msg: list });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
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
        const count = await prisma
            .reportsConnection({
                where: {
                    user: {
                        id: uid
                    }
                }
            })
            .aggregate()
            .count();

        res.json({ code: 1, msg: { list, count } });
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

        if (
            new Date(reportInfo.createDate).getTime() < todayFirstTimeStamp &&
            !isAdmin
        ) {
            return res.json({
                code: 1,
                msg: "该Report仅限当天更改！如果您想更改，请联系管理员！"
            });
        }

        if (!isAdmin && uid !== reportAuthor.id) {
            return res.json({ code: -1, msg: "您无权编辑此Report！" });
        }

        const message = REPORT_TEMPLATE(
            time,
            content,
            plan,
            solution,
            conclusion,
            extra
        );
        const obj = { time, content, plan, solution, conclusion, extra };
        await redisClientSetAsync(
            `report:${rid}`,
            JSON.stringify(obj),
            "EX",
            Math.floor(
                (getTodayLastTimestamp().getTime() - new Date().getTime()) /
                    1000
            ).toString()
        );

        await prisma.updateReport({
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
    return 1;
};
