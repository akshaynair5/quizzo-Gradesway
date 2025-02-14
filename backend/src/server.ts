import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/", quizRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
