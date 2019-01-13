import { verifyJWT } from "./check";
import { Request, Response } from "express";
import { prisma, Attach } from "../generated/prisma-client";
import { redLock } from "../server";
import * as fs from "fs";

export const fileDownload = async function(req: Request, res: Response) {
    try {
        const { uid, isAdmin } = verifyJWT(req.header("Authorization"));
        const { aid } = req.params;

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

export const fileUpload = function(req, file, cb) {
    try {
        const { uid } = verifyJWT(req["header"]("Authorization"));
        cb(null, `${uid}_${file.originalname}_${new Date().getTime()}.rabbit`);
    } catch {
        cb(null, false);
    }
};

export const fileProcess = async function(
    files: Array<Express.Multer.File>,
    pid: string,
    tid: string
) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() +
        "_" +
        (date.getMonth() + 1).toString() +
        "_" +
        date.getDate().toString();
    let createAttachArr = [];

    for (let file of files) {
        const oldPath = file.destination + file.filename;
        const newDir = `./upload/${dirName}`;
        const newPath = `${newDir}/${pid}_${new Date()
            .getTime()
            .toString()}_${createAttachArr.length.toString()}.rabbit`;

        if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);
        fileMove(oldPath, newPath);
        createAttachArr.push({
            filesize: file.size,
            fileName: newPath,
            originalName: file.originalname,
            createDate: new Date()
        });
    }

    if (createAttachArr.length !== 0) {
        await prisma.updateThread({
            where: {
                id: tid
            },
            data: {
                attach: {
                    create: createAttachArr
                }
            }
        });
    }
};

export const fileDestination = function(req, file, cb) {
    const date = new Date();
    const dirName =
        date.getFullYear().toString() +
        "_" +
        (date.getMonth() + 1).toString() +
        "_" +
        date.getDate().toString();
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
