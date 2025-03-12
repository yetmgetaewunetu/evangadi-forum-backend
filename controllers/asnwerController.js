import Answer from "../models/answerModel.js";
import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";

export const getAnswerById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Answer.find({ questionId: id });
    return res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const postAnswer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { answer } = req.body;
  const isValidUser = await User.findOne({ _id: userId });

  if (!isValidUser)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User not found!",
    });

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide an answer first!",
    });
  }

  if (answer.length <= 10) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({
      message: "The answer provided is too short!",
    });
  }

  try {
    const newAnswer = await Answer.create({
      userId,
      questionId: id,
      answer,
    });

    return res.status(StatusCodes.CREATED).json({
      newAnswer,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const deleteAnswer = async (req, res) => {
  const { id } = req.params;
  try {
    const isOwner = await Answer.findOne({ _id: id, userId: req.user._id });
    if (!isOwner) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "You are not authorized to delete this answer!",
      });
    }

    const deletedAnswer = await Answer.findByIdAndDelete(id);
    if (!deletedAnswer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No answer with specified ID!",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully!",
      data: deletedAnswer,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
