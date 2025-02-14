import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Question from "./Question";

class Option extends Model {
  public id!: number;
  public question_id!: number;
  public option_text!: string;
  public is_correct!: boolean;
}

Option.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_correct: {  
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  },
  {
    sequelize,
    modelName: "Option",
    tableName: "options",
    timestamps: false,
  }
);

Question.hasMany(Option, { foreignKey: "question_id", as: "options" });
Option.belongsTo(Question, { foreignKey: "question_id", as: "question" });

export default Option;
