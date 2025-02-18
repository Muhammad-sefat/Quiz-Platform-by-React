import React, { useEffect, useState } from "react";
import Results from "./Results";
import Question from "./Question";
import { saveHistory, getHistory, clearHistory } from "./IndexedDB";

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = await getHistory();
      if (storedHistory.length > 0) {
        setHistory(storedHistory);
        setQuizFinished(true);
      }
    };

    fetchHistory();

    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setQuizQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading quiz data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !quizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizFinished]);

  const handleAnswer = (answer) => {
    const correctAnswer = quizQuestions[currentIndex].correctAnswer;

    const isCorrect =
      answer === correctAnswer || parseInt(answer) === correctAnswer;

    setFeedback(isCorrect ? "✅ Correct!" : "❌ Incorrect!");

    setScore(isCorrect ? score + 1 : score);
    setHistory((prev) => [
      ...prev,
      {
        question: quizQuestions[currentIndex].question,
        answer,
        correct: isCorrect,
      },
    ]);
    setSelectedAnswer(answer);
  };

  const handleIntegerSubmit = () => {
    handleAnswer(userInput);
    setUserInput("");
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setTimeLeft(30);
    } else {
      setQuizFinished(true);
      saveHistory(history);
    }
  };

  const restartQuiz = async () => {
    await clearHistory();
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setQuizFinished(false);
    setTimeLeft(30);
    setFeedback(null);
    setQuizStarted(false);
  };
  const startQuiz = () => {
    setQuizStarted(true);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-lg w-full p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Ultimate Quiz</h1>
        {!quizStarted ? (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        ) : loading ? (
          <p>Loading quiz...</p>
        ) : quizFinished ? (
          <Results score={score} history={history} restartQuiz={restartQuiz} />
        ) : (
          <Question
            question={quizQuestions[currentIndex]}
            currentIndex={currentIndex}
            selectedAnswer={selectedAnswer}
            userInput={userInput}
            setUserInput={setUserInput}
            handleMCQClick={handleAnswer}
            handleIntegerSubmit={handleIntegerSubmit}
            feedback={feedback}
            timeLeft={timeLeft}
            handleNextQuestion={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
