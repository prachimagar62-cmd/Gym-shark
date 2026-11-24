import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = Router();

// CREATE Order
router.post("/", async (req, res) => {
  try {
    const { customerName, email, phone, shippingAddress, items, totalAmount, paymentMethod } = req.body;

    if (!customerName || !email || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required order information" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    const orderData = {
      orderNumber: "GS-" + Math.floor(100000 + Math.random() * 900000),
      customerName,
      email,
      phone,
      shippingAddress: shippingAddress || { street: "123 Gymshark Way", city: "Kathmandu" },
      items,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "Processing",
      createdAt: new Date(),
    };

    if (isDbConnected) {
      const saved = await Order.create(orderData);
      return res.status(201).json({ success: true, message: "Order placed successfully!", order: saved });
    }

    // In-memory demo response
    res.status(201).json({ success: true, message: "Order placed successfully! (Demo)", order: orderData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.json({ success: true, orders: [] });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
