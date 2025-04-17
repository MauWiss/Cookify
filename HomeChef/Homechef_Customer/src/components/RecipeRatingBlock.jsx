// components/RecipeRatingBlock.jsx
import React, { useEffect, useState } from "react";
import { getRatingDetails } from "../api/api";
import { FaStar } from "react-icons/fa";

const RecipeRatingBlock = ({ recipeId }) => {
  const [ratingData, setRatingData] = useState({
    averageRating: null,
    ratingCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getRatingDetails(recipeId);
        setRatingData({
          averageRating: data.averageRating,   // number or null
          ratingCount:   data.ratingCount,     // integer
        });
      } catch (err) {
        console.error("Failed to load rating data", err);
      }
    };

    fetchData();
  }, [recipeId]);

  /* ---------- fallback text ---------- */
  if (ratingData.ratingCount === 0)
    return <div className="text-xs text-gray-400 mt-1">No ratings yet</div>;
  /* ----------------------------------- */

  // only runs when there IS at least one rating
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
      <FaStar />
      <span>
        {ratingData.averageRating.toFixed(1)} ({ratingData.ratingCount})
      </span>
    </div>
  );
};

export default RecipeRatingBlock;
