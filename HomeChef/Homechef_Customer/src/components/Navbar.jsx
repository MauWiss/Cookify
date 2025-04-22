import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../pages/Auth/AuthContext";
import { FaBars, FaHeart } from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, role, user } = useAuth();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const [open, setOpen] = useState(false);
  const isHomePage = location.pathname === "/";
  const isLoggedOut = !token;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    console.log("profilePictureBase64:", user?.profileImage);
  }, [dark]);

  useEffect(() => {
    console.log("user in navbar:", user);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    console.log(user);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDefaultImage = () => {
    if (user?.gender === "male") return "/images/avatar-male.png";
    if (user?.gender === "female") return "/images/avatar-female.png";
    return "/images/avatar-default.png";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/auth/login");
  };

  const active = (path) =>
    location.pathname === path
      ? "text-blue-500 font-semibold underline underline-offset-4"
      : "text-gray-800 hover:text-blue-500 dark:text-white dark:hover:text-blue-400 transition";

  return (
    <nav className="relative z-50 bg-gray-100 px-6 py-4 shadow-md dark:bg-gray-900">
      <div className="relative flex w-full items-center justify-between">
        {/* Logo */}
        <img
          src="/cgroup82/tar1/images/Logo-bowl.png"
          alt="Logo"
          className="h-10 w-auto"
          title="logo"
        />

        {/* Middle Links */}
        <div
          className={`items-center gap-6 text-lg font-medium sm:flex ${
            isLoggedOut
              ? "ml-auto"
              : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <Link
            className={`${active("/")} no-underlinetransition px-3" transform font-semibold duration-300 ease-in-out hover:scale-105 hover:text-blue-600`}
            to="/"
          >
            Home
          </Link>
          {token && (
            <>
              <Link
                className={`${active("/favorites")} transform px-3 font-semibold no-underline transition duration-300 ease-in-out hover:scale-105 hover:text-blue-600`}
                to="/favorites"
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <FaHeart className="text-red-500" />
                  Favorites
                </div>
              </Link>
              <Link
                className={`${active("/my-recipes")} transform px-3 font-semibold no-underline transition duration-300 ease-in-out hover:scale-105 hover:text-blue-600`}
                to="/my-recipes"
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <GiCook className="text-orange-500" />
                  My Recipes
                </div>
              </Link>
              <Link
                className={`${active("/chatbot")} transform px-3 font-semibold no-underline transition duration-300 ease-in-out hover:scale-105 hover:text-blue-600`}
                to="/chatbot"
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  ChefBot
                </div>
              </Link>

              {/* More Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex transform items-center gap-2 whitespace-nowrap px-3 font-semibold transition duration-300 ease-in-out hover:scale-105 hover:text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  More
                  <span className="flex cursor-pointer items-center">
                    {open ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>
                {open && (
                  <div className="absolute z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                    <Link
                      to="/trivia"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      🧠 Trivia Game
                    </Link>
                    <Link
                      to="/worldrecipes"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
              <Link
                className={`${active("/auth/login")} no-underline`}
                to="/auth/login"
              >
                Login
              </Link>
              <Link
                className={`${active("/auth/register")} no-underline`}
                to="/auth/register"
              >
                Register
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
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Right side */}
          {token && (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="group flex items-center gap-2">
                <span className="duration-400 text-lg font-bold text-gray-700 transition-all group-hover:scale-110 group-hover:text-yellow-700 dark:text-white">
                  {user?.username}
                </span>
                <img
                  src={
                    user?.profileImage &&
                    user.profileImage.trim() !== "" &&
                    user.profileImage !== "data:image/jpeg;base64,"
                      ? user.profileImage
                      : getDefaultImage()
                  }
                  alt="Profile"
                  className="h-12 w-12 rounded-full border-4 border-transparent transition-all duration-300 hover:border-blue-500"
                />
              </Link>

              <button
                className="text-gray-700 dark:text-white sm:hidden"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <FaBars size={24} />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  <FiMoreVertical className="cursor-pointer text-2xl" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
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
                    {role === "admin" && (
                      <Link
                        className={`${active("/admin")} flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 no-underline hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                        to="/admin"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700">
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 text-lg font-medium sm:hidden">
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
                <div className="flex items-center gap-2 whitespace-nowrap text-base">
                  Favorites <FaHeart className="text-red-500" />
                </div>
              </Link>
              <Link className={active("/my-recipes")} to="/my-recipes">
                <div className="flex items-center gap-2 whitespace-nowrap text-base">
                  My Recipes <GiCook className="text-orange-500" />
                </div>
              </Link>
              <Link className={active("/chatbot")} to="/chatbot">
                <div className="flex items-center gap-2 whitespace-nowrap text-base">
                  ChefBot 🤖
                </div>
              </Link>
              <Link className={active("/trivia")} to="/trivia">
                <div className="flex items-center gap-2 whitespace-nowrap text-base">
                  Trivia Game 🧠
                </div>
              </Link>
              <Link className={active("/worldrecipes")} to="/worldrecipes">
                <div className="flex items-center gap-2 whitespace-nowrap text-base">
                  National Dish 🌍
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
          <button
            onClick={() => setDark((prev) => !prev)}
            className="text-gray-700 dark:text-white"
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          {token && (
            <div className="flex flex-col gap-2 border-t border-gray-300 pt-3">
              <div className="flex items-center gap-3 px-4">
                <img
                  src={
                    user?.profileImage ||
                    "/cgroup82/tar1/images/female-chef-avatar-icon-vector-32095494.jpg"
                  }
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
