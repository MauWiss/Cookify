// src/pages/PrivateUserPages/MyRecipes/MyRecipesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { FaClock, FaEdit, FaTrash, FaUtensils } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyRecipes = async () => {
    try {
      const res = await api.get("/MyRecipes/my-recipes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecipes(res.data);
    } catch (err) {
      console.error("Failed to fetch your recipes:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await api.delete(`/MyRecipes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Recipe deleted successfully.");
      setRecipes((prev) => prev.filter((r) => r.recipeId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete recipe.");
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 dark:bg-gray-900">
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Recipes 🍳
        </h2>
        <button
          onClick={() => navigate("/my-recipes/add")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          ➕ Add Recipe
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You haven’t created any recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-white shadow-md dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {recipe.categoryName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaClock /> {recipe.cookingTime || "?"} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils /> Serves {recipe.servings || "?"}
                  </span>
                </div>
                <div className="mt-3 flex justify-between">
                  <button
                    onClick={() =>
                      navigate(`/my-recipes/edit/${recipe.recipeId}`)
                    }
                    className="flex items-center gap-1 rounded bg-yellow-400 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-500"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.recipeId)}
                    className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
