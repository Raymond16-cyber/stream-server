import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendForgotPasswordEmail = async (to, resetLink) => {
  const transporter = createTransporter();
console.log("Reset Link:", resetLink);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>This link will expire in 15 minutes.</p>
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 15px;
           background:#007BFF;color:#fff;text-decoration:none;
           border-radius:5px;">
          Reset Password
        </a>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
