import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import Favorites from "./pages/Favorites";
import MyRecipes from "./pages/MyRecipes";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Meal from "./pages/Meal";
import Cooks from "./pages/Cooks";
import NotFound from "./pages/NotFound";
import Navbar from "./pages/components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800 dark:bg-[#0c1f2d] dark:text-white">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 py-6">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="/meal/:id" element={<Meal />} />
            <Route path="/cooks" element={<Cooks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
