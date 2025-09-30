import express from "express";
import cors from "cors";
import contactsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "API is working! 🚀" });
  });

  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
