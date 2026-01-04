import express from "express";
import {
  createProfile,
  deleteProfile,
  editUserDetails,
  switchProfile,
  toggleMultiProfile,
} from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../config/multerConfig.js";

const userRouter = express.Router();

userRouter.post("/edit-user-details", upload.single("file"), authMiddleware, editUserDetails);
userRouter.put("/toggle-multi-profile", authMiddleware,toggleMultiProfile )
userRouter.post(
  "/create-profile",
  upload.single("file"),
  authMiddleware,
  createProfile
);
userRouter.delete("/delete-profile/:profileId", authMiddleware, deleteProfile);
userRouter.put("/switch-profile", authMiddleware, switchProfile);

export default userRouter;
