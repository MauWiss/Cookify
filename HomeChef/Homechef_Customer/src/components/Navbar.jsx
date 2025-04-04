import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

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
    location.pathname === path ? "text-blue-500 font-bold" : "text-white";

  return (
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-white">HomeChef 🍳</h1>
      <div className="flex items-center space-x-4">
        <Link className={active("/")} to="/">
          Home
        </Link>

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
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        )}

        <button
          onClick={() => setDark(!dark)}
          className="text-white transition hover:scale-110"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
