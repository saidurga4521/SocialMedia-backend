const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_USER_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `SOCIAL MEDIA APP <${process.env.SMTP_USER_PASSWORD}>`,
    to,
    subject,
    html,
  });
};
module.exports = sendMail;
