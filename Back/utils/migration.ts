import { prisma, Group } from "../generated/prisma-client";
import * as fs from "fs";

async function execMigration() {
    console.log("Preparing Databases");
    const userDB = fs.readFileSync("./users.json").toJSON().data;
    const threadDB = fs.readFileSync("./topics.json").toJSON().data;
    const postDB = fs.readFileSync("./posts.json").toJSON().data;

    const threadMap = new Map<string, string>();
    const forumMap = new Map<string, string>();
    const userMap = new Map<string, string>();
    const threadFirstPostMap = new Map<string, string>();
    const groupMap = new Map<string, string>();
    const threadReport = new Map<string, number>();

    // <-- Step 0 Create Reflection between group name and group id
    console.log("Creating Group Reflection Maps");
    const groupList = await prisma.groups();
    for (const group of groupList) {
        groupMap.set(group.name, group.id);
    }

    // <-- Step 1 Create Reflection between old and new forum id
    console.log("Creating Forum Reflection Maps");
    const reportForumArr = ["10", "11", "12", "13", "14", "15", "16", "28"];
    const exceptForumArr = ["3", "26"];

    const [TongZhiGongGao] = await prisma.forums({
        where: {
            name: "通知公告"
        },
        first: 1
    });
    const [XinRenRenWu] = await prisma.forums({
        where: {
            name: "新人任务"
        },
        first: 1
    });
    const [TuanDuiXiangMu] = await prisma.forums({
        where: {
            name: "团队项目"
        },
        first: 1
    });
    const [XianZaTaoLun] = await prisma.forums({
        where: {
            name: "闲杂讨论"
        },
        first: 1
    });
    const [TuanDuiFenXiang] = await prisma.forums({
        where: {
            name: "团队分享"
        },
        first: 1
    });
    const [LianChuangShiChang] = await prisma.forums({
        where: {
            name: "联创市场"
        },
        first: 1
    });
    const [TuanDuiZiLiao] = await prisma.forums({
        where: {
            name: "团队资料"
        },
        first: 1
    });

    forumMap.set("1", TongZhiGongGao.id); // 通知公告

    forumMap.set("9", XinRenRenWu.id); // 新人任务

    forumMap.set("29", TuanDuiXiangMu.id); // 团队项目
    forumMap.set("30", TuanDuiXiangMu.id); // 团队项目

    forumMap.set("8", XianZaTaoLun.id); // 闲杂讨论
    forumMap.set("31", XianZaTaoLun.id); // 闲杂讨论

    forumMap.set("37", TuanDuiFenXiang.id); // 团队分享
    forumMap.set("5", TuanDuiFenXiang.id); // 团队分享
    forumMap.set("38", TuanDuiFenXiang.id); // 团队分享

    forumMap.set("7", LianChuangShiChang.id); // 联创市场
    forumMap.set("23", LianChuangShiChang.id); // 联创市场
    forumMap.set("24", LianChuangShiChang.id); // 联创市场

    forumMap.set("6", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("18", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("19", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("36", TuanDuiZiLiao.id); // 团队资料

    // <-- Step 2 Create Reflection between old and new user id
    console.log("Creating User Reflection Maps");
    const masterAccount = await prisma.user({
        userid: "YangZiYue"
    });
    userMap.set("1", masterAccount.id);

    for (const user of userDB) {
        if (userMap.get(user.uid) !== undefined) {
            // is contained
            continue;
        }
        const username = user.username;
        const uid = user.uid;
        const db_user_result = await prisma.users({
            where: {
                username: username
            },
            first: 1
        });

        if (db_user_result.length !== 0) {
            const [db_user] = db_user_result;
            // is active user
            userMap.set(uid, db_user.id);
            const result = await prisma.updateUser({
                where: {
                    id: db_user.id
                },
                data: {
                    signature: user.signature,
                    lastLogin: new Date(Number.parseInt(user.lastonline))
                }
            });
            userMap.set(uid, result.id);
        } else {
            const group = [];
            if (user.groupTitle && groupMap.get(user.groupTitle)) {
                group.push({
                    id: groupMap.get(user.groupTitle)
                });
            }
            const result = await prisma.createUser({
                username: username,
                lastLogin: new Date(Number.parseInt(user.lastonline)),
                userid: "t_" + username,
                group: {
                    connect: group
                },
                active: false // Not in DB -> not active
            });
            userMap.set(uid, result.id);
        }
    }

    //<-- Step 3 Migration Thread and create Reflections
    console.log("Migrating Threads");
    const reg = /Weekly/i;
    const WEEKLY_REPORT = 1,
        DAILY_REPORT = 2;
    const exceptForumThisStep = [...reportForumArr, ...exceptForumArr];
    for (const thread of threadDB) {
        if (exceptForumThisStep.some(item => item === thread.cid)) {
            if (reportForumArr.some(item => item === thread.cid)) {
                threadReport.set(thread.id, reg.test(thread.title) ? WEEKLY_REPORT : DAILY_REPORT);
            }
            continue;
        }
        const authorUID = userMap.get(thread.uid);
        const forumID = forumMap.get(thread.cid);
        if (!authorUID) {
            console.log("Cannot Find Author!");
            console.log(thread);
            continue;
        }
        threadFirstPostMap.set(thread.mainPid, thread.id);
        const result = await prisma.createThread({
            subject: thread.title,
            createDate: new Date(Number.parseInt(thread.timestamp)),
            user: {
                connect: {
                    id: authorUID
                }
            },
            forum: {
                connect: {
                    id: forumID
                }
            },
            lastDate: new Date(Number.parseInt(thread.lastposttime)),
            active: thread.deleted === "0",
            closed: thread.locked === "1",
            top: thread.pinned === "1" ? 1 : 0
        });
        threadMap.set(thread.tid, result.id);
    }

    //<-- Step 4 Migration Posts using Reflections
    console.log("Migrating Posts");
    for (const post of postDB) {
        const authorUID = userMap.get(post.uid);
        const threadID = threadMap.get(post.tid);
        const isFirstPost = threadFirstPostMap.get(post.pid) !== undefined;
        if (!threadID) {
            continue;
        }
        const result = await prisma.updateThread({
            where: {
                id: threadID
            },
            data: {
                post: {
                    create: {
                        createDate: new Date(Number.parseInt(post.timestamp)),
                        message: post.content,
                        user: {
                            connect: {
                                id: authorUID
                            }
                        },
                        isFirst: isFirstPost,
                        active: post.deleted === "0"
                    }
                }
            }
        });
    }
    //<-- Step 5 Update Runtimes
    console.log("Updating Runtimes");

    const threadList = await prisma.threads();
    for (const thread of threadList) {
        const postCount = await prisma
            .postsConnection({
                where: {
                    thread: {
                        id: thread.id
                    }
                }
            })
            .aggregate()
            .count();
        const [lastPost] = await prisma.posts({
            where: {
                thread: {
                    id: thread.id
                }
            },
            orderBy: "createDate_DESC",
            first: 1
        });
        await prisma.updateThread({
            where: {
                id: thread.id
            },
            data: {
                postCount: postCount,
                lastDate: lastPost.createDate
            }
        });
    }

    const userList = await prisma.users();
    for (const user of userList) {
        const threads = await prisma
            .threadsConnection({
                where: {
                    user: {
                        id: user.id
                    }
                }
            })
            .aggregate()
            .count();
        await prisma.updateUser({
            where: {
                id: user.id
            },
            data: {
                threads: threads
            }
        });
    }

    const forumList = await prisma.forums();
    for (const forum of forumList) {
        const threads = await prisma
            .threadsConnection({
                where: {
                    forum: {
                        id: forum.id
                    }
                }
            })
            .aggregate()
            .count();
        const [lastPost] = await prisma.posts({
            where: {
                thread: {
                    forum: {
                        id: forum.id
                    }
                }
            },
            orderBy: "createDate_DESC",
            first: 1
        });
        await prisma.updateForum({
            where: {
                id: forum.id
            },
            data: {
                threads: threads,
                lastPost: {
                    connect: {
                        id: lastPost.id
                    }
                }
            }
        });
    }
    //<-- Step 6 Migration Reports
    console.log("Migrating Reports");
    for (const post of postDB) {
        const reportStatus = threadReport.get(post.pid);
        if (reportStatus === undefined) continue;
        const userID = userMap.get(post.uid);
        await prisma.updateUser({
            where: {
                id: userID
            },
            data: {
                report: {
                    create: {
                        message: post.content,
                        createDate: new Date(Number.parseInt(post.timestamp)),
                        isWeek: reportStatus === WEEKLY_REPORT
                    }
                }
            }
        });
    }
    //<-- Step 7 ALL OK
    console.log("Finished , thank you !");
}

execMigration();
