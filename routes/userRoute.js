import express from "express";
import { editName } from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.put("/edit-name",authMiddleware, editName);

export default userRouter;