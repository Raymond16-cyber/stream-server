import express from "express";
import { authDestroyAccount, authForgetPassword, authLogin, authRegister, createSecurityPin, loadUser } from "../controller/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// routes
authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);
authRouter.post("/forgot-password", authForgetPassword);
authRouter.get("/load-user", authMiddleware, loadUser);
authRouter.post("/create-security-pin", authMiddleware, createSecurityPin);  
authRouter.delete("/destroy-account", authMiddleware, authDestroyAccount);

export default authRouter;