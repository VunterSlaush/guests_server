const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
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
