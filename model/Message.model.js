import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        communityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true,
        },
        senderImage: {
            type: String,
            required: true,
            trim: true,
        },
        senderName: {
            type: String,
            required: true,
            trim: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isSystem: {
            type: Boolean,
            default: false,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],      
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;