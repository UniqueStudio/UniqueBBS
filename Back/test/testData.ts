import { prisma } from "../generated/prisma-client";
import { addSaltPassword } from "../model/check";

async function func() {
    const newForum = [
        ["通知公告", "notification"],
        ["新人任务", "solution"],
        ["团队项目", "align-left"],
        ["闲杂讨论", "message"],
        ["团队分享", "share-alt"],
        ["联创市场", "shopping-cart"],
        ["团队资料", "paper-clip"]
    ];
    for (let [forum, icon] of newForum) {
        await prisma.createForum({
            name: forum,
            icon: icon
        });
    }

    const result = await prisma.updateUser({
        where: {
            userid: "LiuHongXin"
        },
        data: {
            nickname: "lhx",
            password: addSaltPassword("20000301")
        }
    });

    const result2 = await prisma.updateUser({
        where: {
            userid: "YangZiYue"
        },
        data: {
            nickname: "ttzztztz",
            password: addSaltPassword("20000301")
        }
    });
}
func();
