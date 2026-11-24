import mongoose from "mongoose";
import connectToDb from "./connectToDb.js";
import Product from "./models/Product.js";
import { initialProducts } from "./fallbackData.js";

const seedData = async () => {
  console.log("Starting Gymshark Database Seeder...");
  await connectToDb();

  try {
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const inserted = await Product.insertMany(initialProducts);
    console.log(`Successfully seeded ${inserted.length} Gymshark products (Men, Women, Accessories)!`);
  } catch (err) {
    console.error("Seeding error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

seedData();
