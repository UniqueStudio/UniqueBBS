const DB_HOST = "localhost";
const DB_NAME = "bbs";
const DB_PORT = 27017;

let mongoose = require("mongoose");
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

console.log(mongoose);