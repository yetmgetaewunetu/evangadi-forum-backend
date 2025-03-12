import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import tokenGenerator from "../lib/utils.js";
import User from "../models/userModel.js";

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (user) {
      return res.status(StatusCodes.OK).json(user);
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  } catch (error) {
    console.log("Error at get user: ", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
}

async function register(req, res) {
  try {
    constconst;
    const { username, email, password, firstName, lastName } = req.body;
    console.log("user model: ", User);

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();
    // tokenGenerator(newUser._id, res); // Optional: Uncomment if you want to generate a token after registration

    return res.status(StatusCodes.CREATED).json({
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  } catch (error) {
    console.log("Error at register user: ", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error!" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email doesn't exist!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials!" });
    }

    tokenGenerator(user._id, res); // Generate and send token

    return res.status(StatusCodes.OK).json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.log("Error at login user: ", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error!" });
  }
}

async function checkUser(req, res) {
  try {
    if (req.user) {
      return res.status(StatusCodes.OK).json(req.user);
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error at check user: ", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error!" });
  }
}
const logout = (req, res) => {
  try {
    console.log("logging out");
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login, checkUser, getUser, logout };
