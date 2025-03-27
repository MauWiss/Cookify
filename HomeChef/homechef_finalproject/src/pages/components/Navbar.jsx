import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="flex items-center justify-between bg-gray-200 p-4 dark:bg-gray-800">
      <h1 className="text-xl font-bold">HomeChef</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/add-recipe">Add Recipe</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/my-recipes">My Recipes</Link>
        <Link to="/cooks">Cooks</Link>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="rounded bg-gray-300 px-2 py-1 dark:bg-gray-700"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
};

export default Navbar;
