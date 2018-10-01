const minimist = require("minimist");

const CLI = require("./lib/cli");

const argv = minimist(process.argv.slice(2));

if (argv["silent"] !== undefined && argv["silent"] === true) {
    // Run the silent version
} else {
    cli = new CLI();
    cli.getSitesStatus();
}
