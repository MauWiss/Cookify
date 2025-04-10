import { useEffect, useState } from "react";
import { fetchCategories, fetchMyRecipes, deleteMyRecipe } from "../api/api";

export const useMyRecipesData = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMyRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetchMyRecipes();
      setRecipes(res.data);
    } catch (err) {
      console.error("Failed to fetch my recipes", err);
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

  const removeRecipe = async (recipeId) => {
    await deleteMyRecipe(recipeId);
    setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
  };

  useEffect(() => {
    loadMyRecipes();
    loadCategories();
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchCategory = selectedCategoryId
      ? r.categoryName === selectedCategoryId
      : true;
    const matchSearch = r.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return {
    recipes: filteredRecipes,
    loading,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchTerm,
    setSearchTerm,
    removeRecipe,
    reloadRecipes: loadMyRecipes,
  };
};
