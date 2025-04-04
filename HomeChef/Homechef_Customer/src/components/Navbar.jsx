import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const active = (path) =>
    location.pathname === path ? "text-blue-400 font-bold" : "text-white";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-white">HomeChef 🍽️</h1>
      <div className="space-x-4">
        <Link className={active("/")} to="/">
          Home
        </Link>
        {!token && location.pathname !== "/auth/login" && (
          <Link className={active("/auth/login")} to="/auth/login">
            Login
          </Link>
        )}
        {!token && location.pathname !== "/auth/register" && (
          <Link className={active("/auth/register")} to="/auth/register">
            Register
          </Link>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="text-white transition hover:text-red-400"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
