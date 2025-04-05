import { useEffect, useState } from "react";
import api from "../api/api";
import { FaHeart, FaClock, FaUtensils } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) {
      toast.warning("Please login to view your favorites ❤️");
      return;
    }

    try {
      const res = await api.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to load favorites", err);
      toast.error("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (id) => {
    try {
      await api.delete(`/favorites/${id}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((r) => r.recipeId !== id));
      toast.success("Removed from favorites 💔");
    } catch {
      toast.error("Failed to remove from favorites.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "#1a202c" }}
    >
      <ToastContainer />
      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        My Favorite Recipes 💙
      </h1>

      {loading ? (
        <div className="flex justify-center text-white">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-white">No favorites yet!</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {favorites.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />

              <button
                onClick={() => removeFromFavorites(recipe.recipeId)}
                title="Remove from favorites"
                className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 text-white shadow-md transition hover:scale-110 hover:bg-red-600"
              >
                <FaHeart size={18} />
              </button>

              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {recipe.title}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.categoryName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
