import { Request, Response } from "express";
import { prisma, Report } from "../generated/prisma-client";
import { verifyJWT, filterUserInfo } from "./check";
import { pagesize } from "./consts";

export const reportCreate = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const {
            length,
            content,
            plan,
            solution,
            conclusion,
            isWeekRAW
        } = req.body;

        const isWeek: boolean = isWeekRAW === "1";

        //todo: check if user can send report

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
