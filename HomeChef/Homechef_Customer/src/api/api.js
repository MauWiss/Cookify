import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/api",
  // baseURL: "https://homechefserver.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 הוספת טוקן אוטומטית לכל קריאה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export const logoutUser = () => localStorage.removeItem("token");

// 🔷 Recipes API
export const fetchRecipes = (term, categoryId) => {
  if (term?.trim()) {
    return api.get(`/recipes/search?term=${encodeURIComponent(term)}`);
  } else if (categoryId) {
    return api.get(`/categories/${categoryId}/recipes`);
  }
  return api.get("/recipes/paged?pageNumber=1&pageSize=100");
};

export const fetchRecipeProfile = (recipeId) =>
  api.get(`/recipes/profile/${recipeId}`);

// 🔷 Categories API
export const fetchCategories = () => api.get("/categories");

// 🔷 Favorites API
export const fetchFavorites = () => api.get("/Favorites/favorites");
export const addFavorite = (recipeId) =>
  api.post(`/Favorites/${recipeId}/favorite`, {});
export const removeFavorite = (recipeId) =>
  api.delete(`/Favorites/${recipeId}/favorite`);

// 🔷 Reviews API
export const fetchReviews = (recipeId) => api.get(`/reviews/${recipeId}`);
export const addReview = (recipeId, reviewText) =>
  api.post(`/reviews/${recipeId}`, JSON.stringify(reviewText), {
    headers: { "Content-Type": "application/json" },
  });

export const updateReview = (reviewId, reviewText) =>
  api.put(`/reviews/${reviewId}`, { reviewText });
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);

// 🔷 Ratings API
export const fetchUserRating = (recipeId) => api.get(`/ratings/${recipeId}/my`);
export const postRating = (recipeId, rating) =>
  api.post(`/ratings/${recipeId}`, { rating });

// 🔷 My Recipes API
export const fetchMyRecipes = () => api.get("/myrecipes/my-recipes");
export const deleteMyRecipe = (recipeId) =>
  api.delete(`/myrecipes/${recipeId}`);
export const addMyRecipe = (recipeData) => api.post("/myrecipes", recipeData);
export const updateMyRecipe = (recipeId, updatedData) =>
  api.put(`/myrecipes/${recipeId}`, updatedData);

// 🔷 Auth API
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });
export const registerUser = (userData) => api.post("/auth/register", userData);

export default api;
