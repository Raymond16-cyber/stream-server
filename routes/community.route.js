import express from "express";
import {
  createCommunity,
  getMyCommunities,
} from "../controller/community/community.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../config/multerConfig.js";

const communityRouter = express.Router();

communityRouter.post(
  "/create",
  authMiddleware,
  upload.single("file"), // 👈 MUST be here
  createCommunity
);
communityRouter.get(
  "/my-communities",
  authMiddleware,
  getMyCommunities
);

export default communityRouter;
