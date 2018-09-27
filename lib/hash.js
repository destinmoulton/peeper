const crypto = require("crypto");

function hash(s) {
    return crypto
        .createHash("sha1")
        .update(s)
        .digest("hex");
}

module.exports = hash;
