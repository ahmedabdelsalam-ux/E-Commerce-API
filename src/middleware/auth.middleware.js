import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const isValidToken = await bcrypt.compare(token, user.token);

    if (!isValidToken) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    req.user = user;

    next();

  }catch (error) {
  console.log(error);

  return res.status(500).json({
    message: error.message,
  });
}
};

export default auth;