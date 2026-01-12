import express from "express";
import {
  createCommunity,
  getCommunityMessages,
  getMyCommunities,
  sendCommunityMessgaes,
} from "../controller/community.controller.js";
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
communityRouter.post(
  "/send-message",
  authMiddleware,
  sendCommunityMessgaes
);
communityRouter.get(
  "/get-messages/:communityId",
  authMiddleware,
  getCommunityMessages
);

export default communityRouter;
