import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { fetchTriviaQuestion } from "../api/api";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { FaHeart, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function TriviaGame() {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(15);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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
    } catch {
      toast.error("❌ Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (gameOver || showAnswer || loading || isMuted) return;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    audioRef.current.play().catch(() => {});
  }, [loading, showAnswer, gameOver, isMuted]);

  useEffect(() => {
    if (showAnswer || loading || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showAnswer, loading, gameOver]);

  const handleTimeout = () => {
    setShowAnswer(true);
    loseLife();
  };

  const loseLife = () => {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        audioRef.current.pause();
        setGameOver(true);
      }
      return newLives;
    });
  };

  const handleSelect = (option) => {
    if (showAnswer || gameOver) return;
    setSelected(option);
    setShowAnswer(true);
    const isCorrect =
      option[0].toUpperCase() === questionData.answer.toUpperCase();
    if (isCorrect) {
      confetti();
    } else {
      loseLife();
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      if (newState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      return newState;
    });
  };

  const handleNext = () => {
    fetchQuestion();
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

  const livesDisplay = Array.from({ length: lives }, (_, i) => (
    <FaHeart key={i} className="mr-1 inline text-lg text-red-500" />
  ));

  return (
    <div className="relative mx-auto max-w-2xl p-6 text-gray-900 dark:text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mx-auto mb-4 text-center text-4xl font-extrabold text-blue-600">
          Trivia Time! 🍽️
        </h1>

        <div className="flex items-center gap-3">
          {livesDisplay}
          <button onClick={toggleMute} title="Toggle Music">
            {isMuted ? (
              <FaVolumeMute className="text-xl text-red-400" />
            ) : (
              <FaVolumeUp className="text-xl text-green-500" />
            )}
          </button>
        </div>
      </div>

      <div className="mb-2 text-right text-lg font-bold text-red-500">
        ⏳ {timer}s
      </div>

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

      {/* BUTTONS */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleNext}
          className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow hover:bg-blue-700"
        >
          🔁 Next Question
        </button>
        <Link
          to="/leaderboard"
          className="rounded-xl bg-yellow-500 px-6 py-2 font-bold text-white shadow hover:bg-yellow-600"
        >
          🏆 View Leaderboard
        </Link>
      </div>

      {/* GAME OVER */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
          <div className="text-center">
            <h2 className="mb-4 animate-pulse text-4xl font-extrabold">
              💀 Game Over!
            </h2>
            <p className="mb-6 text-lg">You ran out of lives. Try again?</p>
            <button
              onClick={() => {
                setLives(3);
                setGameOver(false);
                fetchQuestion();
              }}
              className="rounded-xl bg-green-600 px-6 py-2 font-bold text-white hover:bg-green-700"
            >
              🔄 Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
