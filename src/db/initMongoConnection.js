import mongoose from "mongoose";

export const initMongoConnection = async () => {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}`;
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB });
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Mongo connection failed:", error);
    process.exit(1);
  }
};
