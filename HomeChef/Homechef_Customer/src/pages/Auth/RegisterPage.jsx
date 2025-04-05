import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        passwordHash: password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Registered successfully! 🍳");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4 py-16">
      <ToastContainer />
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Create Account 🍳
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="chefmaster"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
