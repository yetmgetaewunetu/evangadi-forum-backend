import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnection from "./models/userModel.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoute from "./routes/questionRoute.js";
import answerRoute from "./routes/answerRoute.js";
import authMiddleware from "./Middlewares/authMiddleware.js";
import connect_db from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = 5500;

app.use(cookieParser());
// CORS setup
app.use(
  cors({
    origin: [
      "https://evangadi-forum-frontend-page.onrender.com/",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.options("*", cors());

// Middleware to parse incoming JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to our backend server!");
});

// User and other routes
app.use("/api/users", userRoutes);
app.use("/api/questions", authMiddleware, questionRoute);
app.use("/api/answers", authMiddleware, answerRoute);

// Connect to the database and start the server
connect_db()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error);
    process.exit(1);
  });
