import express, { json } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectToDb from "./src/connectToDb.js";
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Serve static images directly from html/image
const imagePath = path.join(__dirname, "..", "html", "image");
app.use("/image", express.static(imagePath));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    app: "Gymshark MERN Stack Backend",
    timestamp: new Date().toISOString(),
  });
});

// Root API Welcome
app.get("/", (req, res) => {
  res.json({
    message: "Gymshark MERN API is running!",
    endpoints: {
      products: "/api/products",
      users: "/api/users",
      orders: "/api/orders",
      contact: "/api/contact",
      health: "/api/health",
    },
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Gymshark Backend listening on http://localhost:${PORT}`);
  await connectToDb();
});
