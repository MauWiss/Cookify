import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7019/api",
  // baseURL: "https://homechefserver.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to every request
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

// 🔷 Recipes
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

// 🔷 Categories
export const fetchCategories = () => api.get("/categories");

// 🔷 Favorites
export const fetchFavorites = () => api.get("/Favorites/favorites");
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
export const fetchUserRating = (recipeId) => api.get(`/ratings/${recipeId}/my`);
export const postRating = (recipeId, rating) =>
  api.post(`/ratings/${recipeId}`, { rating });

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
export const updatePassword = (data) =>
  api.put("/userprofile/update-password", data);

export const uploadBase64Image = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/userprofile/upload-picture-base64", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🔷 Auth
// 🔷 Auth
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (userData) => api.post("/auth/register", userData);

export const deleteRecipe = (id) => {
  return api.delete(`/admin/${id}`);  
};

export default api;
