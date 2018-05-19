const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  secure: false,
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: "visit_me_app@hotmail.com",
    pass: "Visitme123"
  }
});

async function simpleMail(str, subject, receiver) {
  console.log("Trying Send", str, subject, receiver);
  const mailOptions = {
    from: "visit_me_app@hotmail.com", // sender address
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
