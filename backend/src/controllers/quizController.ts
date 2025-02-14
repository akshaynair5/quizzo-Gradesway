import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Transaction } from "sequelize";
import Option from "../models/Option";
import Question from "../models/Question";
import Quiz from "../models/Quiz";

export const createQuiz = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, teacher_id, questions } = req.body;
  console.log(req.body);
  const transaction: Transaction | undefined = await Quiz.sequelize?.transaction();

  try {
    const quiz = await Quiz.create({ title, description, teacher_id }, { transaction });

    for (const question of questions) {
      const newQuestion = await Question.create(
        { quiz_id: quiz.id, question_text: question.text },
        { transaction }
      );

      for (const option of question.options) {
        await Option.create(
          { question_id: newQuestion.id, option_text: option.text, is_correct: option.isCorrect },
          { transaction }
        );
      }
    }

    await transaction?.commit();
    res.status(201).json({ message: "Quiz created successfully!", quiz });
  } catch (error) {
    await transaction?.rollback();
    console.log(error);
    next(error);
  }
});

export const getQuizzes = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quizzes = await Quiz.findAll({
      include: [{ model: Question, as: "questions", include: [{ model: Option, as: "options" }] }],
    });

    res.json(quizzes.length > 0 ? quizzes : { message: "No quizzes found" });
  } catch (error) {
    next(error);
  }
});

export const getQuizById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{ model: Question, as: "questions", include: [{ model: Option, as: "options" }] }],
    });

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, questions } = req.body;
  const transaction: Transaction | undefined = await Quiz.sequelize?.transaction();

  try {
    const quiz = await Quiz.findByPk(req.params.id, { transaction });

    if (!quiz) {
      await transaction?.rollback();
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    await quiz.update({ title, description }, { transaction });

    const existingQuestions = await Question.findAll({ where: { quiz_id: quiz.id }, transaction });

    const updatedQuestionIds = new Set(questions.map(q => q.id).filter(id => id));

    for (const question of questions) {
      let existingQuestion = existingQuestions.find(q => q.id === question.id);

      if (existingQuestion) {

        if (existingQuestion.question_text !== question.text) {
          await existingQuestion.update({ question_text: question.text }, { transaction });
        }
      } else {

        existingQuestion = await Question.create(
          { quiz_id: quiz.id, question_text: question.text },
          { transaction }
        );
      }

      const existingOptions = await Option.findAll({ where: { question_id: existingQuestion.id }, transaction });

      const updatedOptionIds = new Set(question.options.map(o => o.id).filter(id => id));

      for (const option of question.options) {
        let existingOption = existingOptions.find(o => o.id === option.id);

        if (existingOption) {
          if (existingOption.option_text !== option.text || existingOption.is_correct !== option.isCorrect) {
            await existingOption.update(
              { option_text: option.text, is_correct: option.isCorrect },
              { transaction }
            );
          }
        } else {

          await Option.create(
            { question_id: existingQuestion.id, option_text: option.text, is_correct: option.isCorrect },
            { transaction }
          );
        }
      }

      for (const existingOption of existingOptions) {
        if (!updatedOptionIds.has(existingOption.id)) {
          await existingOption.destroy({ transaction });
        }
      }
    }

    for (const existingQuestion of existingQuestions) {
      if (!updatedQuestionIds.has(existingQuestion.id)) {
        await existingQuestion.destroy({ transaction });
      }
    }

    await transaction?.commit();
    res.json({ message: "Quiz updated successfully!", quiz });
  } catch (error) {
    await transaction?.rollback();
    next(error);
  }
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    await quiz.destroy();
    res.json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    next(error);
  }
});
