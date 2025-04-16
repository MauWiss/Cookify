import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { fetchTriviaQuestion } from "../api/api";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

export default function TriviaGame() {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(15);
  const [lives, setLives] = useState(3);

  const timerRef = useRef(null);
  const audioRef = useRef(new Audio("/audio/TriviaSound.mp3"));

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await fetchTriviaQuestion();
      setQuestionData(res.data);
      setSelected("");
      setShowAnswer(false);
      setTimer(15);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch (err) {
      toast.error("❌ Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (showAnswer || loading) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowAnswer(true);
          setLives((prev) => prev - 1);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showAnswer, loading]);

  const handleSelect = (option) => {
    if (showAnswer) return;
    audioRef.current.play();
    setSelected(option);
    setShowAnswer(true);
    if (option[0].toUpperCase() === questionData.answer.toUpperCase()) {
      confetti();
    } else {
      setLives((prev) => prev - 1);
    }
  };

  const isCorrect =
    selected && selected[0].toUpperCase() === questionData.answer.toUpperCase();

  if (lives <= 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center text-gray-900 dark:text-white">
        <h1 className="mb-4 text-4xl font-extrabold text-red-600">
          Game Over 💔
        </h1>
        <button
          onClick={() => {
            setLives(3);
            fetchQuestion();
          }}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow hover:bg-blue-700"
        >
          🔁 Try Again
        </button>
      </div>
    );
  }

  if (loading || !questionData?.question) {
    return (
      <div className="mt-20 text-center text-lg text-gray-600 dark:text-gray-300">
        🧠 Loading trivia question...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6 text-gray-900 dark:text-white">
      <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
        <h1 className="text-3xl font-extrabold text-blue-600">
          Trivia Time! 🍽️
        </h1>
        <div className="mt-2 flex items-center gap-3 sm:mt-0">
          <span className="text-lg font-semibold text-red-500">❤️ {lives}</span>
          <span className="text-lg font-bold text-yellow-500">⏳ {timer}s</span>
          <Link
            to="/leaderboard"
            className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black shadow hover:bg-yellow-500"
          >
            🏆 Leaderboard
          </Link>
        </div>
      </div>

      <div className="mb-4 text-xl font-semibold leading-relaxed">
        {questionData.question}
      </div>

      <div className="space-y-4">
        {questionData.options.map((opt, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          const isThisCorrect = letter === questionData.answer.toUpperCase();
          const isSelected = letter === selected[0]?.toUpperCase();

          const base =
            "w-full rounded-xl px-6 py-4 text-left text-lg font-medium shadow-md transition";

          const bg = showAnswer
            ? isSelected
              ? isThisCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : isThisCorrect
                ? "bg-green-100 dark:bg-green-800"
                : "bg-gray-200 dark:bg-gray-700"
            : "bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white";

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
              Correct answer:
              <span className="ml-2 font-bold text-green-600 dark:text-green-300">
                {questionData.answer}) {questionData.correctText}
              </span>
            </p>
          )}
          <p>{questionData.explanation}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => fetchQuestion()}
          className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow-md transition hover:bg-blue-700"
        >
          🔁 Next Question
        </button>
      </div>
    </div>
  );
}
