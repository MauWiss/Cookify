import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../pages/Auth/AuthContext";
import { FaClock, FaUtensils, FaHeart, FaRegHeart } from "react-icons/fa";
import { GiCook } from "react-icons/gi";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, role, user } = useAuth();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  // Sync dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Logout action
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/auth/login");
  };

  // Highlight active page
  const active = (path) =>
    location.pathname === path
      ? "text-blue-500 font-semibold underline underline-offset-4"
      : "text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400 transition";

  return (
    <nav className="flex flex-wrap items-center justify-between bg-gray-100 px-6 py-4 shadow-md dark:bg-gray-900">
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">
        HomeChef 🍳
      </h1>

      {/* Links */}
      <div className="flex flex-wrap items-center gap-6 text-lg font-medium">
        <Link className={active("/")} to="/">
          Home
        </Link>

        {token && role === "admin" && (
          <Link to="/admin" className="text-yellow-400">
            Admin Panel
          </Link>
        )}

        

        {token && (
          <>
            <Link className={active("/favorites")} to="/favorites">
              <div className="flex items-center gap-2">
                Favorites <FaHeart className="text-red-500" />
              </div>
            </Link>
            <Link className={active("/my-recipes")} to="/my-recipes">
              <div className="flex items-center gap-2">
                My Recipes <GiCook className="text-orange-500" />
              </div>
            </Link>
          </>
        )}

        {!token ? (
          <>
            <Link className={active("/auth/login")} to="/auth/login">
              Login
            </Link>
            <Link className={active("/auth/register")} to="/auth/register">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            title="Logout"
            className="group relative flex items-center justify-center rounded-full bg-red-600 p-2 transition hover:bg-red-700"
          >
            <LogOut className="h-5 w-5 text-white transition group-hover:scale-110" />
            <span className="absolute -bottom-7 scale-0 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
              Logout
            </span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark((prev) => !prev)}
          className="text-gray-700 transition hover:text-yellow-400 dark:text-white"
          title="Toggle Dark Mode"
        >
          {dark ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* ✅ קישור לפרופיל */}
        {token && (
          <Link className={active("/profile")} to="/profile">
            <div className="flex items-center gap-2">
              
              <img
                src= {user.profileImage}
                alt="Avatar"
                className="h-6 w-6 rounded-full border border-gray-300"
              />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
