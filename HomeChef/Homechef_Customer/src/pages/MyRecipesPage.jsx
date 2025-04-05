import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaClock, FaUtensils, FaPen, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMyRecipes = async () => {
    try {
      const res = await api.get("/MyRecipes/my-recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(res.data);
    } catch (err) {
      toast.error("Failed to load your recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Recipe?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/MyRecipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recipe deleted.");
      setRecipes((prev) => prev.filter((r) => r.recipeId !== id));
    } catch {
      toast.error("Failed to delete recipe.");
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 dark:bg-gray-900">
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Recipes 🧑‍🍳
        </h2>
        <button
          onClick={() => navigate("/my-recipes/add")}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You haven't created any recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-gray-50 p-4 shadow-md transition hover:shadow-xl dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recipe.categoryName}
              </p>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <FaClock /> {recipe.cookingTime} min
                </span>
                <span className="flex items-center gap-1">
                  <FaUtensils /> {recipe.servings} servings
                </span>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() =>
                    navigate(`/my-recipes/edit/${recipe.recipeId}`)
                  }
                  className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-white hover:bg-yellow-500"
                >
                  <FaPen />
                </button>
                <button
                  onClick={() => handleDelete(recipe.recipeId)}
                  className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
