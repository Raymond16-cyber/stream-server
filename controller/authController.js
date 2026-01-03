import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Profile from "../model/Profile.js";

export const authRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check if email exists
  const isExisting = await User.findOne({ email: email });
  // if existing user
  if (isExisting) {
    console.log("User already exists");
    res.status(400).json({ error: "User with this email already exists" });
  }
  // assign salt
  const salt = await bcrypt.genSalt(10);
  // hash password
  const hashedPassword = await bcrypt.hash(password, salt);
  // create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  // create user profiles
  const mainProfile = await Profile.create({
    name: newUser.name,
    image: "",
    localImage: "",
    isKid: false,
    isMain: true,
    user: newUser._id,
  });
  // cretae kids profile
  const kidsProfile = await Profile.create({
    name: "Kids",
    image: "",
    localImage: "",
    isKid: true,
    isMain: false,
    user: newUser._id,
  });
  newUser.currentProfile = mainProfile._id;
  // associate profile with user
  newUser.profiles.push(mainProfile._id);
  newUser.profiles.push(kidsProfile._id);
  await newUser.save();

  // create verification token
  const token = jwt.sign(
    {
      id: newUser._id,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profiles: newUser.profiles,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  newUser.verificationToken = token;
  await newUser.save();

  console.log("User registered successfully");

  res.status(201).json({
    success: true,
    message: "User registered successfully,Heading to veriy email page",
    url: "/verify-email?token=" + token,
  });
});

export const authLogin = asyncHandler(async (req, res) => {
  console.log("Login request received");
  const { email, password } = req.body;

  const isExisting = await User.findOne({ email }).select("+password");

  console.log("Login ", isExisting);
  // user doesn't exist
  if (!isExisting) {
    return res
      .status(400)
      .json({ error: "Couldn't find an account with this email" });
  }

  // wrong password
  const isPasswordMatch = await bcrypt.compare(password, isExisting.password);

  if (!isPasswordMatch) {
    console.log("Invalid email or password");
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const profiles = await Profile.find({ user: isExisting._id });
  const currentProfile = await Profile.findById(isExisting.currentProfile.toString());
  // create token
  const token = jwt.sign(
    {
      _id: isExisting._id,
      id: isExisting._id,
      name: isExisting.name,
      email: isExisting.email,
      image: isExisting.image || "",
      securityPin: isExisting.securityPin || "",
      currentProfile: currentProfile || "",
      profiles: profiles,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  console.log("User logged in successfully");

  return res.status(200).cookie("token", token, cookieOptions).json({
    message: "User logged in successfully",
    token,
  });
});

export const loadUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("profiles");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    
    const currentProfile = await Profile.findById(user.currentProfile.toString());
    // create token
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Unable to load user" });
  }
});

export const createSecurityPin = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { securityPin } = req.body;
    const user = await User.findById(userId).populate("profiles");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    user.securityPin = securityPin;
    await user.save();
    console.log(user);
    const currentProfile = await Profile.findById(user.currentProfile.toString());
    // create token
    const token = jwt.sign(
      {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        securityPin: user.securityPin || "",
        currentProfile: currentProfile || "",
        profiles: user.profiles || [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Security PIN created successfully");
    res
      .status(200)
      .json({ message: "Security PIN created successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Unable to create security PIN" });
  }
});


export const authDestroyAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    const result = await sendMail(user.email)
  }catch{}
})