const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport("SMTP", {
  service: "hotmail",
  auth: {
    user: "visit_me_app@hotmail.com",
    pass: "Visitme123"
  }
});

async function simpleMail(str, subject, receiver) {
  console.log("Trying Send", str, subject, receiver);
  const mailOptions = {
    from: '"Vist Me App" <visit_me_app@hotmail.com>', // sender address
    to: receiver, // list of receivers
    subject, // Subject line
    text: str
  };

  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, (error, info) => {
      resolve(!error);
      console.log("Message sent: %s", info.messageId);
    });
  });

  // send mail with defined transport object
}

module.exports = {
  simpleMail
};
