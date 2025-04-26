// controllers/auth.controller.js
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next route handler
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Register new user
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber } = req.body;

    if (!fullName || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({
        message: "Required All Fields",
        success: false,
      });
    }

    let profilePhotoUrl = null;
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        profilePhoto: newUser.profile.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// Login user and return JWT token
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: `Welcome back ${user.fullName}`,
      success: true,
      token, // Send JWT token in the response
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profile.profilePhoto,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let cloudResponse = null;

    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
      });
    }

    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",").map((s) => s.trim());
    }

    const userId = req.user.userId; // Get userId from JWT token
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (email) {
      user.email = email;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (bio) {
      user.profile.bio = bio;
    }

    if (skills) {
      user.profile.skills = skillsArray;
    }
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

