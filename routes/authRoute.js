import express from "express";
import { authLogin, authRegister, loadUser } from "../controller/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// routes
authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);
authRouter.get("/load-user", authMiddleware, loadUser);

export default authRouter;