import { useEffect, useState } from "react";
import { fetchFavorites, removeFavorite, fetchCategories, fetchFavoritesByCategory  } from "../api/api";

export const useFavoritesData = () => {
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const loadFavorites = async (categoryId) => {
    setLoading(true);
    try {
      // בהתאם ל־categoryId נבחר endpoint שונה
      const res = categoryId == null
        ? await fetchFavorites()                             
        : await fetchFavoritesByCategory(categoryId);        
  
      setFavorites(res.data);
      console.log("Loaded favorites for category:", categoryId);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const deleteFavorite = async (recipeId) => {
    await removeFavorite(recipeId);
    setFavorites((prev) => prev.filter((r) => r.recipeId !== recipeId));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    console.log(selectedCategoryId);
    loadFavorites(selectedCategoryId);
   

  }, [selectedCategoryId]);

  return {
    favorites,
    loading,
    categories,
    selectedCategoryId,
    reloadRecipes:loadFavorites,
    setSelectedCategoryId,
    deleteFavorite,
  };
};
