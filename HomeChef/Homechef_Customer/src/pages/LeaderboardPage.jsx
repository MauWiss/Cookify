import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/api";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchLeaderboard()
      .then((res) => setPlayers(res.data))
      .catch(() => console.error("Failed to fetch leaderboard"));
  }, []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-yellow-500">
        🏆 Leaderboard
      </h1>
      <ul className="space-y-3">
        {players.map((player, index) => (
          <li
            key={player.username}
            className="flex justify-between rounded-xl bg-gray-100 p-4 shadow dark:bg-gray-800"
          >
            <span className="font-bold text-blue-600 dark:text-blue-300">
              #{index + 1} {player.username}
            </span>
            <span className="font-semibold text-green-600 dark:text-green-300">
              {player.score} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
