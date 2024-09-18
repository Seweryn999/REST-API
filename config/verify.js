const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sender = process.env.MAIL_SENDER;
const emailLink = "localhost:3000/api/contacts/users";

const generateVerifyToken = () => {
  const token = uuidv4();
  return token;
};

const sendVerificationEmail = (userEmail, verificationToken) => {
  const msg = {
    to: userEmail,
    from: sender,
    subject: "Verification Email",
    html: `
    <p>This is an automated message. Please do not reply to it. If you are not the author of this message, please contact the sender.</p>
    <p>Please click the following link to verify your email: <a href= "${emailLink}/verify/${verificationToken}">"${emailLink}/verify/${verificationToken}"</a></p>
  `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  generateVerifyToken,
  sendVerificationEmail,
};
