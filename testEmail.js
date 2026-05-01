require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function test() {
  const info = await transport.sendMail({
    from: 'noreply@yourapp.com',
    to: 'tajanlangitsandara32@gmail.com',
    subject: 'You are awesome!',
    text: 'Congrats for sending test email with Mailtrap!',
  });
  console.log('Email sent:', info.messageId);
}

test().catch(console.error);
