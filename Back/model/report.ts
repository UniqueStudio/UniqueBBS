import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { verifyJWT, filterUserInfo } from "./check";
import { pagesize } from "./consts";
import { getTodayFirstTimestamp, getTodayLastTimestamp } from "./time";
import { setLockExpire } from "./lock";

export const reportCreate = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const { length, content, plan, solution, conclusion, isWeekRAW } = req.body;

        const isWeek: boolean = isWeekRAW === "1";

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
            const lastTime = getTodayLastTimestamp(todayDate);
            const resultLock = await setLockExpire(
                `dailyReport:${uid}`,
                ((lastTime.getTime() - todayDate.getTime()) / 1000).toString()
            );
            if (!resultLock) {
                return res.json({
                    code: -1,
                    msg: "每天只能发表一篇Daily Report！"
                });
            }
        }

        const result = await prisma.updateUser({
            where: {
                id: uid
            },
            data: {
                report: {
                    create: {
                        length,
                        content,
                        plan,
                        solution,
                        conclusion,
                        isWeek,
                        createDate: new Date()
                    }
                }
            }
        });
        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const reportInfo = async function(req: Request, res: Response) {
    try {
        verifyJWT(req.header("Authorization"));
        const { rid } = req.params;
        const resultReport = await prisma.report({
            id: rid
        });
        const resultUser = await prisma
            .report({
                id: rid
            })
            .user();

        res.json({
            code: 1,
            msg: {
                report: resultReport,
                user: filterUserInfo(resultUser)
            }
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
        }`;

        const list = await prisma
            .reports({
                where: {
                    user: {
                        id: uid
                    }
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
        const authObj = verifyJWT(req.header("Authorization"));
        const uid: string = authObj.uid;
        const { page } = req.params;

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
        const { length, content, plan, solution, conclusion } = req.body;

        const reportInfo = await prisma.report({
            id: rid
        });
        const reportAuthor = await prisma
            .report({
                id: rid
            })
            .user();

        const todayFirstTimeStamp = getTodayFirstTimestamp(new Date()).getTime();

        if (new Date(reportInfo.createDate).getTime() < todayFirstTimeStamp && !isAdmin) {
            return res.json({ code: 1, msg: "该Report仅限当天更改！如果您想更改，请联系管理员！" });
        }

        if (!isAdmin && uid !== reportAuthor.id) {
            return res.json({ code: -1, msg: "您无权编辑此Report！" });
        }

        const result = await prisma.updateReport({
            where: {
                id: rid
            },
            data: {
                length,
                content,
                plan,
                solution,
                conclusion
            }
        });

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
