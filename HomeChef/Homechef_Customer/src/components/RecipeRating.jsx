import React, { useState, useEffect } from "react";
import {
  postRating,
  fetchUserRating,
  updateRating,
  deleteRating,
} from "../api";
import StarRating from "./StarRating";
import { toast } from "react-toastify";

const RecipeRating = ({ recipeId }) => {
  const [rating, setRating] = useState(0); // דירוג נבחר
  const [userRating, setUserRating] = useState(0); // דירוג של המשתמש הנוכחי

  // פונקציה לשאול את הדירוג הנוכחי של המשתמש
  useEffect(() => {
    const loadUserRating = async () => {
      try {
        const response = await recipeId; // שליפה של הדירוג של המשתמש
        if (response.data) {
          setUserRating(response.data.rating); // עדכון דירוג המשתמש
          setRating(response.data.rating); // עדכון דירוג הכוכבים
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    loadUserRating();
  }, [recipeId]);

  // פונקציה לעדכון הדירוג
  const handleRatingChange = async (newValue) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to rate this recipe ⭐");
      return;
    }

    try {
      if (userRating === 0) {
        await postRating(recipeId, newValue); // שליחה ל-API להוספת דירוג
      } else {
        await updateRating(recipeId, newValue); // שליחה ל-API לעדכון דירוג
      }
      setUserRating(newValue); // עדכון הדירוג
      setRating(newValue); // עדכון הדירוג בצד הלקוח
      toast.success("Rating submitted! 🌟");
    } catch (error) {
      toast.error("Error updating rating.");
    }
  };

  return (
    <div>
      <StarRating
        value={rating}
        onChange={handleRatingChange}
        editable={true}
      />
      <p>
        {userRating === 0
          ? "No rating yet"
          : `Your rating: ${userRating} stars`}
      </p>
    </div>
  );
};

export default RecipeRating;
