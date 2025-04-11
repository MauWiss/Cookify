import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
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

export default function App() {
  return (
    <AuthProvider>
      <Navbar />

      {/* App Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes/:id" element={<RecipeProfilePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* 🔒 Protected Routes */}
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
      </Routes>
    </AuthProvider>
  );
}
