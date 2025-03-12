import Question from "../models/questionModel.js";
import User from "../models/userModel.js"; // Assuming you have the User model
import { StatusCodes } from "http-status-codes";

const randomNum = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const postQuestion = async (req, res) => {
  const userId = req.user._id;
  const { title, description, tag } = req.body;
  console.log(req.body);
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all details properly!" });
  }

  try {
    const newQuestion = await Question.create({
      userId,
      title,
      description,
      tag,
    });

    return res.status(StatusCodes.CREATED).json({
      newQuestion,
    });
  } catch (error) {
    console.log("Error at post Question: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    const { userId, title, description, tag } = question;
    // Fetching the username of the user
    const user = await User.findById(userId);
    const username = user ? user.username : "Unknown";

    return res.status(StatusCodes.OK).json({
      userId,
      username,
      title,
      description,
      tag,
    });
  } catch (error) {
    console.log("Error at get Question by id: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const allQuestions = async (req, res) => {
  try {
    const data = await Question.find();

    return res.status(StatusCodes.OK).json({
      data,
    });
  } catch (error) {
    console.log("Error at get all Questions: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
