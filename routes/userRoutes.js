import express from "express";
const router = express.Router();

// importing the user controllers

import {
  register,
  login,
  checkUser,
  getUser,
  logout,
} from "../controllers/userController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/getUser/:id", authMiddleware, getUser);
router.get("/check", authMiddleware, checkUser);
router.get("/logout", authMiddleware, logout);
export default router;
