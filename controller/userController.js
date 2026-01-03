import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import uploadImageToCloudinary from "../utils/cloudinaryImageUploader.js";
import Profile from "../model/Profile.js";

export const editName = asyncHandler(async (req, res) => {
  console.log("editing name");

  const { name } = req.body;
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true })
      .populate("profiles")
      .populate("currentProfile");
    if (!user) {
      console.log("unable to find user");

      return res.status(404).json({ error: "User not found" });
    }
    console.log("user's name updated successfully", user);
    // assign token after name update
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: user.currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Name updated successfully", user, token });
  } catch (error) {
    res.status(500).json({ error: "Unable to update name" });
  }
});

export const editProfilePicture = asyncHandler(async (req, res) => {
  console.log("Received file for profile picture update:", req.file);
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const imageUrl = await uploadImageToCloudinary(
      file.buffer,
      file.originalname,
      file.mimetype
    );
    const userId = req.user.id || req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    )
      .populate("profiles")
      .populate("currentProfile");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // assign token after name update
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: user.currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ message: "Profile picture updated successfully", user, token });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Unable to update profile picture" });
  }
});

// create profile controller
export const createProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id || req.user._id;

  let imageUrl = "";

  if (req.file) {
    imageUrl = await uploadImageToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
  }

  const profile = await Profile.create({
    name,
    image: imageUrl,
    isKid: false,
    isMain: false,
    user: userId,
  });

  const user = await User.findById(userId)
    .populate("profiles")
    .populate("currentProfile");
  user.profiles.push(profile._id);
  await user.save();

  const token = jwt.sign(
    {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image || "",
      securityPin: user.securityPin || "",
      currentProfile: user.currentProfile || "",
      profiles: user.profiles || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.status(201).json({
    message: "Profile created successfully",
    profile,
    profiles: user.profiles,
    token,
  });
});

export const deleteProfile = asyncHandler(async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).populate("profiles").populate("currentProfile");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const profileIndex = user.profiles.findIndex(
      (p) => p._id.toString() === profileId
    );
    if (profileIndex === -1) {
      return res.status(404).json({ error: "Profile not found" });
    }
    user.profiles.splice(profileIndex, 1);
    await user.save();
    await Profile.findByIdAndDelete(profileId);
    // create token after profile deletion
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: user.currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Profile deleted successfully:", profileId);
    res.status(200).json({
      message: "Profile deleted successfully",
      profiles: user.profiles,
      profileId,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete profile" });
  }
});
