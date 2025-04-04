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
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Logged in successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <ToastContainer />
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl dark:bg-gray-900 dark:text-white">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Welcome Back{" "}
          <span className="animate-waving-hand inline-block">👋</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
