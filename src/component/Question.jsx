import React from "react";

const Question = ({
  question,
  currentIndex,
  selectedAnswer,
  userInput,
  handleMCQClick,
  handleIntegerSubmit,
  setUserInput,
  feedback,
  timeLeft,
  handleNextQuestion,
}) => {
  return (
    <div className="text-white text-center">
      {/* Timer */}
      <div className="text-right text-sm mb-2">Time Left: {timeLeft}s</div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-gray-700 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-sm">{currentIndex + 1} / 10</p>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-4">{question.question}</h2>

      {/* Multiple Choice Options */}
      {question.type === "multiple-choice" && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`block w-full p-3 rounded-md text-left transition duration-200 hover:bg-blue-600 ${
                selectedAnswer === option ? "bg-blue-500" : "bg-gray-700"
              }`}
              onClick={() => handleMCQClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Integer Input */}
      {question.type === "integer" && (
        <div className="mt-4">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
          />
          <button
            className="mt-2 bg-blue-500 px-4 py-2 rounded w-full hover:bg-blue-600"
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
        className="mt-4 bg-green-500 px-6 py-2 rounded w-full hover:bg-green-600"
        onClick={() => handleNextQuestion(true)}
        disabled={!feedback}
      >
        {currentIndex + 1 === 10 ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  );
};

export default Question;
