import "dotenv/config";
import { setupServer } from "./src/server.js";
import { initMongoConnection } from "./src/db/initMongoConnection.js";
import { sendMail } from "./src/services/mailer.js";

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
