// import { prisma, User, Group, Forum } from "./generated/prisma-client"
import {updateGroup} from "./utils/getGroup"
import {getUser} from "./utils/getUser"
import * as readline from "readline";

async function install() {
    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    input.question("Are you Sure to exec install script?\nPress any key to start install process.", async (answer) => {
        await updateGroup();
        await getUser();
    });

}
install();