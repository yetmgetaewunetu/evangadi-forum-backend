import mongoose from "mongoose";

const connect_db = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Connection Successful!, host: ", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
};

export default connect_db;
