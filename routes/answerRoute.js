import express from "express";
const router = express.Router();
import authMiddleware from "../Middlewares/authMiddleware.js";

import {
  getAnswerById,
  postAnswer,
  deleteAnswer,
} from "../controllers/asnwerController.js";

router.get("/answer/:id", authMiddleware, getAnswerById);
router.post("/post/:id", authMiddleware, postAnswer);
router.delete("/delete/:id", authMiddleware, deleteAnswer);

export default router;
