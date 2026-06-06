import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import CustomerMessage from "../model/CustomerMessage.model.js";


export const sendCustomerCareMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // PREMIUM USERS
    if (user.isPremium) {
        if (user.careLimit !== 100) {
            user.careLimit = 100;
        }
    }

    // NON-PREMIUM USERS
    if (!user.isPremium && user.careLimit <= 0) {
        return res.status(403).json({
            message: "You have reached your customer care message limit. Upgrade your plan.",
        });
    }

    // Decrease limit AFTER validation
    user.careLimit -= 1;
    await user.save();

    const CCMessage = new CustomerMessage({
        customerEmail: user.email,
        senderName: user.name,
        senderId: user._id,
        content: message,
        isAdmin: false,
        isRead: false,
    });

    await CCMessage.save();

    res.status(201).json({
        message: "Customer care message sent successfully",
        data: CCMessage,
        remainingLimit: user.careLimit,
    });
});
