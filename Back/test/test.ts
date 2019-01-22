import fetch from "node-fetch";
import * as fs from "fs";

(async function() {
    const result = await fetch(
        "https://bbs.hustunique.com/assets/uploads/files/1520649349029-volumetric-lights-resized.jpg"
    );
    const bufferImg = await result.buffer();
    console.log(bufferImg.length);
})();
