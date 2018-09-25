const clear = require("clear");
const clui = require("clui");
const got = require("got");
const inquirer = require("inquirer");

class Prompt {
    clear() {
        clear();
    }

    start() {
        this.clear();
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "choice",
                    message: "Choose a website",
                    choices: [{ name: "Add New Site", value: "new" }]
                }
            ])
            .then(answer => {
                if (answer.choice === "new") {
                    this.url();
                }
            });
    }

    url() {
        this.clear();
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "url",
                    message: "Website URL:"
                }
            ])
            .then(res => {
                this.verifyURL(res.url);
            });
    }

    siteName(url) {
        this.clear();
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: `Site Name for ${url}`
                }
            ])
            .then(res => {
                console.log(res);
            });
    }

    verifyURL(url) {
        this.clear();
        var spinner = new clui.Spinner(`Checking ${url}...`);
        spinner.start();
        got(url)
            .then(res => {
                spinner.stop();
                if (res.statusCode !== 200) {
                    this.url();
                }
                if (res.statusCode === 200) {
                    this.siteName(url);
                }
            })
            .catch(err => {
                spinner.stop();
                this.url();
            });
    }
}

module.exports = Prompt;
