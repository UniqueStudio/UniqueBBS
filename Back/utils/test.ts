import { prisma } from "../generated/prisma-client";
import { addSaltPassword } from "../model/check";

async function func() {
    // const newForum = ["hzytql", "zcytql"];
    // for (let forum of newForum) {
    //     await prisma.createForum({
    //         name: forum
    //     });
    // }

    const result = await prisma.updateUser({
        where: {
            userid: "LiuHongXin"
        },
        data: {
            nickname: "lhx",
            password: addSaltPassword("20000301")
        }
    });
    console.log(result);
}
func();
