import axios from "axios"; // ספרייה שמקלה על שליחת בקשות לשרת

// axios.create() מאפשרת לנו להגדיר הגדרות ברירת מחדל לכל הבקשות שנשלחות עם אובייקט זה
const api = axios.create({
  baseURL: "https://localhost:7019/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//מתודה זו מוסיפה טוקן לכל בקשה שנשלחת לשרת, אם יש טוקן ב-localStorage
// זה מאפשר לנו לשלוח את הטוקן עם כל בקשה לשרת, כך שהשרת יכול לזהות את המשתמש
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // אם יש לך Token ב-localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // הוספת הטוקן לכותרת הבקשה
    }
    return config;
  },
  (error) => Promise.reject(error), // אם יש שגיאה בבקשה, מחזירים את השגיאה
);

// 🔷 Recipes
// מתודה זו שולפת מתכונים מהשרת לפי פרמטרים שונים
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
      // שליפת מתכונים לפי מונח חיפוש
      params: {
        term,
        pageNumber,
        pageSize,
      },
    });
  }

  if (categoryId) {
    // שליפת מתכונים לפי קטגוריה
    return api.get(`/categories/${categoryId}/recipes`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
  }

  return api.get("/recipes/paged", {
    // שליפת מתכונים לפי דף
    params: {
      pageNumber,
      pageSize,
    },
  });
};
// שליפת פרופיל של מתכון לפי מזהה
export const fetchRecipeProfile = (recipeId) =>
  api.get(`/recipes/profile/${recipeId}`);

// 🔷 Categories
// שליפת כל הקטגוריות  מתכונים מהשרת
export const fetchCategories = () => api.get("/categories");
//שליפת כל המתכונים ללא גודל מסויים או עמודים
export const fetchAllRecipes = () => api.get("/recipes/all");
// 🔷 Favorites
// שליפת המתכונים המועדפים של המשתמש
export const fetchFavorites = () => api.get(`/Favorites/favorites`);
// שליפת המתכונים המועדפים של המשתמש לפי קטגוריה
export const fetchFavoritesByCategory = (categoryId) =>
  api.get(`/favorites/category/${categoryId}`);
// הוספה של מתכון למועדפים
export const addFavorite = (recipeId) =>
  api.post(`/Favorites/${recipeId}/favorite`, {});
// מחיקת מתכון מהמועדפים
export const removeFavorite = (recipeId) =>
  api.delete(`/Favorites/${recipeId}/favorite`);

// 🔷 Reviews
// שליפת כל הביקורות למתכון לפי מזהה
export const fetchReviews = (recipeId) => api.get(`/reviews/${recipeId}`);
//הוספת ביקורת למתכון
export const addReview = (recipeId, reviewText) =>
  api.post(`/reviews/${recipeId}`, reviewText, {
    headers: { "Content-Type": "application/json" },
  });
//עדכון ביקורת למתכון
export const updateReview = (reviewId, reviewText) =>
  api.put(`/reviews/${reviewId}`, reviewText, {
    headers: { "Content-Type": "application/json" },
  });
//מחיקת ביקורת למתכון
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
  return api.get(`/ratings/${recipeId}/me`);
};

// 🔷 My Recipes
// שליפת המתכונים שלי (של המשתמש המחובר)
export const fetchMyRecipes = () => api.get("/myrecipes/my-recipes");
//מחיקת מתכון שלי (של המשתמש המחובר)
export const deleteMyRecipe = (recipeId) =>
  api.delete(`/myrecipes/${recipeId}`);
//הוספת מתכון שלי (של המשתמש המחובר)
export const addMyRecipe = (recipeData) => api.post("/myrecipes", recipeData);
//עדכון מתכון שלי (של המשתמש המחובר)
export const updateMyRecipe = (recipeId, updatedData) =>
  api.put(`/myrecipes/${recipeId}`, updatedData);

// 🔷 User Profile
// שליפת פרופיל המשתמש המחובר
export const getUserProfile = () => api.get("/userprofile/me");
// עדכון פרופיל המשתמש המחובר- תמונה וביוגרפיה
export const updateUserProfile = (data) => api.put("/userprofile/update", data);
//עדכון תמונת פרופיל בלבד של המשתמש המחובר
export const updateUserProfilePicture = (data) =>
  api.put("/userprofile/update-picture", data);
// עדכון סיסמא של המשתמש המחובר
export const updatePassword = (data) =>
  api.put("/userprofile/change-password", data);

// 🔷 Auth
// התחברות של משתמש קיים
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });
//רישום משתמש חדש
export const registerUser = (userData) => api.post("/auth/register", userData);

// 🔷 Admin
//מחיקת מתכון  על ידי מנהל
export const deleteRecipe = (id) => {
  return api.delete(`/admin/${id}`);
};

//🔷 Ai page
// קבלת תשובה מג'מיני מהשרת לשאלה שנשאלה
export const generateGeminiReply = (message) =>
  api.post("/gemini/chat", message, {
    headers: { "Content-Type": "application/json" },
  });

// קבלת תמונה מ פיקסלס api
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

// 🔷 Trivia
// שליפת שאלות טריוויה מהשרת מגמיני
export const fetchTriviaQuestion = () => api.get("/triviagemini/generate");

// שליחת תוצאות הטריוויה לשרת
export const submitTriviaScore = async (score, userId, correctAnswers) => {
  return await api.post("/TriviaGemini/submit-score", {
    userId,
    score,
    correctAnswers,
  });
};

// שליפת טבלת דירוג של משתמשים ששיחקו בטריוויה
export const fetchLeaderboard = async () => {
  return await api.get("/TriviaGemini/leaderboard");
};

//🔷 World animation
// שליפת מתכונים לפי מדינה (AI + Pexels)
export const fetchRecipesByCountry = async (country) => {
  const res = await api.get(`/worldrecipes/${country}`);
  return res.data;
};

//  שליפת מצרכים ממתכון לפי סיכום, הוראות והגשה לפי ai
export const extractIngredients = async (summary, instructions, servings) => {
  return await api.post("/gemini/extract-ingredients", {
    summary,
    instructions,
    servings,
  });
};

export default api;
