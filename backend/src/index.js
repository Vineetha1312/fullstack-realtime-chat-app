import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

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
// Update your static file serving section like this:
if (process.env.NODE_ENV === "production") {
  // Try multiple possible paths for the frontend dist
  const possiblePaths = [
    path.join(__dirname, "../frontend/dist"),       // Local development structure
    path.join(__dirname, "../../frontend/dist"),    // Possible Render.com structure
    path.join(__dirname, "frontend/dist"),          // Alternative structure
    path.join(__dirname, "dist")                    // If files are copied here
  ];

  let frontendPath = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      frontendPath = possiblePath;
      break;
    }
  }

  if (!frontendPath) {
    console.error("Could not find frontend dist directory!");
    // List all paths that were tried
    console.log("Tried paths:", possiblePaths);
    // Try to list the current directory contents
    console.log("Current __dirname contents:", fs.readdirSync(__dirname));
    console.log("Parent directory contents:", fs.readdirSync(path.join(__dirname, "..")));
  } else {
    console.log("Serving static files from:", frontendPath);
    app.use(express.static(frontendPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  }
}

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});