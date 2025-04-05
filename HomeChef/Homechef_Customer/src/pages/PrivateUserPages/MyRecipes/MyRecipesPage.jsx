// pages/PrivateUserPages/MyRecipes/MyRecipesPage.jsx
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddRecipeModal from "../../../components/AddRecipeModal";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/myrecipes/my-recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/myrecipes/${recipeId}`);
      setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
      Swal.fire("Deleted!", "Your recipe has been deleted.", "success");
    } catch (err) {
      console.error("Failed to delete", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">My Recipes 👨‍🍳</h2>
        <AddRecipeModal onRecipeAdded={fetchRecipes} />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          You haven’t added any recipes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg dark:bg-gray-800"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {recipe.categoryName}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>🕒 {recipe.cookingTime} min</span>
                  <span>🍽 {recipe.servings} servings</span>
                </div>
              </div>

              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/my-recipes/edit/${recipe.recipeId}`)
                  }
                  className="rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                  title="Edit"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(recipe.recipeId)}
                  className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
