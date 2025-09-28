import "dotenv/config";
import { setupServer } from "./src/server.js";
import { initMongoConnection } from "./src/db/initMongoConnection.js";

const start = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (err) {
    console.error("Failed to start the server:", err);
  }
};

start();
