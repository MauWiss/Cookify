import { useState, useEffect } from "react";
import { fetchRecipes, fetchFavorites, fetchCategories } from "../api/api";
import { toast } from "react-toastify";

export const useRecipesData = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  const loadRecipes = async (term = "", categoryId = null) => {
    setLoading(true);
    try {
      const res = await fetchRecipes(term, categoryId);
      setRecipes(res.data);
      if (term && res.data.length === 0) {
        toast.info("No recipes found 🍽️");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetchFavorites();
      setFavorites(res.data.map((fav) => fav.recipeId));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
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

  useEffect(() => {
    loadCategories();
    loadRecipes();
    loadFavorites();
  }, []);

  return {
    recipes,
    loading,
    error,
    categories,
    favorites,
    reloadRecipes: loadRecipes,
    reloadFavorites: loadFavorites,
  };
};
