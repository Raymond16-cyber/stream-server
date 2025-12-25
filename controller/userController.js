import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

export const editName = asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
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
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

    res.status(200).json({ message: "Name updated successfully", user, token });
  } catch (error) {
    res.status(500).json({ error: "Unable to update name" });
  }
});
