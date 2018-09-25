const chalk = require("chalk");
const cheerio = require("cheerio");
const clear = require("clear");
const clui = require("clui");
const got = require("got");
const inquirer = require("inquirer");

const fileio = require("./fileio");

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

    start() {
        this.header();

        let choices = [{ name: "Add New Site", value: "new" }];
        this.sites.forEach(url => {
            choices.push({ name: url, value: url });
        });

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "choice",
                    message: "Choose a website",
                    choices
                }
            ])
            .then(answer => {
                if (answer.choice === "new") {
                    this.url();
                }
            });
    }

    url() {
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
        got(url)
            .then(res => {
                spinner.stop();
                if (res.statusCode !== 200) {
                    this._addError(`The URL: '${url}'  is not valid.`);
                    this.url();
                }
                if (res.statusCode === 200) {
                    this.sites.push(url);
                    fileio.writeSites(this.sites);
                    this.start();
                }
            })
            .catch(err => {
                spinner.stop();
                this._addError(`An error occurred. ${err.message}`);
                this.url();
            });
    }
}

module.exports = Prompt;
