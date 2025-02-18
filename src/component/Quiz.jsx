import React, { useEffect, useState } from "react";

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

  // Load questions from data.json
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setQuizQuestions(data))
      .catch((error) => console.error("Error loading quiz data:", error));
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion(false); // Auto move to next question when time is up
    }
  }, [timeLeft]);

  // Handle multiple-choice selection
  const handleMCQClick = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentIndex].correctAnswer;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Incorrect!");
    setScore(isCorrect ? score + 1 : score);
    setHistory([
      ...history,
      {
        question: quizQuestions[currentIndex].question,
        answer,
        correct: isCorrect,
      },
    ]);
  };

  // Handle integer input submission
  const handleIntegerSubmit = () => {
    const isCorrect =
      parseInt(userInput) === quizQuestions[currentIndex].correctAnswer;
    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect! Correct answer: ${quizQuestions[currentIndex].correctAnswer}`
    );
    setScore(isCorrect ? score + 1 : score);
    setHistory([
      ...history,
      {
        question: quizQuestions[currentIndex].question,
        answer: userInput,
        correct: isCorrect,
      },
    ]);
  };

  // Move to next question
  const handleNextQuestion = (manual = true) => {
    if (manual && !feedback) return; // Prevent skipping without answering

    setFeedback("");
    setSelectedAnswer(null);
    setUserInput("");
    setTimeLeft(30);

    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizQuestions.length === 0) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-lg w-full p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">
          Ultimate Quiz Challenge
        </h1>

        {quizFinished ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg">
              Your Score: {score} / {quizQuestions.length}
            </p>
            <h3 className="mt-4 text-xl font-semibold">Review Answers:</h3>
            <ul className="mt-2 space-y-2">
              {history.map((item, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-md ${
                    item.correct ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {item.question} <br />
                  Your Answer: {item.answer}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {/* Timer */}
            <div className="text-right text-sm mb-2">
              Time Left: {timeLeft}s
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-gray-700 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{
                    width: `${
                      ((currentIndex + 1) / quizQuestions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-right text-sm">
                {currentIndex + 1} / {quizQuestions.length}
              </p>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold mb-4">
              {quizQuestions[currentIndex].question}
            </h2>

            {/* Multiple Choice Questions */}
            {quizQuestions[currentIndex].type === "multiple-choice" && (
              <div className="space-y-2">
                {quizQuestions[currentIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`block w-full p-3 rounded-md text-left ${
                      selectedAnswer === option ? "bg-blue-500" : "bg-gray-700"
                    }`}
                    onClick={() => handleMCQClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Integer-Type Questions */}
            {quizQuestions[currentIndex].type === "integer" && (
              <div className="mt-4">
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer"
                />
                <button
                  className="mt-2 bg-blue-500 px-4 py-2 rounded w-full"
                  onClick={handleIntegerSubmit}
                >
                  Submit Answer
                </button>
              </div>
            )}

            {/* Feedback */}
            <p className="mt-4 text-lg font-semibold">{feedback}</p>

            {/* Next Button */}
            <button
              className="mt-4 bg-green-500 px-6 py-2 rounded w-full"
              onClick={() => handleNextQuestion(true)}
              disabled={!feedback}
            >
              {currentIndex + 1 === quizQuestions.length
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
