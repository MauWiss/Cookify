import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      toast.success("Logged in successfully!");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
}
