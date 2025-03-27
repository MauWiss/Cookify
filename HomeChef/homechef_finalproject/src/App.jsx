import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Meal from "./pages/Meal";
import Favorites from "./pages/Favorites";
import MyRecipes from "./pages/MyRecipes";
import Cooks from "./pages/Cooks";
import NotFound from "./pages/NotFound";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark") === "true",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/recipe/:id" element={<Meal />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/cooks" element={<Cooks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
