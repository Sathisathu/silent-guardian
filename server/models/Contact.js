const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  phone: String,
  email: String, // ✅ Add email field
  relation: String,
});

module.exports = mongoose.model("Contact", contactSchema);
