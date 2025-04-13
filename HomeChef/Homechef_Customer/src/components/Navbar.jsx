import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../pages/Auth/AuthContext";
import { FaBars, FaHeart } from "react-icons/fa";
import { GiCook } from "react-icons/gi";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, role, user } = useAuth();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/auth/login");
  };

  const active = (path) =>
    location.pathname === path
      ? "text-text dark:text-text-dark font-semibold"
      : "text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark transition";

  return (
    <nav className="relative z-50 border-b border-[#d1d5db] bg-[#e5e7eb] px-6 py-4 shadow-sm transition-colors duration-300 dark:border-[#2c2c2c] dark:bg-[#1c1d1f]">
      <div className="flex items-center justify-between">
        <h1 className="text-text dark:text-text-dark text-2xl font-bold tracking-wide">
          HomeChef 🍳
        </h1>

        <button
          className="text-text dark:text-text-dark sm:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaBars size={24} />
        </button>

        <div className="hidden items-center gap-6 text-lg font-medium sm:flex">
          <Link className={active("/")} to="/">
            <div className="flex items-center gap-2">Home 🏠</div>
          </Link>

          {token && role === "admin" && (
            <Link className="flex items-center gap-2" to="/admin">
              Admin Panel 🛠️
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
          {!token && (
            <>
              <Link className={active("/auth/login")} to="/auth/login">
                Login
              </Link>
              <Link className={active("/auth/register")} to="/auth/register">
                Register
              </Link>
            </>
          )}
        </div>

        {token && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <img
                src={user?.profileImage || "/default-avatar.png"}
                alt="Avatar"
                className="h-8 w-8 rounded-full border border-gray-300"
              />
              <span className="text-text dark:text-text-dark text-sm">
                {user?.username}
              </span>
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                <Link
                  to="/profile"
                  className="text-text dark:text-text-dark hover:bg-muted dark:hover:bg-muted-dark block px-4 py-2 text-sm"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => setDark((prev) => !prev)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  {dark ? (
                    <>
                      Light <Sun size={20} />
                    </>
                  ) : (
                    <>
                      Dark <Moon size={20} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 text-lg font-medium sm:hidden">
          <Link className={active("/")} to="/">
            <div className="flex items-center gap-2">Home 🏠</div>
          </Link>
          {token && role === "admin" && (
            <Link className="flex items-center gap-2" to="/admin">
              Admin Panel 🛠️
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
              className="px-4 py-2 text-left text-red-600 hover:underline"
            >
              Logout
            </button>
          )}

          {token && (
            <div className="flex flex-col gap-2 border-t border-gray-300 pt-3">
              <div className="flex items-center gap-3 px-4">
                <img
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full border border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-white">
                  {user?.username}
                </span>
              </div>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={() => setDark((prev) => !prev)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                {dark ? (
                  <>
                    Light <Sun size={22} />
                  </>
                ) : (
                  <>
                    Dark <Moon size={22} />
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
