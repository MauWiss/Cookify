import { useState, useEffect } from "react";
import { FaClock, FaUtensils, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addFavorite, removeFavorite } from "../api/api";
import SearchInput from "../components/SearchInput";
import CategorySelect from "../components/CategorySelect";
import { useRecipesData } from "../hooks/useRecipesData";
import RecipeRatingBlock from "../components/RecipeRatingBlock";


export default function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const {
    recipes,
    loading,
    error,
    categories,
    favorites,
    hasMore,
    page,
    totalCount,
    reloadFavorites,
    loadMoreRecipes,
    loadRecipes
  } = useRecipesData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  

  const categoryCounts = recipes.length;

  useEffect(() => {
    const delay = setTimeout(() => {
      loadRecipes(searchTerm, selectedCategoryId,  1, false);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategoryId]);

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const handleFavorite = async (recipeId) => {
    if (!token) {
      toast.info("Please login to add/remove favorites ❤️");
      return;
    }
    try {
      if (isFavorite(recipeId)) {
        await removeFavorite(recipeId);
        toast.success("Removed from favorites 💔");
      } else {
        await addFavorite(recipeId);
        toast.success("Added to favorites ❤️");
      }
      reloadFavorites();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorites.");
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  return (
    <div className="bg-background dark:bg-background-dark text-text dark:text-text-dark min-h-screen py-6 sm:px-6 md:px-12 lg:px-48">
      <ToastContainer />

      <SearchInput searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <CategorySelect
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        categoryCounts={totalCount}
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="border-primary dark:border-primary-dark h-8 w-8 animate-spin rounded-full border-b-2 border-t-2"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 ">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark relative overflow-hidden rounded-2xl border shadow-lg transition duration-300 hover:shadow-2xl"
            >
              <img
                onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full cursor-pointer object-cover transition hover:opacity-90"
              />
              <button
                onClick={() => handleFavorite(recipe.recipeId)}
                className={`absolute right-2 top-2 z-10 rounded-full p-2 shadow-md transition-all duration-300 ${isFavorite(recipe.recipeId)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "dark:bg-card dark:hover:bg-muted bg-white text-red-500 hover:bg-red-100"
                  } hover:scale-110`}
              >
                {isFavorite(recipe.recipeId) ? (
                  <FaHeart size={18} />
                ) : (
                  <FaRegHeart size={18} />
                )}
              </button>

              <div className="space-y-2 p-4">
                <h3 className="hover:text-primary dark:hover:text-primary-dark cursor-pointer text-lg font-semibold transition">
                  {recipe.title}
                </h3>

                <RecipeRatingBlock recipeId={recipe.recipeId} />

                <div className="text-muted dark:text-muted-dark text-sm">
                  {recipe.categoryName}
                </div>
                <div className="text-muted dark:text-muted-dark mt-1 flex items-center gap-4 text-sm">
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
      {hasMore && !loading && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => loadMoreRecipes(searchTerm, selectedCategoryId)}
            className="rounded bg-blue-700 px-6 py-2 text-white hover:bg-blue-800 disabled:bg-gray-400"
          >
           Load more
          </button>
        </div>
      )}

    </div>
  );
}
