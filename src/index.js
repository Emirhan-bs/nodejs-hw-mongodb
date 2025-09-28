import "dotenv/config";
import { setupServer } from "./src/server.js";
import { initMongoConnection } from "./src/db/initMongoConnection.js";

const start = async () => {
  await initMongoConnection();
  setupServer();
};

start();
