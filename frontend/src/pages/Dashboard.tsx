import { useEffect, useState } from "react";
import { getQuizzes, deleteQuiz } from "../api/quiz";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const data = await getQuizzes();
    if(data.length > 0) {
      setQuizzes(data);
    }
    else{
      setQuizzes([]);
    }
    setQuizzes(data);
  };

  const handleDelete = async (id: string) => {
    await deleteQuiz(id);
    fetchQuizzes();
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Quizzes</h2>
      <div className="flex justify-end mt-4">
        <Button onClick={() => navigate("/create-quiz")} className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400">
          Create Quiz
        </Button>
      </div>

      <ul className="mt-6 space-y-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz: any) => (
            <li key={quiz.id} className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => navigate(`/quiz/${quiz.id}`)} className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400">
                  View
                </Button>
                <Button onClick={() => navigate("/create-quiz", { state: { quiz } })} className="bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-400">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(quiz.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No quizzes found.</p>
        )}
      </ul>
    </div>
  </div>
  );
};

export default Dashboard;
