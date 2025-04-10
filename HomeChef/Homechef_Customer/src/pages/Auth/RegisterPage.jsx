import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../api/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Registered successfully! 🍳");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-16 dark:bg-gray-900">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800 dark:text-white">
          Create Your <span className="text-blue-500">HomeChef 🍳</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "username", type: "text", placeholder: "Username" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map(({ name, type, placeholder }) => (
            <input
              key={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              required
            />
          ))}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-blue-500 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
