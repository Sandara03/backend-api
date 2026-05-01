const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: "Verify Your Email Address",
    html: `
      <h2>Welcome! Please verify your email</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}" style="
        background:#4F46E5;
        color:white;
        padding:12px 24px;
        border-radius:6px;
        text-decoration:none;
      ">Verify Email</a>
      <p>Link expires in <strong>24 hours</strong>.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };