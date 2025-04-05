import { useEffect, useState } from "react";
import api from "../api/api";
import { FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const response = await api.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-xl font-semibold text-red-500">
        Please login to view your favorites ❤️
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "#1a202c" }}
    >
      <ToastContainer />
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        Your Favorite Recipes ❤️
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-10 text-center text-lg text-white">
          You haven't added any favorites yet.
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
                className="h-48 w-full object-cover"
              />
              <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 text-white shadow-md">
                <FaHeart size={18} />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold transition hover:text-blue-500">
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
