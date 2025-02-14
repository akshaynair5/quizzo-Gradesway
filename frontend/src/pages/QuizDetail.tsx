import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizzes } from "../api/quiz";
import { Button } from "../components/ui/button";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const quizzes = await getQuizzes();
      const foundQuiz = quizzes.find((q: any) => q.id.toString() === id);
      setQuiz(foundQuiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>;
  if (!quiz) return <p className="text-center text-red-500 dark:text-red-400">Quiz not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{quiz?.title}</h2>
      <p className="text-gray-700 dark:text-gray-400">{quiz?.description}</p>

      <h3 className="text-lg font-bold mt-4 text-gray-900 dark:text-gray-200">Questions</h3>
      <div className="space-y-4 mt-2">
        {quiz?.questions?.map((q: any, qIndex: number) => (
          <div key={qIndex} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">{qIndex + 1}. {q?.question_text}</h4>
            <ul className="list-disc ml-5">
              {q?.options?.map((opt: any, oIndex: number) => (
                <li key={oIndex} className={`text-gray-700 dark:text-gray-300 ${opt.is_correct ? "font-bold text-green-600 dark:text-green-400" : ""}`}>
                  {opt.option_text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuizDetail;
