import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FavoritesPage from "./pages/PrivateUserPages/FavoritesPage";
import MyRecipesPage from "./pages/PrivateUserPages/MyRecipesPage";
import PrivateRoute from "./components/PrivateRoute";
import RecipeProfilePage from "./pages/RecipeProfilePage";
import AdminPage from "./pages/AdminPage";
import UserProfilePage from "./pages/PrivateUserPages/UserProfilePage";
import { AuthProvider } from "./pages/Auth/AuthContext";
import RecipeChatBot from "./pages/ChefBot";
import TriviaGame from "./pages/TriviaGame";
import LeaderboardPage from "./pages/LeaderboardPage";
import WorldRecipes from "./pages/WorldMapPage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  }); // Initialize dark mode based on localStorage

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-text transition-colors duration-300 dark:bg-background-dark dark:text-text-dark">
        <Navbar
          toggleDark={() => setIsDarkMode(!isDarkMode)}
          isDark={isDarkMode}
        />{" "}
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/recipes/:id" element={<RecipeProfilePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
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
        </Routes>
      </div>
    </AuthProvider>
  );
}
