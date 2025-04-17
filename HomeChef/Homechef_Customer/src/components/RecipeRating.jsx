import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { postRating, updateRating, fetchUserRating } from "../api/api";
import { toast } from "react-toastify";

const RecipeRating = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    fetchUserRating(recipeId)
      .then((res) => {
        if (res.status === 200 && res.data.rating != null) {
          setRating(res.data.rating);
          setHasRated(true);
        }
      })
      .catch((err) => {
        // 204 No Content or 404 Not Found = user hasn't rated yet
        if (![204, 404].includes(err.response?.status)) {
          console.error("Error loading user rating", err);
        }
      });
  }, [recipeId]);

  const handleChange = async (newRating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to rate recipes ⭐");
      return;
    }

    try {
      if (!hasRated) {
        await postRating(recipeId, newRating);
        toast.success("Thanks for rating!");
      } else {
        await updateRating(recipeId, newRating);
        toast.success("Rating updated!");
      }
      setRating(newRating);
      setHasRated(true);
    } catch (err) {
      console.error("Error submitting rating", err);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Rate here!</p>
      <StarRating value={rating} onChange={handleChange} edit={true} />
    </div>
  );
};

export default RecipeRating;
