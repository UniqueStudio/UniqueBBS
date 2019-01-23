import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { prisma } from "../generated/prisma-client";
import { redLock, redisClientDelAsync, MODE } from "../server";
import { filterCalculate } from "./filter";
import { setLockExpire, getLockStatus } from "./lock";
import * as fs from "fs";

export const fileUpload = async function(req: Request, res: Response) {
    const fileItem = req.file;
    try {
        const { uid } = verifyJWT(req.header("Authorization"));

        const result = await prisma.createAttach({
            user: {
                connect: {
                    id: uid
                }
            },
            filesize: fileItem.size,
            downloads: 0,
            fileName: fileItem.destination + fileItem.filename,
            originalName: fileItem.originalname,
            createDate: new Date()
        });

        await setLockExpire(
            `attachPreview:${result.id}`,
            (12 * 60 * 60).toString()
        );

        res.json({ code: 1, msg: result.id });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
        fileDelete(fileItem.destination + fileItem.filename);
    }
};

export const fileUploadMultiple = async function(req: Request, res: Response) {
    const fileList = req.files as Array<Express.Multer.File>;
    try {
        const { uid } = verifyJWT(req.header("Authorization"));

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
                thread: undefined
            },
            orderBy: "createDate_DESC"
        });
        res.json({ code: 1, msg: result });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};

export const fileClearAllUnlink = async function(req: Request, res: Response) {
    try {
        const { isAdmin } = verifyJWT(req.header("Authorization"));
        if (!isAdmin) {
            return res.json({ code: -1, msg: "No Permission" });
        }

        const arr = await prisma.attaches({
            where: {
                thread: undefined
            }
        });

        arr.forEach(item => {
            fileDelete(item.fileName);
        });

        await prisma.deleteManyAttaches({
            thread: undefined
        });
        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
};

export const filePreview = async function(req: Request, res: Response) {
    try {
        const { aid } = req.params;
        const reg = /(jpg|png|gif|jpeg|bmp|webp)$/i;
        const attachInfo = await prisma.attach({
            id: aid
        });

        const previewExpire = await getLockStatus(`attachPreview:${aid}`);
        if (previewExpire) {
            return res.json({ code: -1, msg: "Access Denied" });
        }

        if (!reg.test(attachInfo.originalName)) {
            return res.json({ code: -1, msg: "Access Denied" });
        }

        res.download(attachInfo.fileName, attachInfo.originalName);
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
};

export const fileDownload = async function(req: Request, res: Response) {
    try {
        const { aid, token } = req.params;
        const { uid, isAdmin } = verifyJWT(token);

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
            const havePermission = await filterCalculate(
                uid,
                threadInfo.id,
                isAdmin
            );
            if (!havePermission) {
                return res.json({ code: -1, msg: "您无权下载此附件！" });
            }
        }

        const downloadLock = await redLock.lock(`downloadCount:${aid}`, 200);
        try {
            const downloadItemPrevious = await prisma.attach({
                id: aid
            });

            const downloadItem = await prisma.updateAttach({
                where: {
                    id: aid
                },
                data: {
                    downloads: downloadItemPrevious.downloads + 1
                }
            });

            res.download(downloadItem.fileName, downloadItem.originalName);
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            downloadLock.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
};

export const fileFilter = function(
    req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
) {
    try {
        verifyJWT((req as any)["header"]("Authorization"));
        cb(null, true);
    } catch {
        cb(null, false);
    }
};

export const fileName = function(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
) {
    try {
        const { uid } = verifyJWT((req as any)["header"]("Authorization"));
        cb(null, `${uid}_${file.originalname}_${new Date().getTime()}.rabbit`);
    } catch {
        cb(null, `ERR_${file.originalname}_${new Date().getTime()}.rabbit`);
    }
};

export const fileProcess = async function(
    files: Array<string> | string,
    pid: string,
    tid: string,
    uid: string,
    isAdmin: boolean
) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() +
        "_" +
        (date.getMonth() + 1).toString() +
        "_" +
        date.getDate().toString();

    const fileList: Array<string> = files instanceof Array ? files : [files];

    const connectAttachArrRaw = await Promise.all(
        fileList.map(async aid => {
            const attach = await prisma.attach({ id: aid });
            const attachAuthor = await prisma.attach({ id: aid }).user();
            const attachThread = await prisma.attach({ id: aid }).thread();

            if (
                !isAdmin &&
                (attachAuthor.id !== uid || attachThread.id !== tid)
            ) {
                return undefined;
            }

            const oldPath = attach.fileName;
            const newDir =
                MODE === "DEV"
                    ? `./upload/${dirName}`
                    : `/var/bbs/upload/${dirName}`;
            const newPath = `${newDir}/${pid}_${new Date()
                .getTime()
                .toString()}_${aid}.rabbit`;

            await redisClientDelAsync(`attachPreview:${aid}`);

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
    }) as Array<{ id: string }>;

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
    return 1;
};

export const fileDestination = function(
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() +
        "_" +
        (date.getMonth() + 1).toString() +
        "_" +
        date.getDate().toString();
    const parentDir = MODE === "DEV" ? `./upload/tmp` : `/var/bbs/upload/tmp`;
    const childDir = `${parentDir}/${dirName}`;
    if (!fs.existsSync(MODE === "DEV" ? `./upload` : "/var/bbs/upload"))
        fs.mkdirSync("/var/bbs/upload");
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

        const attachInfo = await prisma.attach({
            id: aid
        });

        const attachLock = await redLock.lock(`updateThread${uid}`, 800);

        try {
            const attachAuthorInfo = await prisma
                .attach({
                    id: aid
                })
                .user();

            if (!isAdmin && uid !== attachAuthorInfo.id) {
                return res.json({ code: -1, msg: "您无权删除此附件！" });
            }

            const attachThreadInfo = await prisma
                .attach({
                    id: aid
                })
                .thread();
            if (attachThreadInfo === null) {
                await prisma.deleteAttach({
                    id: aid
                });
            } else {
                await prisma.updateThread({
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
            }

            fileDelete(attachInfo.fileName);

            res.json({ code: 1 });
        } catch (e) {
            res.json({ code: -1, msg: e.message });
        } finally {
            attachLock.unlock();
        }
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
    return 1;
};

export const fileExpire = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { tid } = req.params;

        const threadAuthor = await prisma
            .thread({
                id: tid
            })
            .user();

        if (!isAdmin && threadAuthor.id !== uid) {
            res.json({ code: -1, msg: "Access Denied" });
        }

        const attachList = await prisma.attaches({
            where: {
                thread: {
                    id: tid
                }
            }
        });

        for (const attach of attachList) {
            await setLockExpire(
                `attachPreview:${attach.id}`,
                (12 * 60 * 60).toString()
            );
        }

        res.json({ code: 1 });
    } catch (e) {
        res.json({ code: -1, msg: e.message });
    }
};
