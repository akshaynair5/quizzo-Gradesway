import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createQuiz, updateQuiz } from "../api/quiz";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import RadioGroup from "../components/ui/RadioGroup";
import Radio from "../components/ui/Radio";
import { AuthContext } from "../context/AuthContext";

const QuizForm = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const quizToEdit = location.state?.quiz || null;

  const [title, setTitle] = useState(quizToEdit ? quizToEdit.title : "");
  const [description, setDescription] = useState(quizToEdit ? quizToEdit.description : "");
  const [questions, setQuestions] = useState(
    quizToEdit
      ? quizToEdit.questions.map((q: any) => ({
          id: q.id, 
          text: q.question_text,
          options: q.options.map((o: any) => ({
            id: o.id,  
            text: o.option_text,
            isCorrect: o.is_correct,
          })),
        }))
      : [{ id: undefined, text: "", options: [{ id: undefined, text: "", isCorrect: false }] }]
  );

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: undefined, text: "", options: [{ id: undefined, text: "", isCorrect: false }] }]);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ id: undefined, text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeQuestion = (qIndex: number) => {
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length === 1) {
      alert("Each question must have at least one option.");
      return;
    }

    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== oIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("User not logged in!");
      return;
    }

    const quizData = {
      title,
      description,
      teacher_id: currentUser.id,
      questions: questions.map((q) => ({
        id: q.id,  
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id, 
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    };

    try {
      if (quizToEdit) {
        await updateQuiz(quizToEdit.id, quizData);
      } else {
        await createQuiz(quizData);
      }
      navigate("/dashboard");
    } catch (error) {
      alert("Error submitting quiz!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{quizToEdit ? "Edit Quiz" : "Create Quiz"}</h2>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <Input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="dark:bg-gray-800 dark:text-white"
        />
        <Textarea
          placeholder="Quiz Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="dark:bg-gray-800 dark:text-white"
        />

        <h3 className="text-lg font-bold mt-4 text-gray-900 dark:text-gray-200">Questions</h3>
        <div className="space-y-4">
          {questions.map((q : any, qIndex : any) => (
            <div key={qIndex} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Input
                  type="text"
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white"
                />
                <Button type="button" className="bg-red-600 dark:bg-red-500 text-white m-2" onClick={() => removeQuestion(qIndex)}>Remove</Button>
              </div>

              <h4 className="text-md font-semibold mt-2 text-gray-900 dark:text-gray-200">Options</h4>
              <RadioGroup>
                {q.options.map((opt : any, oIndex : any) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <Radio
                      name={`correctOption-${qIndex}-${oIndex}`}
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                    />
                    <Input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:text-white"
                    />
                    <Button type="button" className="bg-red-600 dark:bg-red-500 text-white m-2" onClick={() => removeOption(qIndex, oIndex)}>X</Button>
                  </div>
                ))}
              </RadioGroup>
              <Button type="button" className="mt-2 bg-blue-600 dark:bg-blue-500 text-white m-2" onClick={() => addOption(qIndex)}>+ Add Option</Button>
            </div>
          ))}
        </div>

        <Button type="button" className="bg-green-600 dark:bg-green-500 text-white m-2" onClick={addQuestion}>+ Add Question</Button>
        <Button type="submit" className="bg-blue-600 dark:bg-blue-500 text-white m-2">{quizToEdit ? "Update Quiz" : "Create Quiz"}</Button>
      </form>
    </div>
  );
};

export default QuizForm;
