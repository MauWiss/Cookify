/* ──────────────────────────────────────────────────────────
   src/api/api.js
   – single axios helper shared by the whole React app
   ────────────────────────────────────────────────────────── */
import axios from "axios";

/* ------------------------------------------------------------------
      base axios instance
      ------------------------------------------------------------------ */
const api = axios.create({
  baseURL: "http://194.90.158.74/cgroup82/prod/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* attach JWT token to every outgoing request (if one exists) */
api.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (error) => Promise.reject(error),
);

/* =========================================================
      NEW ► tiny helpers required by RecipeWizard / Ingredient auto‑complete
      ========================================================= */
/* 🔸 INGREDIENTS -------------------------------------------------- */
export const searchIngredients = (query) =>
  api.get("/ingredients/search", { params: { query } });

export const createIngredient = (name) => api.post("/ingredients", { name });

/* 🔸 MY RECIPES (full CRUD) --------------------------------------- */
export const fetchMyRecipes = () => api.get("/myrecipes/my-recipes");
export const getMyRecipeById = (id) => api.get(`/myrecipes/${id}`);
export const addMyRecipeV2 = (data) => api.post("/myrecipes/add", data);
export const updateMyRecipeV2 = (data) => api.put("/myrecipes/update", data);
export const deleteMyRecipe = (id) => api.delete(`/myrecipes/${id}`);

/* ----------------------------------------------------------------
      Everything below is 100 % identical to the code you posted
      (only wrapped in one file so nothing is lost).
      ---------------------------------------------------------------- */

/* =========================================================
      1.  RECIPES
      ========================================================= */
export const fetchRecipes = (
  term,
  categoryId,
  pageNumber = 1,
  pageSize = 20,
) => {
  term = typeof term === "string" ? term.trim() : "";
  if (term) {
    return api.get("/recipes/search", {
      params: { term, pageNumber, pageSize },
    });
  }
  if (categoryId) {
    return api.get(`/categories/${categoryId}/recipes`, {
      params: { pageNumber, pageSize },
    });
  }
  return api.get("/recipes/paged", { params: { pageNumber, pageSize } });
};

export const fetchRecipeProfile = (recipeId) =>
  api.get(`/recipes/profile/${recipeId}`);

/* =========================================================
      2.  CATEGORIES
      ========================================================= */
export const fetchCategories = () => api.get("/categories");
export const fetchAllRecipes = () => api.get("/recipes/all");

/* =========================================================
      3.  FAVORITES
      ========================================================= */
export const fetchFavorites = () => api.get("/Favorites/favorites");
export const fetchFavoritesByCategory = (categoryId) =>
  api.get(`/favorites/category/${categoryId}`);
export const addFavorite = (recipeId) =>
  api.post(`/Favorites/${recipeId}/favorite`, {});
export const removeFavorite = (recipeId) =>
  api.delete(`/Favorites/${recipeId}/favorite`);

/* =========================================================
      4.  REVIEWS
      ========================================================= */
export const fetchReviews = (recipeId) => api.get(`/reviews/${recipeId}`);
export const addReview = (recipeId, text) =>
  api.post(`/reviews/${recipeId}`, text);
export const updateReview = (reviewId, text) =>
  api.put(`/reviews/${reviewId}`, text);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);

/* =========================================================
      5.  RATINGS
      ========================================================= */
export const postRating = (recipeId, rating) =>
  api.post("/ratings", { recipeId, rating });
export const updateRating = (recipeId, rating) =>
  api.put("/ratings", { recipeId, rating });
export const deleteRating = (recipeId) =>
  api.delete("/ratings", { data: { recipeId } });
export const getRatingDetails = (recipeId) => api.get(`/ratings/${recipeId}`);
export const fetchUserRating = (recipeId) => api.get(`/ratings/${recipeId}/me`);

/* =========================================================
      6.  (legacy) MY RECIPES helpers – kept for backward compatibility
      ========================================================= */
// original versions (pointing at old endpoints) – kept unchanged
export const addMyRecipe = (recipeData) => api.post("/myrecipes", recipeData);
export const updateMyRecipe = (recipeId, updatedData) =>
  api.put(`/myrecipes/${recipeId}`, updatedData);

/* =========================================================
      7.  USER PROFILE
      ========================================================= */
export const getUserProfile = () => api.get("/userprofile/me");
export const updateUserProfile = (data) => api.put("/userprofile/update", data);
export const updateUserProfilePicture = (data) =>
  api.put("/userprofile/update-picture", data);
export const updatePassword = (data) =>
  api.put("/userprofile/change-password", data);

/* =========================================================
      8.  AUTH
      ========================================================= */
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });
export const registerUser = (userData) => api.post("/auth/register", userData);

/* =========================================================
      9.  ADMIN
      ========================================================= */
export const deleteRecipe = (id) => api.delete(`/admin/${id}`);

/* =========================================================
     10.  AI  / TRIVIA  /  WORLD  (unchanged)
      ========================================================= */
// Gemini chat
export const generateGeminiReply = (message) =>
  api.post("/gemini/chat", message);

// Pexels proxy
export const fetchPexelsImage = async (query) => {
  try {
    const res = await api.get(
      `/gemini/search?query=${encodeURIComponent(query)}`,
    );
    return res.data.imageUrl;
  } catch (err) {
    console.error("❌ Failed to fetch image from Pexels:", err);
    return null;
  }
};

// Trivia
export const fetchTriviaQuestion = () => api.get("/triviagemini/generate");
export const submitTriviaScore = (score, userId, correctAnswers) =>
  api.post("/TriviaGemini/submit-score", { userId, score, correctAnswers });
export const fetchLeaderboard = () => api.get("/TriviaGemini/leaderboard");

// World‑recipes animation
export const fetchRecipesByCountry = (country) =>
  api.get(`/worldrecipes/${country}`).then((r) => r.data);

// AI helper – extract ingredients
export const extractIngredients = (summary, instructions, servings) =>
  api.post("/gemini/extract-ingredients", { summary, instructions, servings });

/* ------------------------------------------------------------------
      export axios instance as default so components can still call
      api.get(...) / api.post(...) directly (as RecipeWizard does)
      ------------------------------------------------------------------ */
export default api;
