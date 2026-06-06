import mongoose from "mongoose"

const customerMessageSchema = new mongoose.Schema(
    {
        customerEmail: {
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
        isRead:{
            type: Boolean,
            default: false,
        },
        isAdmin:{
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)       
const CustomerMessage = mongoose.model("CustomerMessage", customerMessageSchema);

export default CustomerMessage;
