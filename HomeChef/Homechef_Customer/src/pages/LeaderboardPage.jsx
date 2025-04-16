import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadScores = async () => {
      try {
        const res = await fetchLeaderboard();
        setScores(res.data);
      } catch {
        toast.error("❌ Failed to load leaderboard");
      }
    };
    loadScores();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="mx-auto max-w-2xl p-6 text-gray-900 dark:text-white">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-blue-600">
        🏆 Trivia Leaderboard
      </h1>

      <table className="w-full table-auto rounded-xl bg-white shadow dark:bg-gray-800">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((row, index) => {
            const isCurrentUser = row.userId === user?.userId;
            return (
              <tr
                key={index}
                className={`border-b dark:border-gray-600 ${
                  isCurrentUser
                    ? "bg-blue-100 font-bold dark:bg-blue-900"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <td className="px-4 py-2">{getMedal(index) || index + 1}</td>
                <td className="px-4 py-2">{row.username}</td>
                <td className="px-4 py-2">{row.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
