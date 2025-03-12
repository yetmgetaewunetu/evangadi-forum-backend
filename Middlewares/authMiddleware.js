import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log("token: ", token); // Debugging the token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decoded", decoded);
    const user = await User.findById(decoded.userId).select("-password"); // Updated to `decoded.id`
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkAuth;
