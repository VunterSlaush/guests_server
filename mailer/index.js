const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com", // hostname
  secure: true,
  port: 465, // port for secure SMTP
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: "jgil@cupofcodeteam.com",
    pass: "Jonixxla5"
  }
});

async function simpleMail(str, subject, receiver) {
  console.log("Trying Send", str, subject, receiver);
  const mailOptions = {
    from: "jgil@cupofcodeteam.com", // sender address
    to: receiver, // list of receivers
    subject, // Subject line
    text: str
  };

  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("ERROR MAIL", error);
      resolve(!error);
    });
  });

  // send mail with defined transport object
}

module.exports = {
  simpleMail
};
