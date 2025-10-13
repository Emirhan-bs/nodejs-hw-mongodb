import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB, MONGODB_URI } =
  process.env;

export const setupServer = async () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "API is working! 🚀" });
  });

  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  let mongoUri = MONGODB_URI;
  if (!mongoUri) {
    mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

setupServer();
