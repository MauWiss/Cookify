import { useEffect, useState } from "react";
import api from "../api/api";
import {
  FaClock,
  FaUtensils,
  FaSearch,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRecipes = async (term = "", categoryId = null) => {
    setLoading(true);
    try {
      let endpoint = "";

      if (term && term.trim() !== "") {
        endpoint = `/recipes/search?term=${encodeURIComponent(term)}`;
      } else if (categoryId) {
        endpoint = `/categories/${categoryId}/recipes`;
      } else {
        endpoint = "/recipes/paged?pageNumber=1&pageSize=100";
      }

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

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);
  const addToFavorites = async (recipeId) => {
    if (!token) {
      toast.warning("Please log in to add favorites 💡");
      return;
    }
    try {
      await api.post(
        `/Favorites/${recipeId}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFavorites((prev) => [...prev, recipeId]);
      toast.success("Added to favorites ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to favorites.");
    }
  };
  const removeFromFavorites = async (recipeId) => {
    if (!recipeId) return;
    try {
      await api.delete(`/Favorites/${recipeId}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((id) => id !== recipeId));
      toast.success("Removed from favorites 💔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from favorites.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRecipes(
        searchTerm,
        searchTerm.trim() === "" ? selectedCategoryId : null,
      );
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategoryId]);

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: "#1a202c" }}
    >
      <ToastContainer />

      <div className="mx-auto mb-8 flex max-w-xl items-center overflow-hidden rounded-xl bg-white p-2 shadow-md dark:bg-gray-800">
        <FaSearch className="mx-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-transparent px-4 py-2 text-base font-semibold tracking-wide text-gray-800 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2 text-lg text-white">Filter by Category:</label>
        <select
          value={selectedCategoryId ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? Number(e.target.value) : null,
            )
          }
          className="rounded-lg border bg-white px-4 py-2 dark:border-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl dark:bg-gray-800"
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

              <button
                onClick={() =>
                  isFavorite(recipe.recipeId)
                    ? removeFromFavorites(recipe.recipeId)
                    : addToFavorites(recipe.recipeId)
                }
                className={`absolute right-2 top-2 z-10 rounded-full p-2 shadow-md transition-all duration-300 ${
                  isFavorite(recipe.recipeId)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-red-500 hover:bg-red-100"
                } hover:scale-110`}
              >
                {isFavorite(recipe.recipeId) ? (
                  <FaHeart size={18} />
                ) : (
                  <FaRegHeart size={18} />
                )}
              </button>

              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold transition hover:text-blue-500">
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
