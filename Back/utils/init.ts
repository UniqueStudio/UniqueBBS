import fs from "fs";

if (!fs.existsSync("/var/bbs/install.lock")) {
    require("./install");
} else {
    require("../server");
}
