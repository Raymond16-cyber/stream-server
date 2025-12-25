import express from "express"
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "../config/DBConfig.js";
import cookieParser from "cookie-parser";
import authRouter from "../routes/authRoute.js";
import movieRouter from "../routes/movieRoute.js";
import userRouter from "../routes/userRoute.js";

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

// health check
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/v1", movieRouter);
app.use("/api/me", userRouter);

export default app;
