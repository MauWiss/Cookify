import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sun, Moon, Home } from "lucide-react";

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
    "text-[#2E2E2E] dark:text-[#EAEAEA] hover:text-[#F38E82] dark:hover:text-[#F38E82] transition-colors font-medium";

  return (
    <nav className="bg-[#FAFAFA] px-6 py-4 shadow-md dark:bg-[#1B1B1B]">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#2E2E2E] dark:text-[#EAEAEA]"
        >
          <Home className="h-6 w-6 text-[#F38E82]" />
          <span className="text-3xl">👨‍🍳</span>
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

          <button
            onClick={toggleTheme}
            className="text-[#F38E82] transition-colors duration-300"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="text-yellow-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="text-gray-400 transition-transform hover:rotate-45" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
