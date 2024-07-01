import { User } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
// user register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, companyName, phoneNumber, location, companyWebsite, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.json({ message: "User Already exists", success: false });
    const hashPass = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashPass, companyName, phoneNumber, location, companyWebsite, role });
    res.json({
      message: "User registered successfully...!",
      user,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// user login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.json({ message: "User Not Found", success: false });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.json({ message: "Invalid Credential", success: false });

    const token = jwt.sign({ userId: user._id }, "!@#$%^&*()", {
      expiresIn: '365d'
    });

    res.json({ message: `Welcome ${user.name}`, token, success: true,role:user.role });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// get All users
export const users = async (req, res) => {
  try {
    let users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get profile
export const profile = async (req, res) => {
  res.json({ user: req.user });
};

// edit profile
export const editProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, companyName, phoneNumber, location, companyWebsite } = req.body;
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.json({ message: "User Not Found", success: false });

    user.name = name || user.name;
    user.companyName = companyName || user.companyName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.location = location || user.location;
    user.companyWebsite = companyWebsite || user.companyWebsite;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.json({ message: error.message });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    // Perform the deletion
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Forgot Password - Send Reset Link
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

   
    const token = jwt.sign({ id: user._id }, "!@#$%^&*()", { expiresIn: '1h' });

   
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const resetLink = `${process.env.BASE_URL}/reset_password/${user._id}/${token}`;
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Reset Password Link',
      text: `Hello!\n\nYou have requested a password reset for your account.\n\nClick the following link to reset your password:\n\n${resetLink}\n\nPlease note:\n- Do not share this link with anyone.\n\nIf you did not request this, please ignore this email.\n\nThank you and best regards,\nOpinio Buzz Support Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending reset email:', error);
        return res.status(500).json({ message: "Failed to send reset link", success: false });
      }
      console.log('Reset email sent:', info.response);
      res.json({ message: "Reset link successfully sent. Please check your email.", success: true });
    });

  } catch (error) {
    console.log('Error in forgotPassword:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;
  const { newPassword } = req.body;

  try {
  
    const decoded = jwt.verify(token, "!@#$%^&*()");
    if (decoded.id !== userId) {
      return res.status(400).json({ message: "Invalid token", success: false });
    }

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

   
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required", success: false });
    }

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful", success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};