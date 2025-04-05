import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage"; // ✅ ייבוא שהחסר

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      {/* טיפ: אפשר לשדרג פה את רקע הדף לפי dark mode בעתיד */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

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
