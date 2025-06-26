// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../pages/Auth/AuthContext";
import { FaBars, FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import { FiMoreVertical } from "react-icons/fi";
import cognitoConfig from "../cognitoConfig";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login: contextLogin, logout } = useAuth();
  const token = user?.idToken;
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const isHomePage = location.pathname === "/";
  const isLoggedOut = !token;

  // raw login redirect
  const login = () => {
    const { domain, clientId, redirectUri, responseType, scope } = cognitoConfig;
    const authUrl =
      `https://${domain}/login?` +
      `response_type=${encodeURIComponent(responseType)}` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  // logout via context
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/auth/login");
  };

  const active = (path) =>
    location.pathname === path
      ? "text-blue-500 font-semibold underline underline-offset-4"
      : "text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400 transition";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative z-50 bg-gray-100 px-6 py-4 shadow-md dark:bg-gray-900">
      <div className="relative flex w-full items-center justify-between">
        {/* Logo */}
        <img
          src="/images/Logo-bowl.png"
          alt="Logo"
          className="h-10 w-auto"
          title="logo"
        />

        {/* Middle Links */}
        <div
          className={`items-center gap-6 text-lg font-medium sm:flex ${
            isLoggedOut ? "ml-auto" : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <Link className={`${active("/")} px-3 font-semibold`} to="/">
            Home
          </Link>

          {token && (
            <>
              <Link
                className={`${active("/favorites")} px-3 font-semibold`}
                to="/favorites"
              >
                <div className="flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  Favorites
                </div>
              </Link>
              <Link
                className={`${active("/my-recipes")} px-3 font-semibold`}
                to="/my-recipes"
              >
                <div className="flex items-center gap-2">
                  <GiCook className="text-orange-500" />
                  My Recipes
                </div>
              </Link>
              <Link
                className={`${active("/chatbot")} px-3 font-semibold`}
                to="/chatbot"
              >
                ChefBot
              </Link>

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 font-semibold"
                >
                  More {moreOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {moreOpen && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    <Link
                      to="/trivia"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🧠 Trivia Game
                    </Link>
                    <Link
                      to="/worldrecipes"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🌍 World Recipes
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {!token && (
            <>
              <button onClick={login} className="px-3 font-semibold text-blue-600">
                התחברות
              </button>
              <Link className={`${active("/auth/register")} px-3`} to="/auth/register">
                Register
              </Link>
              <button
                onClick={() => setDark((d) => !d)}
                className="flex items-center gap-2 px-3"
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
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {token && (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-700 dark:text-white">
                  {user?.username}
                </span>
                <img
                  src={user?.profileImage || "/images/default-avatar.jpg"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-500"
                />
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600"
              >
                Logout
              </button>
              <button
                className="sm:hidden"
                onClick={() => setMenuOpen((m) => !m)}
              >
                <FaBars size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 sm:hidden">
          <Link className={active("/")} to="/">
            Home
          </Link>
          {token ? (
            <>
              <Link className={active("/favorites")} to="/favorites">
                Favorites
              </Link>
              <Link className={active("/my-recipes")} to="/my-recipes">
                My Recipes
              </Link>
              <Link className={active("/chatbot")} to="/chatbot">
                ChefBot
              </Link>
              <Link className={active("/trivia")} to="/trivia">
                Trivia
              </Link>
              <Link className={active("/worldrecipes")} to="/worldrecipes">
                World Recipes
              </Link>
              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={login}>Login</button>
              <Link className={active("/auth/register")} to="/auth/register">
                Register
              </Link>
            </>
          )}
          <button onClick={() => setDark((d) => !d)}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      )}
    </nav>
  );
}
