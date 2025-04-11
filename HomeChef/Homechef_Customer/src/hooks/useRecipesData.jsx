import { useState, useEffect } from "react";
import { fetchRecipes, fetchFavorites, fetchCategories } from "../api/api";
import { toast } from "react-toastify";

export const useRecipesData = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // הוספתי עבור חיפוש
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // קטגוריה נבחרת
  const token = localStorage.getItem("token");

  // פונקציה לעיכוב חיפוש (Debounce)
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // פונקציה לטעינת מתכונים
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

  // פונקציה לטעינת המועדפים
  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetchFavorites();
      setFavorites(res.data.map((fav) => fav.recipeId));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  // פונקציה לטעינת הקטגוריות
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // טעינה מחדש של מתכונים ומועדפים בעת שינוי חיפוש או קטגוריה
  useEffect(() => {
    loadCategories();
  }, []);

  // כל פעם שמשתנה חיפוש או קטגוריה, נטען את המתכונים
  const debouncedLoadRecipes = debounce(loadRecipes, 500);

  useEffect(() => {
    if (searchTerm || selectedCategoryId) {
      debouncedLoadRecipes(searchTerm, selectedCategoryId); // חיפוש עם עיכוב
    } else {
      loadRecipes(); // חזרה למצב ברירת המחדל
    }
  }, [searchTerm, selectedCategoryId]);

  useEffect(() => {
    loadFavorites();
  }, [token]); // טעינת מועדפים רק אם יש טוקן

  return {
    recipes,
    loading,
    error,
    categories,
    favorites,
    reloadRecipes: loadRecipes,
    reloadFavorites: loadFavorites,
    setSearchTerm,
    setSelectedCategoryId,
  };
};
