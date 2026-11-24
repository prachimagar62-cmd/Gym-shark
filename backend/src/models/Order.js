import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, default: "M" },
  color: { type: String, default: "Black" },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
});

const orderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Nepal" },
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;
