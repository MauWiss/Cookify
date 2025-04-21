/* src/pages/MyRecipesPage.jsx */
import { useState, useEffect } from "react";
import api from "../../api/api";
import RecipeWizard from "../../components/AddRecipeModal";
import { toast } from "react-toastify";
import {
  FaClock,
  FaUtensils,
  FaHeart,
  FaRegHeart,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecipeRatingBlock from "../../components/RecipeRatingBlock";


export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [editing, setEditing] = useState(null);
  

  /* load once, and whenever we call refresh() */
  const refresh = () => {
    api
      .get("/myrecipes/my-recipes")
      .then((r) => setRecipes(r.data))
      .catch((e) => console.error("Load recipes failed", e));
  };
  useEffect(() => {
    refresh(); // ✅ call inside an arrow, return nothing
  }, []);

  /* delete handler */
  const remove = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await api.delete(`/myrecipes/${id}`);
      toast.info("Recipe deleted");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Recipes</h1>

        {/* ➕ add–new */}
        <RecipeWizard onSaved={refresh} />
      </div>

      {recipes.length === 0 ? (
        <p>No recipes yet. Add one!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <div
              key={r.recipeId}
              className="relative overflow-hidden rounded-xl border border-border bg-card shadow transition duration-300 hover:shadow-lg dark:border-border-dark dark:bg-card-dark"
            >
              <img
                onClick={() => navigate(`/recipes/${r.recipeId}`)}
                src={r.imageUrl}
                alt={r.title}
                className="h-48 w-full cursor-pointer object-cover transition hover:opacity-90"
              />

              <div className="space-y-2 p-4">
                <h3
                  onClick={() => navigate(`/recipes/${r.recipeId}`)}
                  className="cursor-pointer text-base font-semibold text-white hover:text-primary dark:hover:text-primary-dark"
                >
                  {r.title}
                </h3>

                <RecipeRatingBlock recipeId={r.recipeId} />

                <p className="text-sm text-muted dark:text-muted-dark">
                  {r.categoryName}
                </p>

                <div className="mt-1 flex items-center gap-4 text-sm text-muted dark:text-muted-dark">
                  <span className="flex items-center gap-1">
                    <FaClock /> {r.cookingTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils /> Serves {r.servings}
                  </span>
                </div>
              </div>

              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  onClick={() => setEditing(r)}
                  className="rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                >
                  <FaPen size={14} />
                </button>
                <button
                  onClick={() => remove(r.recipeId)}
                  className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* edit modal */}
      {editing && (
        <RecipeWizard
          recipe={editing}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
