# Gymshark Storefront

This project keeps the existing HTML and CSS storefront while adding a React/Vite client and an Express/MongoDB API.

For AWS EC2, Nginx, PM2, MongoDB Atlas, and GitHub Actions deployment instructions, see [infra/DEPLOYMENT.md](infra/DEPLOYMENT.md).

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB Community Server or a MongoDB Atlas connection string (optional for local development)

## Start locally

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. The API listens on `http://localhost:5001`. Without MongoDB configured, the product API uses sample data and contact/order requests are accepted for the current process only.

To persist submissions and products, copy `.env.example` to `.env`, set `MONGODB_URI`, and start MongoDB before running the app. Products can be read from `GET /api/products`; add product documents to the `products` collection to manage catalog data through MongoDB.

## Production build

```sh
npm run build
npm start
```

Set `NODE_ENV=production` to serve the built client and API from one Express process. Checkout is a demo flow and does not collect payment details.

## API

- `GET /api/health` reports server and database status.
- `GET /api/products?category=women` lists catalog products.
- `POST /api/contact` validates and accepts a contact message.
- `POST /api/orders` validates a demo order and returns its reference.