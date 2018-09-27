const path = require("path");

const mailer = require("nodemailer");
const moment = require("moment");
const nunjucks = require("nunjucks");

const config = require("../config");

const transporter = mailer.createTransport(config.email.smtp);

nunjucks.configure(path.join(process.cwd(), "templates"));

async function send(sites) {
    try {
        const time = moment().format("h:mm:ss a on dddd, MMMM Do YYYY");
        await transporter.sendMail({
            from: config.email.from,
            to: config.email.to,
            subject: "TEST",
            html: nunjucks.render("email.html", { sites, time })
        });
    } catch (err) {
        console.error(err);
    }
}

send([
    {
        url: "google.om",
        statusCode: 404,
        statusMessage: "Unable to find webpage."
    }
]);
