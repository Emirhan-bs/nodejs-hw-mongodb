import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;
const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB } = process.env;

export const setupServer = async () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());

  const swaggerFilePath = path.resolve(__dirname, "../docs/swagger.json");
  if (fs.existsSync(swaggerFilePath)) {
    const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    console.log("📘 Swagger UI is available at /api-docs");
  } else {
    console.warn("⚠️ Swagger JSON not found. Run `npm run build-docs` first.");
  }

  app.get("/docs/swagger.json", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../docs/swagger.json"));
  });

  app.get("/docs", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Contacts API Docs</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon.ico">
        <style>
          html, body { margin:0; height:100%; background:#0f172a; color:#f8fafc; font-family:Inter,sans-serif; }
          .header { position:fixed; top:0; left:0; right:0; background:#1e293b; color:white; padding:10px 20px; display:flex; justify-content:space-between; align-items:center; z-index:9999; }
          .auth-box { display:flex; align-items:center; gap:8px; }
          .auth-box input { background:#334155; border:1px solid #475569; color:#f8fafc; padding:6px 10px; border-radius:6px; width:260px; }
          .auth-box button { background:#3b82f6; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; }
          #redoc-container { position:absolute; top:60px; bottom:260px; left:0; right:0; overflow-y:auto; }
          .test-section { position:fixed; bottom:0; left:0; right:0; background:#1e293b; border-top:1px solid #475569; padding:12px 20px; z-index:9999; }
          .test-section input { width:100%; padding:6px; margin-top:4px; border-radius:6px; border:1px solid #475569; background:#334155; color:white; }
          .test-section button { margin-top:8px; background:#10b981; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; }
          .test-section pre { background:#0f172a; padding:6px; border-radius:6px; margin-top:6px; max-height:150px; overflow-y:auto; }
        </style>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </head>
      <body>
        <div class="header">
          <h1>Contacts API Documentation</h1>
          <div class="auth-box">
            <input type="text" id="tokenInput" placeholder="Bearer token girin..." />
            <button id="saveTokenBtn">Authorize</button>
          </div>
        </div>

        <div id="redoc-container"></div>

        <div class="test-section">
          <strong>API Test</strong><br/>
          <button id="getContacts">GET /contacts</button>
          <hr>
          <strong>Yeni kişi oluştur</strong>
          <input id="nameInput" placeholder="name" />
          <input id="emailInput" placeholder="email" />
          <input id="phoneInput" placeholder="phone" />
          <button id="postContact">POST /contacts</button>
          <pre id="responseBox">Henüz test yapılmadı...</pre>
        </div>

        <script>
          let token = '';
          document.addEventListener('DOMContentLoaded', () => {
            const savedToken = localStorage.getItem('api_token');
            if (savedToken) {
              token = savedToken;
              document.getElementById('tokenInput').value = token;
            }
            Redoc.init("http://localhost:3000/docs/swagger.json",
              { theme:{ colors:{ primary:{main:"#3b82f6"}}, typography:{fontSize:"16px"} } },
              document.getElementById("redoc-container")
            );
          });

          document.getElementById('saveTokenBtn').onclick = () => {
            token = document.getElementById('tokenInput').value.trim();
            if (token) {
              localStorage.setItem('api_token', token);
              alert('Token kaydedildi!');
            }
          };

          async function doFetch(method, url, body = null) {
            const opts = { method, headers: { 'Content-Type': 'application/json' } };
            if (token) opts.headers.Authorization = 'Bearer ' + token;
            if (body) opts.body = JSON.stringify(body);
            try {
              const res = await fetch(url, opts);
              const text = await res.text();
              document.getElementById('responseBox').textContent = text;
            } catch (err) {
              document.getElementById('responseBox').textContent = 'Hata: ' + err.message;
            }
          }

          document.getElementById('getContacts').onclick = () =>
            doFetch('GET', 'http://localhost:3000/contacts');

          document.getElementById('postContact').onclick = () => {
            const name = document.getElementById('nameInput').value;
            const email = document.getElementById('emailInput').value;
            const phone = document.getElementById('phoneInput').value;
            doFetch('POST', 'http://localhost:3000/contacts', { name, email, phone });
          };
        </script>
      </body>
    </html>
  `);
  });

  app.get("/favicon.ico", (req, res) => res.status(204).end());

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
