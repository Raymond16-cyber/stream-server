import express from "express";
import {
  createCommunity,
  fetcLastCommunityMessage,
  getCommunityMessages,
  getMyCommunities,
  readCommunityMessages,
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
communityRouter.post(
  "/read-messages",
  authMiddleware,
  readCommunityMessages
);
communityRouter.get(
  "/get-messages/:communityId",
  authMiddleware,
  getCommunityMessages
);
communityRouter.get(
  "/get-last-message/:communityId",
  authMiddleware,
  fetcLastCommunityMessage
);

export default communityRouter;
