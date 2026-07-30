import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const isExist = await User.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "Email Already Exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate Confirmation Token
    const confirmToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send Confirmation Email
    await sendEmail({
      to: user.email,
      subject: "Confirm Your Email",
      html: `
        <h2>Welcome ${user.name}</h2>
        <p>Click the button below to confirm your email.</p>

        <a href="http://localhost:3000/auth/confirm/${confirmToken}">
          Confirm Email
        </a>
      `,
    });

    res.status(201).json({
      message: "Registration successful. Please check your email to confirm your account.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Email Or Password",
      });
    }

    // Check Email Confirmation
    if (!user.isConfirmed) {
      return res.status(403).json({
        message: "Please confirm your email first",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid Email Or Password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    // Hash Token
    const hashedToken = await bcrypt.hash(token, 10);

    // Save Hashed Token
    user.token = hashedToken;

    await user.save();

    res.status(200).json({
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify Token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find User
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Check if already confirmed
    if (user.isConfirmed) {
      return res.status(400).json({
        message: "Email Already Confirmed",
      });
    }

    // Confirm Email
    user.isConfirmed = true;

    await user.save();

    res.status(200).json({
      message: "Email Confirmed Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};