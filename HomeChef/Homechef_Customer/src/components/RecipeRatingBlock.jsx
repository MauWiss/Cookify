// ✅ components/RecipeRatingBlock.jsx

import React from "react";
import StarRating from "./StarRating";

const RecipeRatingBlock = ({
  userRating,
  averageRating,
  totalRatings,
  editable,
  onChange,
}) => {
  return (
    <div className="my-6">
      <StarRating value={userRating} onChange={onChange} editable={editable} />
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {totalRatings > 0
          ? `${averageRating} (${totalRatings} ratings)`
          : "No ratings yet"}
      </p>
    </div>
  );
};

export default RecipeRatingBlock;
