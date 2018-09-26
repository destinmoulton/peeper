const got = require("got");

function get(url) {
    return got(url).then(res => {
        return res;
    });
}

module.exports = { get };
