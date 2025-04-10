import React, { useEffect, useState } from "react";
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../api/api";
import { toast } from "react-toastify";

// Utility to extract user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.UserId || null;
  } catch {
    return null;
  }
};

const RecipeReviews = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [editText, setEditText] = useState("");
  const userId = getUserIdFromToken();

  // Load all reviews on mount
  const loadReviews = async () => {
    try {
      const res = await fetchReviews(recipeId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  // Get current user's review (if exists)
  const userReview = reviews.find((r) => r.userId === userId);

  const handleAddReview = async () => {
    try {
      await addReview(recipeId, newReview);
      toast.success("Review added!");
      setNewReview("");
      loadReviews();
    } catch (err) {
      toast.error("Failed to add review.");
      console.error(err);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await updateReview(reviewId, editText);
      toast.success("Review updated!");
      loadReviews();
    } catch (err) {
      toast.error("Failed to update review.");
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted!");
      loadReviews();
    } catch (err) {
      toast.error("Failed to delete review.");
      console.error(err);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Reviews
      </h2>

      {userReview ? (
        <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
          <textarea
            value={editText || userReview.reviewText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full rounded-lg border p-3 text-sm dark:bg-gray-700 dark:text-white"
          />
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => handleUpdateReview(userReview.reviewId)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteReview(userReview.reviewId)}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full rounded-lg border p-3 text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Write your review..."
          />
          <button
            onClick={handleAddReview}
            className="mt-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add Review
          </button>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.reviewId}
              className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800"
            >
              <p className="font-semibold text-gray-900 dark:text-white">
                {r.username}:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {r.reviewText}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeReviews;
