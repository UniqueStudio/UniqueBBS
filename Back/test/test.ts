const convertString = function(str: string): string {
    let result = "";
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
        if (str[i] === "/" || str[i] === ":") {
            result += "\\";
        }
        result += str[i];
    }
    return result;
};

const regPreviewURL = `http://localhost:7010/attach/preview/`;
const regImgStr = url => new RegExp(`\\!\\[uniqueImg\\]\\(${convertString(url)}(.*?)\\)`, "g");
const regNewStr = "![uniqueImg](unique://$1)";

console.log(`\!\[uniqueImg\]\(${convertString(regPreviewURL)}(.*?)\)`);

const message =
    "![uniqueImg](http://localhost:7010/attach/preview/cjr4jqqcw00ms0733vy6rh2be)31231312 ![uniqueImg](http://localhost:7010/attach/preview/cjr4jqqcw00ms0733vy6rh2be)";
console.log(message.match(regImgStr(regPreviewURL)));

const result = message.replace(regImgStr(regPreviewURL), regNewStr);

console.log(result);
