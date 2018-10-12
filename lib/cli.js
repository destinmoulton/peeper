const chalk = require("chalk");
const clear = require("clear");
const clui = require("clui");
const inquirer = require("inquirer");

const fileio = require("./fileio");
const siteup = require("./siteup");

class CLI {
    constructor() {
        this.errors = [];
        this.columns = process.stdout.columns;
        this.sites = [];
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
        this.centerLn("peeper - website monitor");
        this.writeLn("-".repeat(this.columns));

        if (h.length) {
            this.writeLn();
            this.writeLn(" " + chalk.underline.green(h));
            this.writeLn();
        }
        this._showErrors();
    }

    async getSitesStatus() {
        this.header("Website Monitor");
        var spinner = new clui.Spinner(`Checking websites...`);
        spinner.start();

        try {
            this.sites = await siteup.checkMultiple(fileio.getSites());
            spinner.stop();
            this.inputSelectSite();
        } catch (err) {
            throw err;
        }
    }

    async inputSelectSite() {
        this.header("Websites");

        let choices = [
            { name: chalk.blueBright("+ Add New Site"), value: "new" }
        ];

        this.sites.forEach(site => {
            const prefix = site.isSiteUp
                ? chalk.green("[UP]")
                : chalk.redBright("[" + site.statusCode.toString() + "]");
            choices.push({ name: prefix + " " + site.url, value: site.url });
        });

        return inquirer
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
                } else {
                    this.inputSiteOptions(answer.choice);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    inputURL() {
        this.header("Add a Website");
        return inquirer
            .prompt([
                {
                    type: "input",
                    name: "url",
                    message: chalk.yellowBright("Website URL:"),
                    prefix: "  "
                }
            ])
            .then(input => {
                this.verifyURL(input.url);
            })
            .catch(err => {
                console.error(err);
            });
    }

    inputSiteOptions(url) {
        this.header(`${url}`);

        const choices = [{ name: "Delete", value: "delete" }];
        return inquirer
            .prompt([
                {
                    type: "list",
                    name: "option",
                    message: "Choose:",
                    choices,
                    prefix: ""
                }
            ])
            .then(answer => {
                if (answer.option === "delete") {
                    this.deleteSite(url);
                }
            });
    }

    deleteSite(url) {
        this.sites = this.sites.filter(site => {
            return site.url !== url;
        });

        this.saveSites();
        this.getSitesStatus();
    }

    saveSites() {
        fileio.writeSites(
            this.sites.map(site => {
                return site.url;
            })
        );
    }

    verifyURL(url) {
        this.header("Add a Website");
        var spinner = new clui.Spinner(`Checking ${url}...`);
        spinner.start();
        return siteup
            .checkSingle(url)
            .then(res => {
                spinner.stop();
                if (res.isSiteUp) {
                    this.sites.push(res);
                    this.saveSites();
                    this.inputSelectSite();
                } else {
                    this._addError(
                        `The URL: '${res.url}'  is not valid. ${
                            res.statusMessage
                        }`
                    );
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

module.exports = CLI;
