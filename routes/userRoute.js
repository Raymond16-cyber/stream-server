import express from "express";
import {
  createProfile,
  deleteProfile,
  editName,
  editProfilePicture,
} from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../config/multerConfig.js";

const userRouter = express.Router();

userRouter.put("/edit-name", authMiddleware, editName);
userRouter.put(
  "/edit-profile-picture",
  upload.single("file"),
  authMiddleware,
  editProfilePicture
);
userRouter.post(
  "/create-profile",
  upload.single("file"),
  authMiddleware,
  createProfile
);
userRouter.delete("/delete-profile/:profileId", authMiddleware, deleteProfile);

export default userRouter;
