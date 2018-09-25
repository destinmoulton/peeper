const fs = require("fs");
const util = require("util");
const path = require("path");

const PATH = path.join(process.cwd(), "sites");
const SITES_JSON_PATH = path.join(PATH, "sites.json");

function initSitesDir() {
    if (!fs.existsSync(PATH)) {
        fs.mkdirSync(PATH);
    }
}

function getSites() {
    if (!fs.existsSync(SITES_JSON_PATH)) {
        return [];
    }
    const jsonString = fs.readFileSync(SITES_JSON_PATH);

    return JSON.parse(jsonString);
}

function writeSites(sites) {
    initSitesDir();

    const data = JSON.stringify(sites);
    fs.writeFileSync(SITES_JSON_PATH, data);
}

module.exports = { getSites, writeSites };
