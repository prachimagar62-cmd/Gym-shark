import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 5001;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(currentDirectory, "..");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String, default: "Black" },
  fit: { type: String, default: "Regular Fit" },
  rating: { type: Number, default: 4.5 },
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  items: [{ name: String, price: Number, image: String }],
  total: Number,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Order = mongoose.model("Order", orderSchema);

const fallbackProducts = [
  { name: "Crest Oversized Hoodie", category: "men", price: 50, image: "/image/men/p1.png", color: "Black", fit: "Oversized Fit", rating: 4.3 },
  { name: "Hybrid Graphic T-Shirt", category: "men", price: 32, image: "/image/men/p2.png", color: "Black", fit: "Oversized Fit", rating: 4.3 },
  { name: "SuperSoft Zip Through Hoodie", category: "women", price: 55, image: "/image/women/p1.png", color: "Dusk Pink", fit: "Slim Fit", rating: 4.3 },
  { name: "Everyday Seamless Long Sleeve Crop Top", category: "women", price: 32, image: "/image/women/p2.png", color: "Black", fit: "Slim Fit", rating: 4.3 },
  { name: "Tactical Backpack", category: "accessories", price: 115, image: "/image/accessories/p1.png", color: "Soft Brown", fit: "One Size", rating: 4.9 },
  { name: "Crew Socks 3pk", category: "accessories", price: 16, image: "/image/accessories/p2.png", color: "White", fit: "One Size", rating: 4.1 },
];

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "fallback" });
});

app.get("/api/products", async (request, response, next) => {
  try {
    const category = String(request.query.category || "").toLowerCase();
    const products = mongoose.connection.readyState === 1
      ? await Product.find(category ? { category } : {}).lean()
      : fallbackProducts.filter((product) => !category || product.category === category);
    response.json(products);
  } catch (error) {
    next(error);
  }
});

app.post("/api/contact", async (request, response, next) => {
  const { name, email, subject, message } = request.body || {};
  if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
    return response.status(400).json({ message: "Please complete every field." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    return response.status(400).json({ message: "Enter a valid email address." });
  }

  try {
    const contact = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() };
    if (mongoose.connection.readyState === 1) await Contact.create(contact);
    response.status(201).json({ message: "Message received." });
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (request, response, next) => {
  const items = request.body?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return response.status(400).json({ message: "Your bag is empty or contains too many items." });
  }
  const validItems = items.every((item) => typeof item.name === "string" && item.name.length <= 160 && Number.isFinite(item.price) && item.price > 0);
  if (!validItems) return response.status(400).json({ message: "One or more bag items are invalid." });

  try {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const order = mongoose.connection.readyState === 1
      ? await Order.create({ items, total })
      : { _id: `DEMO-${Date.now().toString(36).toUpperCase()}` };
    response.status(201).json({ orderId: String(order._id), total });
  } catch (error) {
    next(error);
  }
});

if (process.env.NODE_ENV === "production") {
  const buildDirectory = path.join(projectDirectory, "dist");
  app.use(express.static(buildDirectory));
  app.get("/{*path}", (_request, response) => response.sendFile(path.join(buildDirectory, "index.html")));
}

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      if (await Product.countDocuments() === 0) await Product.insertMany(fallbackProducts);
      console.log("Connected to MongoDB.");
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        console.error("MongoDB connection failed; refusing to start production API.", error.message);
        process.exit(1);
      }
      console.error("MongoDB connection failed; using local fallback data.", error.message);
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("MONGODB_URI is required in production.");
    process.exit(1);
  } else {
    console.log("MONGODB_URI is not set; API is using local fallback data.");
  }

  app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
}

startServer();