import express from "express";
import { authLogin, authRegister, createSecurityPin, loadUser } from "../controller/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// routes
authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);
authRouter.get("/load-user", authMiddleware, loadUser);
authRouter.post("/create-security-pin", authMiddleware, createSecurityPin);  

export default authRouter;