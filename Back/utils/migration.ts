import { prisma } from "../generated/prisma-client";

async function execMigration() {
    const threadMap = new Map<string, string>();
    const forumMap = new Map<string, string>();
    const userMap = new Map<string, string>();

    const reportForumArr = ["10", "11", "12", "13", "14", "15", "16", "28"];
    const exceptForumArr = ["3", "26"];

    forumMap.set("1", "cjr1sackb01du0733dyf6gafj"); // 通知公告

    forumMap.set("9", "cjr1sacp201dz0733xtoig98h"); // 新人任务

    forumMap.set("29", "cjr1sacr401e40733k6i82ivj"); // 团队项目
    forumMap.set("30", "cjr1sacr401e40733k6i82ivj"); // 团队项目

    forumMap.set("8", "cjr1sact401e90733t69j002v"); // 闲杂讨论
    forumMap.set("31", "cjr1sact401e90733t69j002v"); // 闲杂讨论

    forumMap.set("37", "cjr1sacv401ee0733kleuypx1"); // 团队分享
    forumMap.set("5", "cjr1sacv401ee0733kleuypx1"); // 团队分享
    forumMap.set("38", "cjr1sacv401ee0733kleuypx1"); // 团队分享

    forumMap.set("7", "cjr1sacx101ej0733c2bgja5g"); // 联创市场
    forumMap.set("23", "cjr1sacx101ej0733c2bgja5g"); // 联创市场
    forumMap.set("24", "cjr1sacx101ej0733c2bgja5g"); // 联创市场

    forumMap.set("6", "cjr1sacz601eo0733oftccyjd"); // 团队资料
    forumMap.set("18", "cjr1sacz601eo0733oftccyjd"); // 团队资料
    forumMap.set("19", "cjr1sacz601eo0733oftccyjd"); // 团队资料
    forumMap.set("36", "cjr1sacz601eo0733oftccyjd"); // 团队资料

    const masterAccount = await prisma.user({
        userid: "YangZiYue"
    });
}

execMigration();
