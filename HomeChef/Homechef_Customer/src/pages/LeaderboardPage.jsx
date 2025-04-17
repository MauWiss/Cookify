// LeaderboardPage.jsx
import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/api";
import {
  FaCrown,
  FaUserAlt,
  FaStar,
  FaCheckCircle,
  FaCalendarAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard()
      .then((res) => setLeaders(res.data))
      .catch(() => toast.error("❌ Failed to load leaderboard"));
  }, []);

  const crownColors = ["text-yellow-400", "text-gray-400", "text-orange-600"];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 text-gray-900 dark:text-white">
      <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-600">
        Leaderboard
      </h1>

      <div className="rounded-xl border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="py-2">#</th>
              <th>Username</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((player, idx) => (
            <tr
            key={idx}
            className={`border-b dark:border-gray-600 ${
              idx === 0
                ? "bg-yellow-100 dark:bg-yellow-900"
                : idx === 1
                ? "bg-gray-100 dark:bg-gray-800"
                : idx === 2
                ? "bg-orange-100 dark:bg-orange-900"
                : ""
            }`}
          >
            {/* מספר + כתר */}
            <td className="py-2 font-bold text-center">
              {idx < 3 ? (
                <FaCrown className={`${crownColors[idx]} inline text-xl`} />
              ) : (
                idx + 1
              )}
            </td>
          
            {/* שם משתמש + אייקון */}
            <td className="py-2">
              <div className="flex items-center gap-2">
                <FaUserAlt className="text-gray-500" />
                {player.username}
              </div>
            </td>
          
            {/* ניקוד + כוכב */}
            <td className="py-2">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <FaStar className="text-yellow-500" />
                {player.score}
               
              </div>
            </td>
          
            {/* תשובות נכונות + וי */}
            <td className="py-2">
              <div className="flex items-center gap-2 text-green-600 font-medium">
              <FaCheckCircle className="text-green-500" />
                {player.correctAnswers}
                
              </div>
            </td>
          
            {/* תאריך + אייקון */}
            <td className="py-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaCalendarAlt />
                {new Date(player.submittedAt).toLocaleDateString()}
              </div>
            </td>
          </tr>
          
            ))}
            {leaders.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-400">
                  No scores submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
