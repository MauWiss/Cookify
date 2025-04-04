import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path ? "text-blue-400 font-bold" : "text-white";

  return (
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-white">HomeChef 🍳</h1>
      <div className="flex items-center gap-6">
        <Link className={active("/")} to="/">
          Home
        </Link>
        <Link className={active("/auth")} to="/auth">
          Login
        </Link>
        <DarkModeToggle />
      </div>
    </nav>
  );
}
