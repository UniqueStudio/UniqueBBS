import { prisma, Group } from "../generated/prisma-client";
import fetch from "node-fetch";
import { getGroupURL } from "../model/consts";
import { getAccessToken } from "../model/check";

export const updateGroup = async function() {
    const accessToken = await getAccessToken();
    const groupRequestResponse = await fetch(getGroupURL(accessToken));
    const groupRequestResult = await groupRequestResponse.json();
    const status = groupRequestResult.errcode;
    if (status !== 0) {
        return console.log("Access Error");
    }

    const departmentArr: Array<any> = groupRequestResult.department;
    const nowGroup: Array<Group> = await prisma.groups();

    //diff
    let willDeleteArr: Array<string> = [];

    nowGroup.forEach(group => {
        let willDelete = 1;

        departmentArr.some(department => {
            if (department.id === group.key) {
                willDelete = 0;
            }
            return department.id === group.key;
        });

        if (willDelete) {
            console.log(`Will Delete Group key=${group.key} \n ${group.name}`);
            willDeleteArr.push(group.id);
        }
    });

    for (let department of departmentArr) {
        let key = department.id;

        let findResult = 0;
        for (let group of nowGroup) {
            if (group.key === key) {
                findResult = 1;
                if (group.name !== department.name) {
                    await prisma.updateGroup({
                        where: {
                            key: key
                        },
                        data: {
                            name: department.name
                        }
                    });
                    console.log(
                        `Updated Group.\nkey=${key}\n${group.name}=>${
                            department.name
                        }`
                    );
                }
                break;
            }
        }

        if (!findResult && department.id <= 14) {
            await prisma.createGroup({
                name: department.name,
                key: department.id
            });
            console.log(
                `create new Group! \n key=${department.id} \n ${
                    department.name
                }`
            );
        }
    }

    console.log(`exec delete action ...`);
    await prisma.deleteManyGroups({
        id_in: willDeleteArr
    });
    console.log(`Finished !`);
};
