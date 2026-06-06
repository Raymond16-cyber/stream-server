import express from "express";
import { sendCustomerCareMessage } from "../controller/customer.care.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const customerCareRouter = express.Router();

customerCareRouter.post("/send-message",authMiddleware, sendCustomerCareMessage);


export default customerCareRouter;
