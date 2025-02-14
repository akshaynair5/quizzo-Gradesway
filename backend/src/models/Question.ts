import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Quiz from "./Quiz";

class Question extends Model {
  public id!: number;
  public quiz_id!: number;
  public question_text!: string;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: false,
  }
);

Quiz.hasMany(Question, { foreignKey: "quiz_id", as: "questions" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id", as: "quiz" });

export default Question;
