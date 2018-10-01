const minimist = require("minimist");

const CLI = require("./lib/cli");
const email = require("./lib/email");
const fileio = require("./lib/fileio");
const siteup = require("./lib/siteup");

const argv = minimist(process.argv.slice(2));

if (argv["silent"] !== undefined && argv["silent"] === true) {
    // Run the silent version
    try {
        (async () => {
            const sites = await siteup.checkMultiple(fileio.getSites());
            email.send(sites);
        })();
    } catch (err) {
        console.error(err);
    }
} else {
    cli = new CLI();
    cli.getSitesStatus();
}
