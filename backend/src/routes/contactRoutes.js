import { Router } from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, reason, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected && process.env.NODE_ENV === "production") {
      return res.status(503).json({ success: false, message: "Database unavailable; message was not saved" });
    }

    if (isDbConnected) {
      await Contact.create({ name, email, reason, message });
    }

    res.status(201).json({
      success: true,
      message: `Thank you ${name}! Your inquiry has been received. Our team will contact you at ${email} shortly.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
