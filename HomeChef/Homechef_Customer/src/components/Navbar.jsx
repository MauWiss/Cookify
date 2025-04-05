// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow dark:bg-gray-800">
      <div className="flex items-center gap-6 text-lg font-semibold">
        <Link
          to="/"
          className="text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        >
          Home
        </Link>
        {isLoggedIn && (
          <Link
            to="/favorites"
            className="text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            Favorites
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="text-gray-700 hover:text-yellow-400 dark:text-white dark:hover:text-yellow-300"
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
