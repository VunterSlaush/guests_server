const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: "visitme_app@outlook.com",
    pass: "Visitme123"
  },
  tls: {
    ciphers: "SSLv3"
  }
});

async function simpleMail(str, subject, receiver) {
  const mailOptions = {
    from: '"Vist Me App" <visitme_app@outlook.com>', // sender address
    to: receiver, // list of receivers
    subject, // Subject line
    text: str
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

module.exports = {
  simpleMail
};
