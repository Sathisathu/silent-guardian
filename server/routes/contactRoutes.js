const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// POST - Add contact
router.post("/", auth, async (req, res) => {
  const { name, phone, email, relation } = req.body;

  try {
    const newContact = await Contact.create({
      userId: req.user.id,
      name,
      phone,
      email,
      relation,
    });
    res.json(newContact);
  } catch (err) {
    console.error("Error adding contact:", err);
    res.status(500).json({ message: "Could not add contact" });
  }
});

// GET - Get all contacts for user
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch contacts" });
  }
});

// DELETE - Remove a contact by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Could not delete contact" });
  }
});

// PUT - Update contact by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, phone, email, relation } = req.body;

    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, phone, email, relation },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ message: "Could not update contact" });
  }
});


module.exports = router;
