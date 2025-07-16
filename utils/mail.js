import nodemailer from "nodemailer";
import User from "../models/User.model.js";

const sendVerificationMail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOption = {
    from: process.env.MAILTRAP_SENDERMAIL,
    to: user.email,
    subject: "Verify your email", // Subject line
    text: `Please click the following link to verify your email:\n${process.env.BASE_URL}/api/v1/users/verify/${token}`,
  };

  await transporter.sendMail(mailOption);
};

export default sendVerificationMail;
