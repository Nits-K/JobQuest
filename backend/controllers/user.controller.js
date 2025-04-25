import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req, res) => {
  try {
      const { fullname, email, password, role, phoneNumber } = req.body;

      console.log(fullname, email, password, role);

      if (!fullname || !email || !password || !role || !phoneNumber) {
          return res.status(400).json({
              message: "Required All Fileds",
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
              message: 'User already exists with this email.',
              success: false,
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
          fullname,
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
              fullname: newUser.fullname,
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
          false: error
      });
  }
};
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
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure:true,
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "auto",
    });
    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",").map((s) => s.trim());
    }
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    console.log("File Info:", req.file);
    console.log("Data URI:", fileUri.content);
    console.log("Cloudinary Response:", cloudResponse);

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
      message: "profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
