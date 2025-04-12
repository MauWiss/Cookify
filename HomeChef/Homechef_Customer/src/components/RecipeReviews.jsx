import { useEffect, useState } from "react";
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../api/api";
import { useAuth } from "../pages/Auth/AuthContext";
import { toast } from "react-toastify";

export default function RecipeReviews({ recipeId }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [newReview, setNewReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const loadReviews = async () => {
    try {
      const res = await fetchReviews(recipeId);
      setReviews(res.data.reviews || []);
      setMyReview(res.data.myReview || null);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      toast.warning("Review text cannot be empty.");
      return;
    }

    try {
      await addReview(recipeId, newReview);
      toast.success("Review submitted!");
      setNewReview("");
      loadReviews();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data ||
          "Failed to submit review. You may have already submitted one.",
      );
    }
  };

  const handleUpdateReview = async () => {
    try {
      await updateReview(myReview.reviewId, editText);
      toast.success("Review updated!");
      setEditing(false);
      loadReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review.");
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(myReview.reviewId);
      toast.success("Review deleted.");
      setEditing(false);
      loadReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="mt-12 space-y-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Reviews
      </h2>

      {/* ✅ My Review (if logged in and already wrote) */}
      {user && myReview && (
        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          {editing ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateReview}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-800 dark:text-white">
                {myReview.reviewText}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditText(myReview.reviewText);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ✅ Add New Review (only if logged in and didn't write yet) */}
      {user && !myReview && (
        <div className="space-y-3">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleAddReview}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* ✅ All reviews */}
      <div className="space-y-4 pt-6">
        {reviews.map((r) => (
          <div
            key={r.reviewId}
            className="border-t border-gray-200 pt-4 dark:border-gray-700"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800 dark:text-white">
                {r.username}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{r.reviewText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
