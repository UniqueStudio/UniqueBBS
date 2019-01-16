import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { prisma, Attach } from "../generated/prisma-client";
import { redLock } from "../server";
import { filterCalculate } from "./filter";
import * as fs from "fs";

export const fileUpload = async function(req: Request, res: Response) {
    const fileList = req.files as Array<Express.Multer.File>;
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));

        const result = await Promise.all(
            fileList.map(async item => {
                const result = await prisma.createAttach({
                    user: {
                        connect: {
                            id: uid
                        }
                    },
                    filesize: item.size,
                    downloads: 0,
                    fileName: item.destination + item.filename,
                    originalName: item.originalname,
                    createDate: new Date()
                });
                return result.id;
            })
        );

        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
        fileList.forEach(item => {
            fileDelete(item.destination + item.filename);
        });
    }
};

export const fileGetUnlink = async function(req: Request, res: Response) {
    try {
        const { uid } = verifyJWT(req.header("Authorization"));
        const result = await prisma.attaches({
            where: {
                user: {
                    id: uid
                },
                thread: null
            },
            orderBy: "createDate_DESC"
        });
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const fileClearAllUnlink = async function() {
    const arr = await prisma.attaches({
        where: {
            thread: null
        }
    });

    arr.forEach(item => {
        fileDelete(item.fileName);
    });

    await prisma.deleteManyAttaches({
        thread: null
    });
};

export const fileDownload = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { aid } = req.params;

        const threadInfo = await prisma
            .attach({
                id: aid
            })
            .thread();

        const attachAuthorInfo = await prisma
            .attach({
                id: aid
            })
            .user();

        if (threadInfo === null) {
            if (!isAdmin && uid !== attachAuthorInfo.id) {
                return res.json({ code: -1, msg: "该附件不存在！" });
            }
        } else {
            if (!isAdmin && !threadInfo.active) {
                return res.json({ code: -1, msg: "该附件不存在！" });
            }
            const havePermission = await filterCalculate(uid, threadInfo.id, isAdmin);
            if (!havePermission) {
                return res.json({ code: -1, msg: "您无权下载此附件！" });
            }
        }

        let downloadItem: Attach;

        const downloadLock = await redLock.lock(`downloadCount:${aid}`, 200);
        try {
            const downloadItemPrevious = await prisma.attach({
                id: aid
            });

            const downloadItemTemp = await prisma.updateAttach({
                where: {
                    id: aid
                },
                data: {
                    downloads: downloadItemPrevious.downloads + 1
                }
            });

            downloadItem = downloadItemTemp;
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            downloadLock.unlock();
        }

        res.download(downloadItem.fileName, downloadItem.originalName);
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const fileFilter = function(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, acceptFile: boolean) => void
) {
    try {
        const authObj = verifyJWT(req["header"]("Authorization"));
        cb(null, true);
    } catch {
        cb(null, false);
    }
};

export const fileName = function(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, filename: string) => void
) {
    try {
        const { uid } = verifyJWT(req["header"]("Authorization"));
        cb(null, `${uid}_${file.originalname}_${new Date().getTime()}.rabbit`);
    } catch {
        cb(null, `ERR_${file.originalname}_${new Date().getTime()}.rabbit`);
    }
};

export const fileProcess = async function(files: Array<string> | string, pid: string, tid: string, uid: string) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() + "_" + (date.getMonth() + 1).toString() + "_" + date.getDate().toString();

    const fileList: Array<string> = files instanceof Array ? files : [files];

    const connectAttachArrRaw = await Promise.all(
        fileList.map(async aid => {
            const attach = await prisma.attach({ id: aid });
            const attachAuthor = await prisma.attach({ id: aid }).user();
            const attachThread = await prisma.attach({ id: aid }).thread();

            if (attachAuthor.id !== uid || attachThread !== null) {
                return undefined;
            }

            const oldPath = attach.fileName;
            const newDir = `./upload/${dirName}`;
            const newPath = `${newDir}/${pid}_${new Date().getTime().toString()}_${aid}.rabbit`;

            if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);
            fileMove(oldPath, newPath);

            await prisma.updateAttach({
                where: {
                    id: aid
                },
                data: {
                    fileName: newPath,
                    thread: {
                        connect: {
                            id: tid
                        }
                    }
                }
            });

            return {
                id: aid
            };
        })
    );

    const connectAttachArr = connectAttachArrRaw.filter(item => {
        return item !== undefined;
    });

    if (connectAttachArr.length !== 0) {
        await prisma.updateThread({
            where: {
                id: tid
            },
            data: {
                attach: {
                    connect: connectAttachArr
                }
            }
        });
    }
};

export const fileDestination = function(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, destination: string) => void
) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() + "_" + (date.getMonth() + 1).toString() + "_" + date.getDate().toString();
    const parentDir = `./upload/tmp`;
    const childDir = `${parentDir}/${dirName}`;
    if (!fs.existsSync("./upload")) fs.mkdirSync("./upload");
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir);
    if (!fs.existsSync(childDir)) fs.mkdirSync(childDir);
    cb(null, `${childDir}/`);
};

export const fileDelete = function(filename: string) {
    if (filename && fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
};

export const fileMove = function(fromPath: string, toPath: string) {
    return fs.renameSync(fromPath, toPath);
};

export const fileRemove = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { aid } = req.params;

        const attachLock = await redLock.lock(`updateThread${uid}`, 800);

        try {
            const attachAuthorInfo = await prisma
                .attach({
                    id: aid
                })
                .thread()
                .user();

            if (!isAdmin && uid !== attachAuthorInfo.id) {
                return res.json({ code: -1, msg: "您无权删除此附件！" });
            }

            const attachThreadInfo = await prisma
                .attach({
                    id: aid
                })
                .thread();

            const deleteResult = await prisma.updateThread({
                where: {
                    id: attachThreadInfo.id
                },
                data: {
                    attach: {
                        delete: {
                            id: aid
                        }
                    }
                }
            });
            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            attachLock.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
