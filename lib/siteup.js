const got = require("got");

async function getSingle(url) {
    return got
        .get(url)
        .then(res => {
            return res;
        })
        .catch(err => {
            if (err instanceof got.HTTPError) {
                return {
                    statusCode: err.statusCode,
                    statusMessage: err.statusMessage
                };
            }
            return false;
        });
}

async function getMultiple(sites) {
    return Promise.all(
        sites.map(async url => {
            const res = await getSingle(url);
            return { url, res };
        })
    );
}

function isUp(requestResult) {
    if (!requestResult) return false;
    return requestResult.statusCode.toString().startsWith("2");
}

module.exports = { getSingle, getMultiple, isUp };
