import "dotenv/config";
import { setupServer } from "./src/server.js";
import { initMongoConnection } from "./src/db/initMongoConnection.js";
import { sendMail } from "./src/services/mailer.js";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" assert { type: "json" };
const start = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
};

start();
sendMail({
  to: "kendi_epostan@gmail.com",
  subject: "Test email from Node.js",
  html: "<h1>Merhaba Emirhan!</h1><p>Mail sistemin çalışıyor 🎉</p>",
});
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger docs at http://localhost:3000/api-docs");
});
