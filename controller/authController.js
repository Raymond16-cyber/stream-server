import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  // create verification token
  const token = jwt.sign(
    {
      id: newUser._id,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
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
  
  console.log("Login ",isExisting);
  // user doesn't exist
  if (!isExisting) {
    return res.status(400).json({ error: "Couldn't find an account with this email" });
  }
  
  // wrong password
  const isPasswordMatch = await bcrypt.compare(password, isExisting.password);

  if (!isPasswordMatch) {
    console.log("Invalid email or password");
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // create token
  const token = jwt.sign(
    {
      _id: isExisting._id,
      id: isExisting._id,
      name: isExisting.name,
      email: isExisting.email,
      image: isExisting.image || "",
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

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({
      message: "User logged in successfully",
      token,
    });
});

export const loadUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User loaded successfully");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Unable to load user" });
  }
});