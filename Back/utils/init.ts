import fs from "fs";
require("dotenv").config();

if (!fs.existsSync("/var/bbs/install.lock")) {
    require("./install");
} else {
    require("../server");
}
