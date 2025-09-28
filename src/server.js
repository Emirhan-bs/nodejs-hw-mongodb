import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import contactsRouter from "./routers/contacts.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

// Routers
app.use("/contacts", contactsRouter);

// notFound handler (404)
app.use(notFoundHandler);

// error handler (4 arg)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/contactsdb";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
