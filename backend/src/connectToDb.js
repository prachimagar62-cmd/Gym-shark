import mongoose from "mongoose";

const connectToDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri && process.env.NODE_ENV === "production") {
    throw new Error("MONGO_URI is required in production.");
  }

  try {
    await mongoose.connect(mongoUri || "mongodb://127.0.0.1:27017/gymshark");
    console.log("Connected to MongoDB successfully: gymshark");
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("MongoDB connection warning:", error.message);
    console.warn("Backend will continue running in in-memory fallback mode if DB is offline.");
  }
};

export default connectToDb;
