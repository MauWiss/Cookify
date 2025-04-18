import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaClock, FaUtensils, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavoritesData } from "../../hooks/useFavoritesData";
import CategorySelect from "../../components/CategorySelect";
import SearchInput from "../../components/SearchInput";
import { useNavigate } from "react-router-dom";
import RecipeRatingBlock from "../../components/RecipeRatingBlock";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    favorites,
    loading,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    deleteFavorite,
    reloadRecipes,
  } = useFavoritesData();

  const categoryCounts = favorites.length;

  useEffect(() => {
    const delay = setTimeout(() => {
      reloadRecipes(selectedCategoryId);
    }, 500);
    return () => clearTimeout(delay);
  }, [selectedCategoryId]);

  const handleRemoveFavorite = async (recipeId) => {
    const result = await Swal.fire({
      title: "Remove from favorites?",
      text: "Are you sure you want to break up with this recipe? 💔",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteFavorite(recipeId);
      toast.success("Recipe removed from your favorites 💔");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from favorites.");
    }
  };

  const handleNavigate = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const filteredFavorites = favorites.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-background dark:bg-background-dark text-text dark:text-text-dark min-h-screen py-6 sm:px-6 md:px-12 lg:px-48">
      <ToastContainer />

      <h2 className="text-text dark:text-text-dark mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold">
        My Favorite Recipes <FaHeart className="text-red-500" />
      </h2>

      <SearchInput searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <CategorySelect
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        categoryCounts={categoryCounts}
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="border-primary dark:border-primary-dark h-8 w-8 animate-spin rounded-full border-b-2 border-t-2"></div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <p className="text-muted dark:text-muted-dark text-center">
          You haven't added any recipes to your favorites yet.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {filteredFavorites.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark relative overflow-hidden rounded-2xl border shadow-lg transition hover:shadow-2xl"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                onClick={() => handleNavigate(recipe.recipeId)}
                className="h-48 w-full cursor-pointer object-cover transition hover:opacity-90"
              />

              <button
                onClick={() => handleRemoveFavorite(recipe.recipeId)}
                className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-2 text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-red-600"
                title="Remove from favorites"
              >
                <FaHeart size={18} />
              </button>

              <div className="space-y-2 p-4">
                <h3
                  onClick={() => handleNavigate(recipe.recipeId)}
                  className="text-text hover:text-primary dark:text-text-dark dark:hover:text-primary-dark cursor-pointer text-lg font-semibold"
                >
                  {recipe.title}
                </h3>
                <p className="text-muted dark:text-muted-dark text-sm">
                  {recipe.categoryName}
                </p>
                <div className="text-muted dark:text-muted-dark flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FaClock /> {recipe.cookingTime || "?"} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils /> Serves {recipe.servings || "?"}
                  </span>
                </div>
                <RecipeRatingBlock recipeId={recipe.recipeId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
