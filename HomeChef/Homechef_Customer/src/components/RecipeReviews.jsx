// ✅ components/RecipeReviews.jsx

import React, { useEffect, useState } from "react";
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../api/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const RecipeReviews = ({ recipeId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const loadReviews = async () => {
    try {
      const res = await fetchReviews(recipeId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  const handleAddReview = async () => {
    if (!token) {
      toast.info("Please login to add a review ✏️");
      return;
    }

    if (!newReview.trim()) return;

    try {
      await addReview(recipeId, newReview);
      setNewReview("");
      toast.success("Review added successfully!");
      loadReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateReview(id, editingText);
      toast.success("Review updated ✏️");
      setEditingId(null);
      loadReviews();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteReview(id);
      toast.success("Review deleted");
      loadReviews();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).UserId
    : null;

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Reviews 💬
      </h2>

      {reviews.map((review) => (
        <div
          key={review.reviewId}
          className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
        >
          <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-800 dark:text-white">
              {review.username}
            </p>
            {review.userId === currentUserId && (
              <div className="flex gap-2">
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => {
                    setEditingId(review.reviewId);
                    setEditingText(review.reviewText);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => handleDelete(review.reviewId)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {editingId === review.reviewId ? (
            <>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="mt-2 w-full rounded-md border p-2 text-sm dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleUpdate(review.reviewId)}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded bg-gray-300 px-3 py-1 text-sm"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {review.reviewText}
            </p>
          )}
        </div>
      ))}

      {token && (
        <div className="mt-6">
          <textarea
            rows={3}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full rounded-lg border px-4 py-2 text-sm text-gray-800 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddReview}
            className="mt-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeReviews;
