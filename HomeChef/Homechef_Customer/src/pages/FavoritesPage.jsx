import { useEffect, useState } from "react";
import api from "../api/api";
import { FaHeartBroken, FaClock, FaUtensils } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/Favorites/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
      toast.error("Something went wrong loading your favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this recipe from your favorites? 💔",
    );
    if (!confirm) return;

    try {
      await api.delete(`/Favorites/${recipeId}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((r) => r.recipeId !== recipeId));
      toast.info("Removed from favorites 💔");
    } catch (err) {
      console.error("Failed to remove from favorites", err);
      toast.error("Could not remove this recipe.");
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
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        My Favorite Recipes ❤️
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-12 text-center text-lg text-white">
          No favorites yet... 💡
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {favorites.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover transition hover:opacity-90"
              />

              <button
                onClick={() => handleRemove(recipe.recipeId)}
                className="absolute right-2 top-2 z-10 rounded-full bg-gray-200 p-2 text-red-600 shadow-md transition-all duration-300 hover:scale-110 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                title="Remove from favorites"
              >
                <FaHeartBroken size={18} />
              </button>

              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-gray-800 transition hover:text-blue-500 dark:text-white">
                  {recipe.title}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.categoryName}
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    <FaClock /> {recipe.cookingTime || "?"} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils /> Serves {recipe.servings || "?"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
