import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
