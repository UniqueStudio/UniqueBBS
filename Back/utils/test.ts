import { prisma } from "../generated/prisma-client"

async function func() {
    const result = await prisma.groups();
    for(let group of result){
        const val = await prisma.group({
            id:group.id
        }).master();
        console.log(val);
    }
    
}
func();