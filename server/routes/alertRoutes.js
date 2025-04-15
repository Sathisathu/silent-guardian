const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");
const { sendAlertEmail } = require("../utils/sendEmail");
const { sendAlertSMS } = require("../utils/sendSMS");
const Contact = require("../models/Contact");

// @route   POST /api/alerts/trigger
// @desc    Trigger a new alert
// @access  Private
router.post("/trigger", protect, async (req, res) => {
  try {
    const { message = "", location } = req.body;

    if (!location || location.lat == null || location.lng == null) {
      return res
        .status(400)
        .json({ message: "Location (lat & lng) is required." });
    }

    // Use fallback message if none provided
    const alertMessage = message.trim() || "Emergency alert! Please respond.";

    // 1. Create and save the alert
    const newAlert = new Alert({
      user: req.user._id,
      message: alertMessage,
      location,
    });

    await newAlert.save();

    // 2. Get user's emergency contacts
    const contacts = await Contact.find({ userId: req.user._id });

    // 3. Notify each contact
    for (const contact of contacts) {
      // Send email if email is available
      if (contact.email) {
        sendAlertEmail(contact.email, alertMessage, location);
      }

      // Send SMS if phone number is available
      if (contact.phone) {
        const formattedPhone = contact.phone.startsWith("+")
          ? contact.phone
          : `+91${contact.phone}`; // Change country code if needed
        sendAlertSMS(formattedPhone, alertMessage, location);
      }
    }

    res.status(201).json({
      message: "Alert triggered. Emails and SMS notifications sent.",
      alert: newAlert,
    });
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
