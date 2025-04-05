import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FavoritesPage from "./pages/PrivateUserPages/FavoritesPage";
import MyRecipesPage from "./pages/PrivateUserPages/MyRecipes/MyRecipesPage";
import AddRecipePage from "./pages/PrivateUserPages/MyRecipes/AddRecipePage";
import EditRecipePage from "./pages/PrivateUserPages/MyRecipes/EditRecipePage";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
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
          path="/my-recipes/add"
          element={
            <PrivateRoute>
              <AddRecipePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-recipes/edit/:id"
          element={
            <PrivateRoute>
              <EditRecipePage />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="flex h-[70vh] items-center justify-center text-2xl font-semibold">
              404 - Page Not Found 🚫
            </div>
          }
        />
      </Routes>
    </div>
  );
}
