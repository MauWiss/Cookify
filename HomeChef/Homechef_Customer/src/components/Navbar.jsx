import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const active = (path) =>
    location.pathname === path ? "text-blue-500 font-bold" : "text-white";

  return (
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-white">HomeChef 🍳</h1>
      <div className="flex items-center space-x-4">
        <Link className={active("/")} to="/">
          Home
        </Link>
        <Link className={active("/auth/login")} to="/auth/login">
          Login
        </Link>
        <Link className={active("/auth/register")} to="/auth/register">
          Register
        </Link>
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
