import mongoose from "mongoose";

export const initMongoConnection = async () => {
  try {
    const {
      MONGODB_URI,
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_URL,
      MONGODB_DB,
    } = process.env;

    const uri =
      MONGODB_URI ||
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);

    console.log("✅ MongoDB connection successfully established!");
  } catch (e) {
    console.error("❌ Error while setting up MongoDB connection:", e.message);
    process.exit(1);
  }
};
