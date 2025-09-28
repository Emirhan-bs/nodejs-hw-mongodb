import mongoose from "mongoose";

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB,
    });
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Mongo connection failed:", error);
    process.exit(1);
  }
};
