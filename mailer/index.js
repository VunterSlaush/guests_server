const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Hotmail",
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
