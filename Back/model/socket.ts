import { Socket } from "socket.io";
import { prisma } from "../generated/prisma-client";
const socketMap: Map<Socket, string> = new Map();

export const socketLogin = (socket: Socket) => async (uid: string) => {
    socketMap.set(socket, uid);
};

export const socketPushMessage = async (toUid: string) => {
    for (let [k, v] of socketMap) {
        if (v === toUid) {
            const count = await prisma
                .messagesConnection({
                    where: {
                        toUser: {
                            id: v
                        },
                        isRead: false
                    }
                })
                .aggregate()
                .count();
            k.emit("pushMessage", count);
            break;
        }
    }
};

export const socketDisconnect = (socket: Socket) => async () => {
    socketMap.delete(socket);
};
