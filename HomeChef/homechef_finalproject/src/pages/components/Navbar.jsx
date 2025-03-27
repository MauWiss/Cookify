import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sun, Moon, Home, ChefHat } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("theme") === "dark";
    setDarkMode(storedMode);
    document.documentElement.classList.toggle("dark", storedMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const linkStyle =
    "text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-cyan-400 transition";

  return (
    <nav className="bg-white px-6 py-4 shadow dark:bg-[#0e1a23]">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white"
        >
          <Home className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
          <ChefHat className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
          HomeChef
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/add-recipe" className={linkStyle}>
            Add Recipe
          </NavLink>
          <NavLink to="/favorites" className={linkStyle}>
            Favorites
          </NavLink>
          <NavLink to="/my-recipes" className={linkStyle}>
            My Recipes
          </NavLink>
          <NavLink to="/cooks" className={linkStyle}>
            Cooks
          </NavLink>
          <NavLink to="/login" className={linkStyle}>
            Login
          </NavLink>
          <button onClick={toggleTheme} className="text-xl">
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
