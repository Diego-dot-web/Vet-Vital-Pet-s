import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: import.meta.env.EMAIL,
    pass: import.meta.env.PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});
