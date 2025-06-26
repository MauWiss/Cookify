// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/Auth/AuthContext";

import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FavoritesPage from "./pages/PrivateUserPages/FavoritesPage";
import MyRecipesPage from "./pages/PrivateUserPages/MyRecipesPage";
import RecipeProfilePage from "./pages/RecipeProfilePage";
import AdminPage from "./pages/AdminPage";
import UserProfilePage from "./pages/PrivateUserPages/UserProfilePage";
import RecipeChatBot from "./pages/ChefBot";
import TriviaGame from "./pages/TriviaGame";
import LeaderboardPage from "./pages/LeaderboardPage";
import WorldRecipes from "./pages/WorldMapPage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InnerApp() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // קומפוננטת PrivateRoute פנימית
  const PrivateRoute = ({ children }) =>
    isAuthenticated ? (
      children
    ) : (
      <Navigate to="/auth/login" replace />
    );

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300 dark:bg-background-dark dark:text-text-dark">
      <Navbar
        toggleDark={() => setIsDarkMode((d) => !d)}
        isDark={isDarkMode}
      />

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes/:id" element={<RecipeProfilePage />} />

        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <PrivateRoute>
              <MyRecipesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <RecipeChatBot />
            </PrivateRoute>
          }
        />
        <Route
          path="/trivia"
          element={
            <PrivateRoute>
              <TriviaGame />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/worldrecipes"
          element={
            <PrivateRoute>
              <WorldRecipes />
            </PrivateRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
