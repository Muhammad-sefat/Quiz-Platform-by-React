import React from "react";

const Results = ({ history, score, restartQuiz }) => {
  return (
    <div className="text-white text-center">
      <h2 className="text-3xl font-bold my-4 text-green-600">
        Quiz Completed!
      </h2>
      <p className="text-lg">
        Your Score: {score} / {history.length}
      </p>

      <h3 className="mt-4 text-xl font-semibold">Review Answers:</h3>
      <ul className="mt-2 space-y-2">
        {history.map((item, index) => (
          <li
            key={index}
            className={`p-3 rounded-md ${
              item.correct ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <strong>
              {index + 1}. {item.question}
            </strong>{" "}
            <br />
            Your Answer: {item.answer}
          </li>
        ))}
      </ul>

      <button
        className="mt-6 bg-blue-500 px-6 py-3 rounded text-lg hover:bg-blue-600"
        onClick={restartQuiz}
      >
        Play Again
      </button>
    </div>
  );
};

export default Results;
