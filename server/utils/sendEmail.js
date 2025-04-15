const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (to, message, location) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🚨 Emergency Alert",
    text: `${message || "Emergency!"}\n\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
};

module.exports = { sendAlertEmail };
