import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { initialProducts } from "../fallbackData.js";

const router = Router();

// GET all products with optional filters (category, search, sort, fit, price)
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, fit, minPrice, maxPrice } = req.query;

    // Check if MongoDB is connected; if not, query in-memory
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      let filtered = [...initialProducts];
      if (category && category !== "all") {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (fit && fit !== "all") {
        filtered = filtered.filter((p) =>
          p.fit.toLowerCase().includes(fit.toLowerCase())
        );
      }
      if (minPrice) {
        filtered = filtered.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q) ||
            p.subCategory.toLowerCase().includes(q) ||
            p.fit.toLowerCase().includes(q)
        );
      }
      if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
      else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
      else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

      return res.json({
        success: true,
        source: "fallback",
        count: filtered.length,
        products: filtered,
      });
    }

    // Live MongoDB Query
    const query = {};
    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }
    if (fit && fit !== "all") {
      query.fit = { $regex: fit, $options: "i" };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { fit: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };

    let products = await Product.find(query).sort(sortOption);

    // If DB is empty, auto-seed with fallback products
    if (products.length === 0 && !category && !search) {
      await Product.insertMany(initialProducts);
      products = await Product.find().sort(sortOption);
    }

    res.json({
      success: true,
      source: "database",
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      const product = initialProducts.find((p, index) => String(index) === req.params.id || p.name === req.params.id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      return res.json({ success: true, product });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
