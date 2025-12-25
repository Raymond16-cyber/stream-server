import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});
import http from "http";
import app from "./app/app.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server currently running on port ${PORT}`);
});
