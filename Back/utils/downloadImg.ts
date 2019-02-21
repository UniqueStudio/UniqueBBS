import fs from "fs";
import fetch from "node-fetch";

export default async function downloadImg(url: string, path: string) {
    try {
        if (fs.existsSync(path)) fs.unlinkSync(path);
        const result = await fetch(encodeURI(url));
        const bufferImg = await result.buffer();
        fs.writeFileSync(path, bufferImg);
        return bufferImg.length;
    } catch (e) {
        console.log(e);
        return 0;
    }
}
