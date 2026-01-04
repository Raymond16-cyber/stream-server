import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import uploadImageToCloudinary from "../utils/cloudinaryImageUploader.js";
import Profile from "../model/Profile.js";

export const editUserDetails = asyncHandler(async (req, res) => {
  console.log("Editing user details...");

  const { name } = req.body;
  const userId = req.user.id || req.user._id;

  let imageUrl;

  if (req.file) {
    imageUrl = await uploadImageToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
  }

  const updateData = {
    ...(name && { name }),
    ...(imageUrl && { image: imageUrl }),
  };

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  })
    .populate("profiles")
    .populate("currentProfile");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let profile = user.currentProfile;

  if (user.currentProfile) {
    profile = await Profile.findByIdAndUpdate(
      user.currentProfile._id,
      updateData,
      { new: true }
    );
  }

  // ✅ regenerate token (as requested)
  const token = jwt.sign(
    {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image || "",
      securityPin: user.securityPin || "",
      currentProfile: profile,
      profiles: user.profiles || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "User details updated successfully",
    user,
    profile,
    token,
  });
});

export const toggleMultiProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isMultiProfileEnabled = !user.isMultiProfileEnabled;
    await user.save();
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        isMultiProfileEnabled: user.isMultiProfileEnabled,
        currentProfile: user.currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Multi-profile setting toggled to", user.isMultiProfileEnabled);

    res.status(200).json({
      message: "Multi-profile setting updated successfully",
      isMultiProfileEnabled: user.isMultiProfileEnabled,token,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to toggle multi-profile setting" });
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
    const user = await User.findById(userId)
      .populate("profiles")
      .populate("currentProfile");
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

export const switchProfile = asyncHandler(async (req, res) => {
  try {
    console.log("Switching profile...", req.query, req.body);
    const { profileId } = req.body;
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId)
      .populate("profiles")
      .populate("currentProfile");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    user.currentProfile = profile._id;
    await user.save();
    // create token after switching profile
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: profile,
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Switched to profile successfully:", profileId);
    res.status(200).json({
      message: "Switched to profile successfully",
      currentProfile: profile,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to switch profile" });
  }
});
