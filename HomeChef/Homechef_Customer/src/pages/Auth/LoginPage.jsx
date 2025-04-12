// src/pages/Auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../api/api";
import { useAuth } from "./AuthContext";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import api from "../../api/api";
import LoginWithGoogle from "../../components/LoginWithGoogle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      const res = await loginUser(email, password);
      login(res.data.token, res.data.user.role);// 💡 עדכון ה־context
      toast.success("Welcome back!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Incorrect email or password. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await api.post(
        "/auth/google",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      login(res.data.token, res.data.user.role); 
      toast.success("Logged in with Google!");
      setTimeout(() => navigate("/"), 1500);
      console.log(res.data.user.role);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16 dark:bg-gray-900">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 dark:text-white">
          Login to <span className="text-blue-500">HomeChef 🍳</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
          <LoginWithGoogle onLogin={handleGoogleLogin} />
          <p className="pt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="font-semibold text-blue-500 hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
