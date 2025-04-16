import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchTriviaQuestion } from "../api/api";

export default function TriviaGame() {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await fetchTriviaQuestion();
      setQuestionData(res.data);
      setSelected("");
      setShowAnswer(false);
    } catch (err) {
      toast.error("❌ Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSelect = (option) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
  };

  if (loading || !questionData?.question) {
    return (
      <div className="mt-20 text-center text-lg text-gray-600 dark:text-gray-300">
        🧠 Loading trivia question...
      </div>
    );
  }

  const isCorrect =
    selected && selected[0].toUpperCase() === questionData.answer.toUpperCase();
  const correctText = questionData.correctText;

  return (
    <div className="mx-auto max-w-2xl p-6 text-gray-900 dark:text-white">
      <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Trivia Time! 🍽️
      </h1>

      <div className="mb-4 text-xl font-semibold">{questionData.question}</div>

      <div className="space-y-3">
        {questionData.options.map((opt, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          const isThisCorrect = letter === questionData.answer.toUpperCase();
          const isSelected = letter === selected[0]?.toUpperCase();
          const base = "w-full rounded-lg p-3 transition font-medium shadow-sm";

          const bg = showAnswer
            ? isSelected
              ? isThisCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : isThisCorrect
                ? "bg-green-100 dark:bg-green-800"
                : "bg-gray-200 dark:bg-gray-700"
            : "bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white";

          return (
            <button
              key={idx}
              onClick={() => handleSelect(letter + ")")}
              className={`${base} ${bg}`}
            >
              {letter}) {opt}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="mt-6 rounded-xl bg-yellow-100 p-4 text-gray-800 dark:bg-yellow-900 dark:text-white">
          <strong className="mb-2 block text-lg">
            {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
          </strong>

          {!isCorrect && (
            <p className="mb-2">
              The correct answer was:{" "}
              <span className="font-bold text-green-600 dark:text-green-300">
                {questionData.answer}) {correctText}
              </span>
            </p>
          )}

          <p>{questionData.explanation}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={fetchQuestion}
          className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700"
        >
          🔁 Next Question
        </button>
      </div>
    </div>
  );
}
