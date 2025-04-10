import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FavoritesPage from "./pages/PrivateUserPages/FavoritesPage";
import MyRecipesPage from "./pages/PrivateUserPages/MyRecipesPage";
import PrivateRoute from "./components/PrivateRoute";
import useNotifications from "./hooks/useNotifications";
import RecipeProfilePage from "./pages/RecipeProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./pages/Auth/AuthContext";

export default function App() {
  useNotifications(); // optional: handles SignalR or real-time

  return (
    <AuthProvider>
      <ToastContainer position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes/:id" element={<RecipeProfilePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

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
      </Routes>
    </AuthProvider>
  );
}
