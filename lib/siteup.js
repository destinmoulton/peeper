const got = require("got");

async function checkSingle(url) {
    return got
        .get(url)
        .then(res => {
            return {
                url,
                body: res.body,
                isSiteUp: isUp(res),
                statusCode: res.statusCode,
                statusMessage: res.statusMessage
            };
        })
        .catch(err => {
            if (err instanceof got.HTTPError) {
                return {
                    url,
                    body: "",
                    isSiteUp: false,
                    statusCode: err.statusCode,
                    statusMessage: err.statusMessage
                };
            }
            throw err;
        });
}

async function checkMultiple(sites) {
    return Promise.all(
        sites.map(async url => {
            return await checkSingle(url);
        })
    );
}

function isUp(requestResult) {
    if (!requestResult) return false;
    return requestResult.statusCode.toString().startsWith("2");
}

module.exports = { checkSingle, checkMultiple, isUp };
