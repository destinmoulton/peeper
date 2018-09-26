const got = require("got");

async function getSingle(url) {
    return got(url).then(res => {
        return res;
    });
}

function getMultiple(sites) {
    return Promise.all(
        sites.map(async url => {
            const res = await getSingle(url);
            return { url, res };
        })
    );
}

function isUp(requestResult) {
    return requestResult.statusCode.toString().startsWith("2");
}

module.exports = { getSingle, getMultiple, isUp };
