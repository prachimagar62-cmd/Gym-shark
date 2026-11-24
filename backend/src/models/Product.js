import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "accessories"],
    },
    subCategory: { type: String, default: "Apparel" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: "€" },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 12 },
    fit: { type: String, default: "Regular Fit" },
    color: { type: String, default: "Black" },
    availableSizes: {
      type: [String],
      default: ["S", "M", "L", "XL", "XXL"],
    },
    image: { type: String, required: true },
    description: { type: String },
    featured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
export default Product;
