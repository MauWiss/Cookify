import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const active = (path) =>
    location.pathname === path
      ? "text-blue-400 font-bold underline underline-offset-4"
      : "text-white hover:text-blue-300 transition";

  return (
    <nav className="flex items-center justify-between bg-gray-200 px-6 py-3 shadow-md dark:bg-gray-800">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        HomeChef 🍳
      </h1>

      {/* Links & Actions */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link className={active("/")} to="/">
          Home
        </Link>

        {token && (
          <Link className={active("/favorites")} to="/favorites">
            <div className="flex items-center gap-1">
              <FaHeart className="text-red-500" />
              My Favorites
            </div>
          </Link>
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
            className="rounded-md bg-red-600 px-3 py-1.5 text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        )}

        <button
          onClick={() => setDark((prev) => !prev)}
          className="text-gray-800 transition hover:text-yellow-400 dark:text-white"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
