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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // טעינת מתכונים
  const loadRecipes = async (term = "", categoryId = null , pageNumber = 1, append = false) => {
    setLoading(true);
    try {
      const res = await fetchRecipes(term, categoryId, pageNumber);
      const newRecipes = res.data.recipes;
      setTotalCount(res.data.totalCount);

      if (append) {
        setRecipes(prev => [...prev, ...newRecipes]);
      } else {
        setRecipes(newRecipes);
      }

      setHasMore(newRecipes.length === 20); // אם קיבלנו פחות מ-20 - אין עוד
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  // טעינת עמוד הבא
  const loadMoreRecipes = (term = "", categoryId = null) => {

    console.log(page + term + categoryId)
    if (hasMore && !loading) {
      loadRecipes(term, categoryId, page + 1, true);
    }
  };

  // טעינת קטגוריות
  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // טעינת מועדפים
  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetchFavorites();
      setFavorites(res.data.map(fav => fav.recipeId));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  // עיכוב חיפוש
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce((term, catId) => {
    setPage(1);
    setHasMore(true);
    loadRecipes(term, catId, 1, false);
  }, 500);

  useEffect(() => {
    loadCategories();
    loadFavorites();
  }, []);

  return {
    recipes,
    loading,
    error,
    totalCount,
    categories,
    favorites,
    hasMore,
    page,
    setPage,
    reloadFavorites: loadFavorites,
    loadRecipes,
    loadMoreRecipes,
  };
};
