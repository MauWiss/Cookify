import { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Welcome back!");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      toast.error("Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4 py-16">
      <ToastContainer />
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-center text-3xl font-bold dark:text-white">
          Login to HomeChef
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-3 dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-3 dark:bg-gray-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/auth/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
