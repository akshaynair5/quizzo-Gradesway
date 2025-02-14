import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
class Quiz extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public teacher_id!: number;
}

Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Quiz",
    tableName: "quizzes",
    timestamps: true,
  }
);

export default Quiz;
