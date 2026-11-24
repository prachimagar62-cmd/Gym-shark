import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gymshark";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully: gymshark");
  } catch (error) {
    console.warn("MongoDB connection warning:", error.message);
    console.warn("Backend will continue running in in-memory fallback mode if DB is offline.");
  }
};

export default connectToDb;
