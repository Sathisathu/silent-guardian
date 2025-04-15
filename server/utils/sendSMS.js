const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendAlertSMS = async (to, message, location) => {
  try {
    const fullMessage = `${message || "Emergency!"}\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}`;

    await client.messages.create({
      body: fullMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("📱 SMS sent to:", to);
  } catch (error) {
    console.error("❌ SMS send failed:", error.message);
  }
};

module.exports = { sendAlertSMS };
