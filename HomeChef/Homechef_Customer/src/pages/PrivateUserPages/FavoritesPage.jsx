import { useState } from "react";
import Swal from "sweetalert2";
import { FaClock, FaUtensils, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavoritesData } from "../../hooks/useFavoritesData";
import CategorySelect from "../../components/CategorySelect";
import SearchInput from "../../components/SearchInput";
import { useNavigate } from "react-router-dom";

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
  } = useFavoritesData();

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
    <div className="min-h-screen bg-white px-6 py-8 dark:bg-gray-900">
      <ToastContainer />

      <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-gray-800 dark:text-white">
        My Favorite Recipes <FaHeart className="text-red-500" />
      </h2>

      <SearchInput searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <CategorySelect
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          You haven't added any recipes to your favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredFavorites.map((recipe) => (
            <div
              key={recipe.recipeId}
              className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-lg transition hover:shadow-2xl dark:bg-gray-800"
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
                  className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-500 dark:text-white"
                >
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.categoryName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
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
