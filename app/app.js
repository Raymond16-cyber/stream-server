import express from "express"
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "../config/DBConfig.js";
import cookieParser from "cookie-parser";
import authRouter from "../routes/authRoute.js";
import movieRouter from "../routes/movieRoute.js";

// Connect to database
connectDB();

const app = express();

// CORS config
app.use(
  cors({
    origin:true,
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Optional: health check
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/v1", movieRouter);

export default app;
