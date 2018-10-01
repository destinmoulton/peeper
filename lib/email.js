const path = require("path");

const mailer = require("nodemailer");
const moment = require("moment");
const nunjucks = require("nunjucks");

const config = require("../config");

const transporter = mailer.createTransport(config.email.smtp);

nunjucks.configure(path.join(process.cwd(), "templates"));

async function send(sites) {
    const problemSites = sites.filter(site => {
        return !site.isSiteUp;
    });

    if (problemSites.length > 0) {
        try {
            const time = moment().format("h:mm:ss a on dddd, MMMM Do YYYY");
            await transporter.sendMail({
                from: config.email.from,
                to: config.email.to,
                subject: "Website Down :: peeper notification",
                html: nunjucks.render("email.html", {
                    sites: problemSites,
                    time
                })
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = { send };
