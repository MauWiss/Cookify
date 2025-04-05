import { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from './firebase'

// בתוך GoogleLoginButton.jsx
import LoginWithGoogle from "../../components/LoginWithGoogle"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";





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
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // שלב 1: קבלת ה-ID Token מ-Firebase
      const idToken = await user.getIdToken();

      // שלב 2: שליחת ה-ID Token לשרת שלך
      const response = await api.post("/auth/google", {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      console.log("response from server:", response.data);
      localStorage.setItem("token", response.data.token);
      toast.success("Welcome back!");
      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16 dark:bg-gray-900">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 dark:text-white">
          Login to <span className="text-blue-500">HomeChef 🍳</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-500 shadow-sm transition focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-500 shadow-sm transition focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold tracking-wide text-white shadow transition hover:bg-blue-700"
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
