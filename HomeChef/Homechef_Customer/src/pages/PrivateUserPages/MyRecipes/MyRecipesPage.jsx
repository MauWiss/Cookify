import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import AddRecipeModal from "../../../components/AddRecipeModal";
import EditRecipeModal from "../../../components/EditRecipeModal";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/MyRecipes/my-recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setLoading(false);
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
    fetchCategories();
  }, []);

  const filteredRecipes = selectedCategoryId
    ? recipes.filter((r) => r.categoryName === selectedCategoryId)
    : recipes;

  return (
    <div className="min-h-screen bg-white px-6 py-8 dark:bg-gray-900">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Recipes 👨‍🍳
      </h2>

      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
        <AddRecipeModal onRecipeAdded={fetchRecipes} />
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-800 dark:text-white"
          >
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-48 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          No recipes found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg dark:bg-gray-800"
            >
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-48 w-full object-cover"
                />
              </a>
              <div className="space-y-2 p-4">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-500 dark:text-white">
                    {recipe.title}
                  </h3>
                </a>
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
                  onClick={() => setEditingRecipeId(recipe.recipeId)}
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

      {/* 🔧 Edit Modal */}
      {editingRecipeId && (
        <EditRecipeModal
          recipeId={editingRecipeId}
          onClose={() => setEditingRecipeId(null)}
          onRecipeUpdated={() => {
            fetchRecipes();
            setTimeout(() => setEditingRecipeId(null), 50);
          }}
        />
      )}
    </div>
  );
}
