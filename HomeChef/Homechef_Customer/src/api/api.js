import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// אוטומטית מצרף את ה-token לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // אם יש לך Token ב-localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 🔷 Recipes
export const fetchRecipes = (
  term,
  categoryId,
  pageNumber = 1,
  pageSize = 20,
) => {
  console.log("term =", term, "| typeof =", typeof term);
  term = typeof term === "string" ? term : "";

  if (term.trim()) {
    return api.get(`/recipes/search`, {
      params: {
        term,
        pageNumber,
        pageSize,
      },
    });
  }

  if (categoryId) {
    return api.get(`/categories/${categoryId}/recipes`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
  }

  return api.get("/recipes/paged", {
    params: {
      pageNumber,
      pageSize,
    },
  });
};

export const fetchRecipeProfile = (recipeId) =>
  api.get(`/recipes/profile/${recipeId}`);

// 🔷 Categories
export const fetchCategories = () => api.get("/categories");
export const fetchAllRecipes = () => api.get("/recipes/all"); // שליפה של כל המתכונים

// 🔷 Favorites
export const fetchFavorites = () => api.get(`/Favorites/favorites`);
// api/api.js
export const fetchFavoritesByCategory = (categoryId) => api.get(`/favorites/category/${categoryId}`);
export const addFavorite = (recipeId) =>
  api.post(`/Favorites/${recipeId}/favorite`, {});
export const removeFavorite = (recipeId) =>
  api.delete(`/Favorites/${recipeId}/favorite`);

// 🔷 Reviews
export const fetchReviews = (recipeId) => api.get(`/reviews/${recipeId}`);
export const addReview = (recipeId, reviewText) =>
  api.post(`/reviews/${recipeId}`, reviewText, {
    headers: { "Content-Type": "application/json" },
  });
export const updateReview = (reviewId, reviewText) =>
  api.put(`/reviews/${reviewId}`, reviewText, {
    headers: { "Content-Type": "application/json" },
  });
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
// 🔷 Ratings
// הוספת דירוג למתכון
export const postRating = (recipeId, rating) => {
  return api.post(`/ratings`, { recipeId, rating });
};

// עדכון דירוג למתכון
export const updateRating = (recipeId, rating) => {
  return api.put(`/ratings`, { recipeId, rating });
};

// מחיקת דירוג למתכון
export const deleteRating = (recipeId) => {
  return api.delete(`/ratings`, { data: { recipeId } });
};

// שליפת דירוג ממוצע ומספר הדירוגים של מתכון
export const getRatingDetails = (recipeId) => {
  return api.get(`/ratings/${recipeId}`);
};

// שליפת דירוג המשתמש עבור מתכון ספציפי
export const fetchUserRating = (recipeId) => {
  return api.get(`/ratings/${recipeId}/my`);
};

// 🔷 My Recipes
export const fetchMyRecipes = () => api.get("/myrecipes/my-recipes");
export const deleteMyRecipe = (recipeId) =>
  api.delete(`/myrecipes/${recipeId}`);
export const addMyRecipe = (recipeData) => api.post("/myrecipes", recipeData);
export const updateMyRecipe = (recipeId, updatedData) =>
  api.put(`/myrecipes/${recipeId}`, updatedData);

// 🔷 User Profile
export const getUserProfile = () => api.get("/userprofile/me");
export const updateUserProfile = (data) => api.put("/userprofile/update", data);
export const updateUserProfilePicture = (data) =>
  api.put("/userprofile/update-picture", data);

export const updatePassword = (data) =>
  api.put("/userprofile/change-password", data);

// 🔷 Auth
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (userData) => api.post("/auth/register", userData);

export const deleteRecipe = (id) => {
  return api.delete(`/admin/${id}`);
};
// Ai page
export const generateGeminiReply = (message) =>
  api.post("/gemini/chat", message, {
    headers: { "Content-Type": "application/json" },
  });
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

// שליחת ניקוד
export const submitTriviaScore = async (score, userId, correctAnswers) => {
  return await api.post("/TriviaGemini/submit-score", {
    userId,
    score,
    correctAnswers,
  });
};

// שליפת טבלת דירוג
export const fetchLeaderboard = async () => {
  return await api.get("/TriviaGemini/leaderboard");
};
// שליפת מתכונים לפי מדינה (AI + Pexels)
export const fetchRecipesByCountry = async (country) => {
  const res = await api.get(`/worldrecipes/${country}`);
  return res.data;
};

export default api;
