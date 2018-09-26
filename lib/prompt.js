const chalk = require("chalk");
const clear = require("clear");
const clui = require("clui");
const inquirer = require("inquirer");

const fileio = require("./fileio");
const siteio = require("./siteio");

class Prompt {
    constructor() {
        this.errors = [];
        this.columns = process.stdout.columns;
        this.sites = fileio.getSites();
    }

    clear() {
        clear();
    }

    writeLn(l = "") {
        process.stdout.write(l + "\n");
    }

    centerLn(l) {
        const leftSpaces = (this.columns - l.length) / 2;
        this.writeLn(" ".repeat(leftSpaces) + l);
    }

    _addError(e) {
        this.errors.push(e);
    }

    _showErrors() {
        this.errors.forEach(err => {
            this.writeLn(chalk.bgRed.white(err));
        });
        this.errors = [];
    }

    header(h = "") {
        this.clear();
        this.writeLn("-".repeat(this.columns));
        this.centerLn("  peeper - website monitor");
        this.writeLn("-".repeat(this.columns));

        if (h.length) {
            this.writeLn();
            this.writeLn(" " + chalk.underline.green(h));
            this.writeLn();
        }
        this._showErrors();
    }

    async inputSelectSite() {
        this.header("Websites");

        let choices = [
            { name: chalk.blueBright("Add New Site"), value: "new" }
        ];

        const results = await siteio.getMultiple(this.sites);
        results.forEach(site => {
            const prefix = siteio.isUp(site.res)
                ? chalk.green("[UP]")
                : chalk.redBright("[" + site.res.statusCode.toString() + "]");
            choices.push({ name: prefix + " " + site.url, value: site.url });
        });

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "choice",
                    message: chalk.magentaBright("Choose:"),
                    choices,
                    prefix: ""
                }
            ])
            .then(answer => {
                if (answer.choice === "new") {
                    this.inputURL();
                }
            });
    }

    inputURL() {
        this.header("Add a Website");
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "url",
                    message: chalk.yellowBright("Website URL:"),
                    prefix: "  "
                }
            ])
            .then(res => {
                this.verifyURL(res.url);
            });
    }

    verifyURL(url) {
        this.header("Add a Website");
        var spinner = new clui.Spinner(`Checking ${url}...`);
        spinner.start();
        siteio
            .getSingle(url)
            .then(res => {
                spinner.stop();
                if (siteio.isUp(res)) {
                    this.sites.push(url);
                    fileio.writeSites(this.sites);
                    this.inputSelectSite();
                } else {
                    this._addError(`The URL: '${url}'  is not valid.`);
                    this.inputURL();
                }
            })
            .catch(err => {
                spinner.stop();
                this._addError(`An error occurred. ${err.message}`);
                this.inputURL();
            });
    }
}

module.exports = Prompt;
