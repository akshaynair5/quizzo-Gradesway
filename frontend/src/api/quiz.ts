import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/quizzes`;

export const getQuizzes = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching quizzes:", error.response?.data || error.message);
    return { error: "Failed to fetch quizzes. Please try again later." };
  }
};

export const createQuiz = async (quizData: {
  title: string;
  description: string;
  teacher_id: number;
  questions: { 
    question_text: string;
    options: { option_text: string; is_correct: boolean }[];
  }[];
}) => {
  try {
    const res = await axios.post(API_URL, quizData);
    return res.data;
  } catch (error: any) {
    console.error("Error creating quiz:", error.response?.data || error.message);
    return { error: "Failed to create quiz. Please try again later." };
  }
};

export const updateQuiz = async (id: string, quizData: {
  title: string;
  description: string;
  questions: { 
    id?: number; 
    question_text: string;
    options: { id?: number; option_text: string; is_correct: boolean }[];
  }[];
}) => {
  try {
    const res = await axios.patch(`${API_URL}/${id}`, quizData);
    return res.data;
  } catch (error: any) {
    console.error("Error updating quiz:", error.response?.data || error.message);
    return { error: "Failed to update quiz. Please try again later." };
  }
};

export const deleteQuiz = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting quiz:", error.response?.data || error.message);
    return { error: "Failed to delete quiz. Please try again later." };
  }
};
