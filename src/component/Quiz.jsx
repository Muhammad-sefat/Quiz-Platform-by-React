import React, { useEffect, useState } from "react";
import Results from "./Results";
import Question from "./Question";
import { saveHistory, getHistory } from "./IndexedDB";

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((storedHistory) => {
      if (storedHistory && storedHistory.length > 0) {
        setHistory(storedHistory);
      }
    });

    fetch("/data.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
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
      handleNextQuestion(false);
    }
  }, [timeLeft, quizFinished]);

  const handleMCQClick = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentIndex].correctAnswer;
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
  };

  const handleIntegerSubmit = () => {
    const isCorrect =
      parseInt(userInput) === quizQuestions[currentIndex].correctAnswer;
    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect! Correct: ${quizQuestions[currentIndex].correctAnswer}`
    );
    setScore(isCorrect ? score + 1 : score);

    setHistory((prev) => [
      ...prev,
      {
        question: quizQuestions[currentIndex].question,
        answer: userInput,
        correct: isCorrect,
      },
    ]);
  };

  const handleNextQuestion = (manual = true) => {
    if (manual && !feedback) return;
    setFeedback("");
    setSelectedAnswer(null);
    setUserInput("");
    setTimeLeft(30);

    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
      saveHistory(history);
    }
    saveHistory([...history]);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setQuizFinished(false);
    setTimeLeft(30);
    saveHistory([]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-lg w-full p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Ultimate Quiz</h1>
        {loading ? (
          <p>Loading quiz...</p>
        ) : quizFinished ? (
          <Results score={score} history={history} restartQuiz={restartQuiz} />
        ) : (
          <Question
            question={quizQuestions[currentIndex]}
            timeLeft={timeLeft}
            feedback={feedback}
            selectedAnswer={selectedAnswer}
            userInput={userInput}
            handleMCQClick={handleMCQClick}
            handleIntegerSubmit={handleIntegerSubmit}
            handleNextQuestion={handleNextQuestion}
            setUserInput={setUserInput}
            currentIndex={currentIndex}
            totalQuestions={quizQuestions.length}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
