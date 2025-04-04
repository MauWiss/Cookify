import { useEffect, useState } from "react";
import api from "../api/api";
import {
  FaHeart,
  FaRegHeart,
  FaClock,
  FaUtensils,
  FaSearch,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem("token");

  // פונקציה לשליפת המתכונים
  const fetchRecipes = async (term = "") => {
    setLoading(true);
    try {
      const endpoint = term
        ? `/recipes/search?term=${encodeURIComponent(term)}`
        : "/recipes/paged?pageNumber=1&pageSize=100";

      const response = await api.get(endpoint);
      setRecipes(response.data);

      if (term && response.data.length === 0) {
        toast.info("No recipes found 🍽️");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לשליפת המתכונים המועדפים
  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await api.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data.map((fav) => fav.recipeId));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  // פונקציה להוסיף למועדפים
  const addToFavorites = async (recipeId) => {
    if (!recipeId) return;
    try {
      await api.post(
        `/favorites/${recipeId}/favorite`,
        {}, // אין גוף
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFavorites((prev) => [...prev, recipeId]);
      toast.success("Added to favorites ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to favorites.");
    }
  };

  // פונקציה להסיר מהמועדפים
  const removeFromFavorites = async (recipeId) => {
    if (!recipeId) return;
    try {
      await api.delete(`/favorites/${recipeId}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((id) => id !== recipeId));
      toast.success("Removed from favorites 💔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from favorites.");
    }
  };

  // פונקציה לבדוק אם המתכון כבר במועדפים
  const isFavorite = (recipeId) => favorites.includes(recipeId);

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRecipes(searchTerm);
    }, 500); // ממתין 0.5 שניות אחרי ההקלדה
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="px-6 py-8">
      <ToastContainer />
      <div className="mx-auto mb-8 flex max-w-xl items-center overflow-hidden rounded-xl bg-white p-2 shadow-md dark:bg-gray-800">
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-transparent px-4 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-300"
        />
        <FaSearch className="mx-3 text-gray-400" />
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.recipeId || index}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl dark:bg-gray-800"
            >
              {recipe.sourceUrl ? (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-48 w-full object-cover transition hover:opacity-90"
                  />
                </a>
              ) : (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold transition hover:text-blue-500">
                    {recipe.title}
                  </h3>
                  <button
                    onClick={() =>
                      isFavorite(recipe.recipeId)
                        ? removeFromFavorites(recipe.recipeId)
                        : addToFavorites(recipe.recipeId)
                    }
                    className="text-red-500 transition hover:scale-110"
                  >
                    {isFavorite(recipe.recipeId) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
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
