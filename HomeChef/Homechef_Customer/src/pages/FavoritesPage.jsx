import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { FaClock, FaUtensils, FaHeartBroken } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Favorites/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to load favorites", err);
      toast.error("Something went wrong while loading your favorites.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (recipeId) => {
    const result = await Swal.fire({
      title: "Remove from favorites?",
      text: "Are you sure you want to break up with this recipe? 💔",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/Favorites/${recipeId}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((r) => r.recipeId !== recipeId));
      toast.success("Recipe removed from your favorites 💔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from favorites.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 dark:bg-gray-900">
      <ToastContainer />
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
        My Favorite Recipes ❤️
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          You haven't added any recipes to your favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {favorites.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-2xl dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />

              <button
                onClick={() => removeFavorite(recipe.recipeId)}
                className="absolute right-2 top-2 z-10 rounded-full bg-gray-700 p-2 text-white shadow-md transition hover:scale-110 hover:bg-red-600"
                title="Remove from favorites"
              >
                <FaHeartBroken size={18} />
              </button>

              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.categoryName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
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
