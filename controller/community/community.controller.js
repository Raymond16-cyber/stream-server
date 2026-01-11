import Community from "../../model/Community.model.js";
import User from "../../model/User.js";
import  uploadImageToCloudinary from "../../utils/cloudinaryImageUploader.js";

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
        res.status(200).json({ communities });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};