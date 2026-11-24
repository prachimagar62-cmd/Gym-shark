# 🦈 Gymshark MERN Stack E-Commerce Platform

A complete, production-ready full-stack **MERN (MongoDB, Express, React, Node.js)** e-commerce application built on the official **Gymshark** design aesthetic.

---

## ⚡ Quick Start

To run the entire system (both Backend API and Frontend React app concurrently), open your terminal in this directory (`D:\coding\College\Summer_break\Mern_stack\Gymshark`) and run:

```bash
npm start
```
or
```bash
npm run dev
```
or double-click **`start.bat`** on Windows.

- **Frontend App:** http://localhost:5173
- **Backend REST API:** http://localhost:5000
- **MongoDB Connection:** `mongodb://127.0.0.1:27017/gymshark`

---

## 📦 Project Architecture

```
Gymshark/
├── backend/                        ← Express.js REST API
│   ├── index.js                    ← API server entry point (Port 5000)
│   ├── package.json
│   ├── .env                        ← Environment configuration (PORT, MONGO_URI, JWT_SECRET)
│   └── src/
│       ├── connectToDb.js          ← MongoDB connection with fallback mode
│       ├── fallbackData.js         ← 52 authentic Gymshark fallback products
│       ├── seed.js                 ← MongoDB Seeder script
│       ├── models/                 ← Mongoose Schemas (Product, User, Order, Contact)
│       └── routes/                 ← Express API routes (/api/products, /api/users, /api/orders, /api/contact)
├── frontend/                       ← React 19 + Vite SPA
│   ├── index.html                  ← Mount file with Montserrat fonts & FontAwesome
│   ├── vite.config.js              ← Vite build & proxy config
│   ├── package.json
│   ├── public/image/               ← 104 Gymshark product photos & banners
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 ← Router & global drawer layout
│       ├── context/ShopContext.jsx ← Shopping Bag, Wishlist, Auth & Filter state
│       ├── components/             ← Header, Footer, ProductCard, CartDrawer, WishlistDrawer, Modals
│       ├── pages/                  ← HomePage, MenPage, WomenPage, AccessoriesPage, ContactPage
│       └── styles/                 ← Exact original Gymshark CSS + App enhancements
├── html/                           ← Original HTML reference files
├── css/                            ← Original CSS reference files
├── start.js                        ← Concurrent process orchestrator
├── start.bat                       ← One-click Windows starter
├── package.json                    ← Root scripts runner
└── README.md                       ← Documentation
```

---

## 🛠️ Available npm Commands

From the root directory:

| Command | Action |
|---|---|
| `npm start` or `npm run dev` | Runs both backend and frontend concurrently |
| `npm run build` | Compiles the production frontend bundle into `frontend/dist/` |
| `npm run seed` | Re-seeds the MongoDB database with all 52 Gymshark products |
| `npm run backend` | Runs only the Express API server on port 5000 |
| `npm run frontend` | Runs only the Vite React dev server on port 5173 |

---

## ✨ Key Features

1. **52 Authentic Gymshark Products:** Pre-seeded across Men's, Women's, and Accessories with real images, fits, colors, prices, and star ratings.
2. **Interactive Shopping Bag:** Real-time quantity controls, subtotal computation, and free delivery progress meter (€75 threshold).
3. **Wishlist System:** Save any item with one click; move items seamlessly from wishlist to cart.
4. **Instant Search:** Live autocomplete dropdown across products, categories, fits, and colors.
5. **Dynamic Filtering & Sorting:** Sort by Price (Low to High / High to Low), Fit (Oversized, Slim, Regular, High Waisted), and Color.
6. **Checkout Simulation:** Complete multi-step order placement saving orders to `/api/orders`.
7. **User Authentication:** Sign in & registration modal with JWT token management.
8. **Contact Form:** Connected to `/api/contact` with instant confirmation alerts.
9. **Zero-Crash In-Memory Fallback:** The backend can run even if MongoDB service is stopped, seamlessly using pre-bundled fallback catalog data.
