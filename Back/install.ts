import {Prisma, User, Group, Forum} from "./generated/prisma-client"
let prisma = new Prisma();
async function install() {
    const groupArr = ["Web","Lab","AI","Design","PM","iOS","Android","Game","退休打杂"];
    let groupDBArr = [];
    for(let _groupName of groupArr){
        let result:Group = await prisma.createGroup({name:_groupName});
        groupDBArr.push(result);
        console.log("Install Group "+_groupName);
    }

    const forumArr = ["通知公告","新人任务","团队项目","闲杂讨论","团队分享","联创市场","团队资料","匿名讨论"];
    let forumDBArr = [];
    for(let _forumName of forumArr){
        let result:Forum = await prisma.createForum({name:_forumName});
        forumDBArr.push(result);
        console.log("Install Forum "+_forumName);
    }

    let resultAdminUser:User = await prisma.createUser({
        username:"Rabbit",
        openid:-1,
        isAdmin:true,
        group: {
            connect:{
                "id": groupDBArr[0].id
            }
        },
        lastLogin: new Date(),
        signature: "hzytql!"
    });

    console.log("Install Admin Account");
    console.log("Install Complete , Thank You!");
}
install();