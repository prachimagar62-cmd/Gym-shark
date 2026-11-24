import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "gymshark_secret_jwt_key_2026";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      // In-memory demo response
      const token = jwt.sign({ email, name, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        success: true,
        message: "Registered successfully (demo mode)",
        user: { name, email, role: "user" },
        token,
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      // Allow instant demo login
      const token = jwt.sign({ email, name: email.split("@")[0], role: "user" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        success: true,
        message: "Logged in successfully (demo mode)",
        user: { name: email.split("@")[0], email, role: "user" },
        token,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
