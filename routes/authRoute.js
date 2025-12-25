import express from "express";
import { authLogin, authRegister } from "../controller/authController.js";

const authRouter = express.Router();

// routes
authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);

export default authRouter;