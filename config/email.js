const nodemailer = require("nodemailer");

require("dotenv").config();

const SendEmail = (to, subject, body, attachments) => {
  const config = {
    mailserver: {
      host: process.env.MAILSERVER_HOST,
      port: process.env.MAILSERVER_PORT,
      secure: true,
      auth: {
        user: process.env.MAILSERVER_USER,
        pass: process.env.MAILSERVER_PASS,
      },
    },
    mail: {
      from: "Steve Milburn <no-reply@blog.com>",
      to: to,
      subject: subject,
      html: body,
      attachments: attachments,
    },
  };
  const sendMail = async ({ mailserver, mail }) => {
    // create a nodemailer transporter using smtp
    let transporter = nodemailer.createTransport(mailserver);

    // send mail using transporter
    let info = await transporter.sendMail(mail);

    console.log("Email was sent");
  };

  return sendMail(config).catch(console.error);
};

exports.SendEmail = SendEmail;
