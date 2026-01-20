import Community from "../model/Community.model.js";
import Message from "../model/Message.model.js";
import User from "../model/User.js";
import  uploadImageToCloudinary from "../utils/cloudinaryImageUploader.js";

export const createCommunity = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { name, description, category, image } = req.body;
  
  if (!name || !description || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let imageUrl = "";
    
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }
    
    const newCommunity = new Community({
      name,
      description,
      category,
      createdBy: userId,
      members: [userId],
      memberCount: 1,
      image: imageUrl || "",
      messages  : [],
      isJoined: true,
    });
    await newCommunity.save();
    res
      .status(201)
      .json({
        message: "Community created successfully",
        community: newCommunity,
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const getMyCommunities = async (req, res) => {
  const userId = req.user.id || req.user._id;
    try {
        const communities = await Community.find({ members: { $in: [userId] } })
          .populate('messages'); // Populate message details
        res.status(200).json({ communities: communities });
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const sendCommunityMessgaes = async(req,res)=>{
const userId = req.user.id || req.user._id;
const {message}=req.body;
const {communityId,senderId,}=message;

if(!communityId || !senderId){
  return res.status(400).json({error:"All fields are required"});
}
try{
  const community = await Community.findById(communityId);
  if(!community){
    return res.status(404).json({error:"Community not found"});
  }

  const user = await User.findById(senderId);
  if(!user){
    return res.status(404).json({error:"User not found"});
  }

  const updatedMessage = {
    communityId:communityId,
    senderImage:user.image || "",
    senderName:user.name.split(' ')[0],
    senderId,
    content:message.text,
    isSystem:false,
    readBy:[],
  }
 const newMessage = await Message.create(updatedMessage);
 newMessage.readBy.push(senderId);
  await newMessage.save();

 community.messages.push(newMessage._id);
 community.lastMessage = {
    content: newMessage.content,
    senderName: newMessage.senderName,
    senderImage: newMessage.senderImage,
 }
 community.lastMessageSender = user._id.toString();
 community.lastMessageTime = new Date();
 await community.save();
  res.status(200).json({message:"Message sent successfully",messageDetails:newMessage});
} catch (error) {
  res.status(500).json({ error: "Server error" });
}}

export const readCommunityMessages = async(req,res)=>{
  try {
    const user = req.user.id || req.user._id;
    const {communityId, userId} = req.body;
    console.log("Marking messages as read for:", communityId, userId);

    if(!communityId || !userId){
      return res.status(400).json({error:"All fields are required"});
    }

    const community = await Community.findById(communityId);
    if(!community){
      return res.status(404).json({error:"Community not found"});
    }

    // Find all unread messages for this user
    const messages = await Message.find({
      communityId: communityId,
      readBy: {$ne: userId}
    });
    
    console.log("Found unread messages:", messages.length);

    // Mark all as read
    for(const message of messages){
      if(!message.readBy.includes(userId)){
        message.readBy.push(userId);
        await message.save();
      }
    }

    res.status(200).json({message: "Messages marked as read"});
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({error: "Server error"});
  }
}

export const getCommunityMessages = async(req,res)=>{
  try {
    const userId = req.user.id || req.user._id;
    const communityId = req.params.communityId;

    if(!communityId){
      return res.status(400).json({error:"Unable to fetch messages"});
    }
    
    const messages = await Message.find({communityId: communityId}).sort({ createdAt: 1 });
    console.log("Fetched messages for community:", messages.length);
    res.status(200).json({messages:messages});
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({error: "Server error"});
  }
}

export const fetcLastCommunityMessage = async(req,res)=>{
  const communityId = req.params.communityId;
  const community = await Community.findById(communityId);
  if(!community){
    return res.status(404).json({error:"Community not found"});
  }
  res.status(200).json({lastMessage:community.lastMessage});
}