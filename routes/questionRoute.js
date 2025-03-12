import express from "express";
const router = express.Router();
import authMiddleware from "../Middlewares/authMiddleware.js";

import {
  getQuestionById,
  allQuestions,
  postQuestion,
} from "../controllers/questionController.js";

router.get("/all-questions", authMiddleware, allQuestions);
router.post("/post", authMiddleware, postQuestion);
router.get("/getQuestionById/:id", authMiddleware, getQuestionById);
export default router;
