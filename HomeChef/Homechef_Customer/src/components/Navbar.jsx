import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
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
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-white">HomeChef 🍳</h1>
      <div className="flex items-center space-x-4">
        <Link className={active("/")} to="/">
          Home
        </Link>

        {token && (
          <Link className={active("/favorites")} to="/favorites">
            <div className="flex items-center gap-1">
              <FaHeart className="text-red-500" /> My Favorites
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
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        )}

        <button
          onClick={() => setDark(!dark)}
          className="text-white transition hover:text-yellow-300"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
