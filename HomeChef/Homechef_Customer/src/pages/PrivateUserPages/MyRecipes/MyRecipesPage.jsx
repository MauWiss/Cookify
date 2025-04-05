import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddRecipeModal from "../../../components/AddRecipeModal";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">My Recipes 👨‍🍳</h2>
        <AddRecipeModal onRecipeAdded={fetchRecipes} />
      </div>

      {/* Layout: Sidebar left + content right */}
      <div className="flex gap-6">
        {/* Sidebar אנכי עם קטגוריות */}
        <aside className="w-48 flex-shrink-0 space-y-2 overflow-y-auto rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
          <button
            onClick={() => setSelectedCategoryId("")}
            className={`w-full rounded px-3 py-2 text-left text-sm transition ${
              selectedCategoryId === ""
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.name)}
              className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                selectedCategoryId === cat.name
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* תוכן המתכונים */}
        <main className="flex-1">
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
        </main>
      </div>
    </div>
  );
}
