import React, { useEffect, useState } from "react";
import { getRatingDetails } from "../api/api";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";


/* ⭐ Read-only star component */
const StarRatingDisplay = ({ value }) => {
  return (
    <div className="flex items-center gap-0.5 text-base text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) => {
        if (value >= i) {
          return <FaStar key={i} />;
        } else if (value >= i - 0.5) {
          return <FaStarHalfAlt key={i} />;
        } else {
          return <FaRegStar key={i} />;
        }
      })}
    </div>
  );
};


const RecipeRatingBlock = ({ recipeId, override }) => {
  const [ratingData, setRatingData] = useState({
    averageRating: null,
    ratingCount: 0,
  });

  useEffect(() => {
    if (override) {
      setRatingData(override);
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await getRatingDetails(recipeId);
        setRatingData({
          averageRating: data.averageRating,
          ratingCount: data.ratingCount,
        });
      } catch (err) {
        console.error("Failed to load rating data", err);
      }
    };

    fetchData();
  }, [recipeId, override]);


  if (ratingData.ratingCount === 0)
    return <div className="text-xs text-gray-400 mt-1">No ratings yet</div>;

  return (
    <div className="mt-1 flex items-center gap-2">
      <StarRatingDisplay value={ratingData.averageRating} />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {ratingData.averageRating.toFixed(1)} ({ratingData.ratingCount})
      </span>
    </div>
  );
};

export default RecipeRatingBlock;
