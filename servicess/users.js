const { Users } = require("../models/users");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const addUser = async (data) => {
  return await Users.create(data);
};
const findByEmail = async (email) => {
  return await Users.findOne({ email });
};
const findById = async (id) => {
  return await Users.findOne({ _id: id });
};
const updateUser = async (id, newData) => {
  return await Users.findByIdAndUpdate({ _id: id }, newData);
};
const verifyUser = async ({ verificationToken }, data) => {
  return await Users.findOneAndUpdate(
    { verificationToken: verificationToken },
    data
  );
};
const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: process.env.VERIFICATION_EMAIL_ADDRESS,
    subject: "Email verification",
    text: `http://localhost:${process.env.PORT}/users/verify/${verificationToken}!`,
    html: `<a href="http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}">Click to verify your email!</a>`,
  };

  await sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
    })
    .catch((error) => {
      console.error("mailing eror", error.response.body.errors);
    });
};

module.exports = {
  addUser,
  findByEmail,
  findById,
  updateUser,
  sendVerificationEmail,
  verifyUser,
};
