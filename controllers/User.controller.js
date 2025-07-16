import User from "../models/User.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import transporter from "../utils/mail.js";
import sendVerificationMail from "../utils/mail.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();
   
    // send mail
    sendVerificationMail(user,token)

  

    res.status(201).json({
      message: "User registerd succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Error while registering",
      error: error.message,
      success: false,
    });
  }
};
export const verifyUser = async (req, res) => {
  const token = req.params.token.trim()
  
  console.log(token);

  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const user = await User.findOne({ verificationToken: token });
  console.log(user);

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.status(200).json({
    success:true,
    message: "email verified succesfully"
  })
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  // bhai always remember db is in other continent
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Please register first",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },

      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in get me", error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {}
};
