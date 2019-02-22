require("dotenv").config();

import { updateGroup } from "./getGroup";
import { getUser } from "./getUser";
import { prisma } from "../generated/prisma-client";
import * as fs from "fs";
import fetch from "node-fetch";

const DOWNLOAD_FILE_PREFIX = "https://bbs.hustunique.com/";
const IS_LOCAL_ATTACH_REGEX = /\!\[.+?\]\(\/(.*?)\)/gi;

async function downloadImg(url: string, path: string) {
    try {
        const result = await fetch(encodeURI(url));
        const bufferImg = await result.buffer();
        fs.writeFileSync(path, bufferImg);
        return bufferImg.length;
    } catch (e) {
        console.log(e);
        return 0;
    }
}

async function install() {
    await updateGroup();
    await getUser();

    const newForum = [
        ["通知公告", "notification|#4e4bfc", "全团队公告以及信息"],
        ["新人任务", "solution|#47a189", "新人任务的发布与交付"],
        ["团队项目", "align-left|#634cb8", "团队项目的聚集地"],
        ["闲杂讨论", "message|#86C1B9", "在这里讨论什么都可以"],
        ["团队分享", "share-alt|#00d1e0", "分享各组的成果"],
        ["联创市场", "shopping-cart|#184b54", "内部二手交易信息交流"],
        ["团队资料", "paper-clip|#a67fe0", "团队各种流程，资源留存"]
    ];

    for (let [forum, icon, description] of newForum) {
        await prisma.createForum({
            name: forum,
            icon: icon,
            description: description
        });
    }

    console.log("Preparing Databases");
    const userDB = JSON.parse(
        fs.readFileSync("./backup/users.json").toString()
    );
    const threadDB = JSON.parse(
        fs.readFileSync("./backup/topics.json").toString()
    );
    const postDB = JSON.parse(
        fs.readFileSync("./backup/posts.json").toString()
    );
    const reportDB = JSON.parse(
        fs.readFileSync("./backup/posts.json").toString()
    );

    const threadMap = new Map<string, string>();
    const forumMap = new Map<string, string>();
    const userMap = new Map<string, string>();
    const threadFirstPostMap = new Map<string, string>();
    const groupMap = new Map<string, string>();
    const threadReport = new Map<string, number>();
    const threadAuthor = new Map<string, string>();
    const attachMap = new Map<string, string>();

    if (
        !fs.existsSync(
            process.env.mode === "DEV" ? `./upload` : `/var/bbs/upload`
        )
    )
        fs.mkdirSync(
            process.env.mode === "DEV" ? `./upload` : `/var/bbs/upload`
        );

    // <-- Step 0 Create Reflection between group name and group id
    console.log("Creating Group Reflection Maps");
    const groupList = await prisma.groups();
    for (const group of groupList) {
        groupMap.set(group.name, group.id);
    }

    // <-- Step 1 Create Reflection between old and new forum id
    console.log("Creating Forum Reflection Maps");
    const reportForumArr = ["10", "11", "12", "13", "14", "15", "16", "28"];
    const exceptForumArr = ["3"];

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
    forumMap.set("26", XianZaTaoLun.id); // 闲杂讨论

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
    forumMap.set("20", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("21", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("22", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("25", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("32", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("34", TuanDuiZiLiao.id); // 团队资料
    forumMap.set("35", TuanDuiZiLiao.id); // 团队资料

    // <-- Step 2 Create Reflection between old and new user id
    console.log("Creating User Reflection Maps");
    const masterAccount = await prisma.user({
        userid: "YangZiYue"
    });
    userMap.set("1", masterAccount.id);

    for (const user of userDB) {
        console.log(`Checking user ${user.username}`);
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
        console.log(`Processing ${thread.title}`);
        if (exceptForumThisStep.some(item => item === thread.cid)) {
            if (reportForumArr.some(item => item === thread.cid)) {
                threadAuthor.set(thread.tid, thread.uid);
                threadReport.set(
                    thread.tid,
                    reg.test(thread.title) ? WEEKLY_REPORT : DAILY_REPORT
                );
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
        console.log(`${thread.mainPid} -> ${thread.tid}`);
        threadFirstPostMap.set(thread.mainPid, thread.tid);
        threadAuthor.set(thread.tid, thread.uid);
        if (forumID) {
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
    }

    //<-- Step 4 Migration Posts using Reflections
    console.log("Migrating Posts");
    let imageOffset = 0;
    for (const post of postDB) {
        const authorUID = userMap.get(post.uid);
        const threadID = threadMap.get(post.tid);
        const isFirstPost = threadFirstPostMap.get(post.pid) === threadID;
        console.log(`${post.pid} , ${isFirstPost}`);
        if (!threadID || !authorUID) {
            continue;
        }

        let matchResult = IS_LOCAL_ATTACH_REGEX.exec(post.content);
        const attachArr = [];
        const willReplace: Array<[string, string]> = [];
        while (matchResult) {
            console.log(`Downloading File ${matchResult[1]}`);
            const date = new Date();
            const dirName =
                date.getFullYear().toString() +
                "_" +
                (date.getMonth() + 1).toString() +
                "_" +
                date.getDate().toString();
            const newDir =
                process.env.mode === "DEV"
                    ? `./upload/${dirName}`
                    : `/var/bbs/upload/${dirName}`;
            if (
                !fs.existsSync(
                    process.env.mode === "DEV" ? `./upload` : `/var/bbs/upload`
                )
            )
                fs.mkdirSync(
                    process.env.mode === "DEV" ? `./upload` : `/var/bbs/upload`
                );
            const newPath = `${newDir}/migration_${new Date()
                .getTime()
                .toString()}_${imageOffset}.rabbit`;
            if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);

            const [relativeContent, relativeURL] = matchResult;

            const related = attachMap.get(relativeURL);
            if (related) {
                willReplace.push([relativeContent, `![uniqueImg](${related})`]);
            } else {
                const length = await downloadImg(
                    `${DOWNLOAD_FILE_PREFIX}${relativeURL}`,
                    newPath
                );
                if (length !== 0) {
                    const attach = await prisma.createAttach({
                        user: {
                            connect: {
                                id: authorUID
                            }
                        },
                        fileName: newPath,
                        originalName: `${imageOffset}.jpg`,
                        createDate: new Date(),
                        filesize: length
                    });

                    attachArr.push({
                        id: attach.id
                    });
                    attachMap.set(relativeURL, attach.id);
                    willReplace.push([
                        relativeContent,
                        `![uniqueImg](unique://${attach.id})`
                    ]);
                }
            }

            imageOffset++;
            matchResult = IS_LOCAL_ATTACH_REGEX.exec(post.content);
        }

        willReplace.forEach(item => {
            post.content = post.content.replace(item[0], item[1]);
        });

        await prisma.createPost({
            createDate: new Date(Number.parseInt(post.timestamp)),
            message: post.content,
            user: {
                connect: {
                    id: authorUID
                }
            },
            isFirst: isFirstPost,
            active: post.deleted === "0",
            thread: {
                connect: {
                    id: threadID
                }
            }
        });

        if (attachArr.length !== 0) {
            await prisma.updateThread({
                where: { id: threadID },
                data: {
                    attach: {
                        connect: attachArr
                    }
                }
            });
        }
    }
    //<-- Step 5 Update Runtimes
    console.log("Updating Runtimes");

    const threadList = await prisma.threads();
    for (const thread of threadList) {
        const [resultFirst] = await prisma.posts({
            where: {
                thread: {
                    id: thread.id
                }
            },
            orderBy: "createDate_ASC",
            first: 1
        });

        if (resultFirst) {
            await prisma.updatePost({
                where: {
                    id: resultFirst.id
                },
                data: {
                    isFirst: true
                }
            });
        }

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
        if (lastPost) {
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
        if (lastPost) {
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
    }
    //<-- Step 6 Migration Reports
    console.log("Migrating Reports");
    for (const post of reportDB) {
        console.log(post.pid);
        const reportStatus = threadReport.get(post.tid);
        if (!reportStatus) continue;
        const authorID = userMap.get(post.uid);
        const threadAuthorID = threadAuthor.get(post.tid);
        if (threadAuthorID !== post.uid) continue;
        if (threadAuthorID && !userMap.get(threadAuthorID)) continue;
        await prisma.createReport({
            message: post.content,
            createDate: new Date(Number.parseInt(post.timestamp)),
            isWeek: reportStatus === WEEKLY_REPORT,
            user: {
                connect: {
                    id: authorID
                }
            }
        });
    }
    try {
        fs.writeFileSync("/var/bbs/install.lock", "1");
    } catch (e) {
        console.log(e.message);
    }
    //<-- Step 7 ALL OK
    console.log("Finished , thank you !");
}

install();
