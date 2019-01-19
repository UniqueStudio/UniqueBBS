const crypto = require("crypto");

class encryptMessage {
    constructor(token, key, appid) {
        this.token = token;
        this.key = key;
        this.appid = appid;
    }
    sha1() {
        let args = Array.prototype.slice.call(arguments);
        args.sort(function(a, b) {
            a = a.toString();
            b = b.toString();
            return a > b ? 1 : a < b ? -1 : 0;
        });
        return crypto
            .createHash("sha1")
            .update(args.join(""))
            .digest("hex");
    }
    encrypt(text, timestamp, nonce) {
        var prp = new prpcrypt(this.key);
        var re = prp.encrypt(text, this.appid);
        if (re[0]) return re;
        var encrypted = re[1];
        var hash = this.sha1(this.token, timestamp, nonce, encrypted);
        return hash;
    }
    decrypt(hash, timestamp, nonce, text) {
        var _hash = this.sha1(this.token, timestamp, nonce, text);
        if (hash != _hash) return [true, "signature not match"];
        var prp = new prpcrypt(this.key);
        return prp.decrypt(text, this.appid);
    }
}

class prpcrypt {
    constructor(k) {
        this.key = new Buffer(k + "=", "base64");
        this.mode = "aes-256-cbc";
        this.iv = this.key.toString("hex").slice(0, 16);
    }

    encrypt(text, appid) {
        var text = new Buffer(text),
            pad = this.enclen(text.length);
        var pack = new PKCS7().encode(20 + text.length + appid.length),
            random = this.getRandomStr(),
            content = random + pad + text.toString("binary") + appid + pack;
        try {
            var cipher = crypto.createCipheriv(this.mode, this.key, this.iv);
            cipher.setAutoPadding(false);
            var crypted = cipher.update(content, "binary", "base64") + cipher.final("base64");
            return [false, crypted];
        } catch (e) {
            console.error(e);
            return [true, e];
        }
    }

    decrypt(encrypted) {
        var decipher, plain_text;
        try {
            decipher = crypto.Decipheriv(this.mode, this.key, this.iv);
            decipher.setAutoPadding(false);
            plain_text = decipher.update(encrypted, "base64");

            plain_text = Buffer.concat([plain_text, decipher.final()]);
        } catch (e) {
            console.error(e);
            return [true, e];
        }
        var pad = plain_text[plain_text.length - 1];
        if (pad < 1 || pad > 32) pad = 0;

        plain_text = plain_text.slice(20, -pad).toString("utf8");

        return plain_text;
    }

    enclen(len) {
        var buf = new Buffer(4);
        buf.writeUInt32BE(len);
        return buf.toString("binary");
    }

    getRandomStr() {
        var pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        var re = "";
        for (var i = 0; i < 16; i++) {
            re += pool.charAt(Math.random() * pool.length);
        }
        return re;
    }
}

class PKCS7 {
    constructor() {
        this.block_size = 32;
    }

    encode(text_length) {
        var amount_to_pad = this.block_size - (text_length % this.block_size);
        if (amount_to_pad === 0) {
            amount_to_pad = this.block_size;
        }
        var pad = String.fromCharCode(amount_to_pad),
            s = [];
        for (var i = 0; i < amount_to_pad; i++) s.push(pad);
        return s.join("");
    }
}

module.exports = encryptMessage;
