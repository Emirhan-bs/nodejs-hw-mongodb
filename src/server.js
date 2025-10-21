import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("JWT_SECRET VALUE:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;
const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB } = process.env;

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

  const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

setupServer();
