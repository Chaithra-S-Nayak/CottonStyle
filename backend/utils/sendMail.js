const nodemailer = require("nodemailer");

const sendMail = async (options) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");
    // console.log("Message ID:", info.messageId);
  } catch (error) {
    // console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
