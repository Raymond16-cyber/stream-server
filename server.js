console.log("ESM active:", import.meta.url);
import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});
import http from "http";
import app from "./app/app.js";
import { initializeCloudinary } from "./services/cloudinary.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Initialize Cloudinary after env vars are loaded
initializeCloudinary()
  .then(() => {
    console.log("🎉 Cloudinary initialization complete");
  })
  .catch((error) => {
    console.error("❌ Failed to initialize Cloudinary:", error);
    // Don't exit the process, just log the error
  });

server.listen(PORT, () => {
  console.log(`🚀 Server currently running on port ${PORT}`);
});
