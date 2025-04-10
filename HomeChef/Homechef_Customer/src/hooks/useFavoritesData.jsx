import { useEffect, useState } from "react";
import { fetchFavorites, removeFavorite, fetchCategories } from "../api/api";

export const useFavoritesData = () => {
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const loadFavorites = async (categoryId = null) => {
    setLoading(true);
    try {
      const res = await fetchFavorites(categoryId);
      setFavorites(res.data);
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
    loadFavorites(selectedCategoryId);
  }, [selectedCategoryId]);

  return {
    favorites,
    loading,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    deleteFavorite,
  };
};
