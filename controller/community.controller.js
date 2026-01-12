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
    console.log("New Community Created:", newCommunity);
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
        const communities = await Community.find({ members: { $in: [userId] } });
        console.log(communities);
        res.status(200).json({ communities: communities });
    } catch (error) {
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

  const user = await User.findById(userId);
  const updatedMessage = {
    communityId:communityId,
    senderName:user.name.split(' ')[0],
    senderId:userId,
    content:message.text,
    isSystem:false,
    readBy:[],
  }
 const newMessage = await Message.create(updatedMessage);
 community.messages.push(newMessage._id);
 community.lastMessage = newMessage.text
 community.lastMessageTime = new Date();
 await community.save();
  console.log("Message sent to community:",updatedMessage,newMessage);
  res.status(200).json({message:"Message sent successfully",messageDetails:updatedMessage});
} catch (error) {
  res.status(500).json({ error: "Server error" });
}}

export const getCommunityMessages = async(req,res)=>{

const userId = req.user.id || req.user._id;
const communityId = req.params.communityId;

if(!communityId){
  return res.status(400).json({error:"Unable to fetch messages"});
}
const messages = await Message.find({communityId: communityId})
console.log("Fetched messages for community:",messages);
res.status(200).json({messages:messages});

}