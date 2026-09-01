import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./db/connection.js";

import UsersRouter from "./routes/users.js";
import ProductsRouter from "./routes/products.js";
import UploadRouter from "./routes/uploads.js";
import AuthRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "style-src": ["'self'", "'unsafe-inline'"],
        "frame-src": [
          "'self'",
          "https://www.google.com",
          "https://maps.google.com",
        ],
        "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
      },
    },
  }),
);
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// API routes
app.use("/api/users", UsersRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/uploads", UploadRouter);
app.use("/api/auth", AuthRouter);

// Frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../client/dist");

app.use(express.static(frontendPath));

// React Router fallback
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
const startServer = async () => {
  await connectDB(process.env.CONNECTION_STRING);

  app.listen(PORT, () => {
    console.log("server has started");
  });
};

startServer();
