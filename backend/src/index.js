import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs'; // Add this import

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static files in production
if (process.env.NODE_ENV === "production") {
  // Try multiple possible paths for the frontend dist
  const possiblePaths = [
    path.join(__dirname, "../../frontend/dist"),  // Render.com structure
    path.join(__dirname, "../frontend/dist"),    // Local development
    path.join(__dirname, "dist")                 // Alternative
  ];

  let frontendPath = possiblePaths.find(p => {
    try {
      return fs.existsSync(path.join(p, "index.html"));
    } catch {
      return false;
    }
  });

  if (frontendPath) {
    console.log("Serving static files from:", frontendPath);
    app.use(express.static(frontendPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.error("Could not find frontend dist directory!");
    console.log("Tried paths:", possiblePaths);
  }
}

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});