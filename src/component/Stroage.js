// Save history to localStorage
export const saveHistory = (history) => {
  localStorage.setItem("quizHistory", JSON.stringify(history));
};

// Get history from localStorage
export const getHistory = () => {
  const history = localStorage.getItem("quizHistory");
  return history ? JSON.parse(history) : [];
};

// Clear history from localStorage
export const clearHistory = () => {
  localStorage.removeItem("quizHistory");
};
