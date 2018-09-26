import got from "got";

function isUp(url) {
    got(url).then(res => {
        if (res.statusCode.toString().startsWith("2")) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports = [isUp];
