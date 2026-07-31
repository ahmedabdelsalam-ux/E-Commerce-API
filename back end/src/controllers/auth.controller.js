import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, rePassword, phone } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "Email Already Exists",
      });
    }

    if (password !== rePassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const confirmToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

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
      message: "success",
      data: "Registration successful. Please check your email to confirm your account.",
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Email Or Password",
      });
    }

    if (!user.isConfirmed) {
      return res.status(403).json({
        message: "Please confirm your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid Email Or Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const hashedToken = await bcrypt.hash(token, 10);

    user.token = hashedToken;

    await user.save();

    res.status(200).json({
      message: "success",
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

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    if (user.isConfirmed) {
      return res.status(400).json({
        message: "Email Already Confirmed",
      });
    }

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
