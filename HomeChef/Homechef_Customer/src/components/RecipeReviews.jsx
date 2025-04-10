import React, { useEffect, useState } from "react";
import {
  fetchReviews,
  addReview,
  deleteReview,
  updateReview,
} from "../api/api";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";
import { toast } from "react-toastify";

const RecipeReviews = ({ recipeId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const userId = token ? JSON.parse(atob(token.split(".")[1])).UserId : null;

  const loadReviews = async () => {
    try {
      const res = await fetchReviews(recipeId);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  const handleAddReview = async () => {
    if (!newReview.trim()) return toast.info("Write something first...");
    try {
      await addReview(recipeId, newReview.trim());
      toast.success("Review added ✅");
      setNewReview("");
      loadReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review ❌");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted 🗑️");
      setReviews(reviews.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.reviewId);
    setEditText(review.reviewText);
  };

  const handleSaveEdit = async () => {
    try {
      await updateReview(editingId, editText);
      toast.success("Review updated ✏️");
      setEditingId(null);
      loadReviews();
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  return (
    <div className="mt-12">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
        Reviews <FaCommentDots className="text-blue-500" />
      </h2>

      {token && (
        <div className="mb-6 flex gap-3">
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write a review..."
            className="flex-1 rounded-lg border px-4 py-2 text-gray-800 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleAddReview}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.reviewId}
              className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-gray-700 dark:text-white">
                  {review.username}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === review.reviewId ? (
                <>
                  <textarea
                    className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-white"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded bg-gray-400 px-3 py-1 text-white hover:bg-gray-500"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {review.reviewText}
                </p>
              )}

              {userId === review.userId && editingId !== review.reviewId && (
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-yellow-600 hover:underline"
                  >
                    <FaEdit className="inline" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.reviewId)}
                    className="text-red-600 hover:underline"
                  >
                    <FaTrash className="inline" /> Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeReviews;
