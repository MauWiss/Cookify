import { useState } from "react";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const toggleForm = () => setIsRegister(!isRegister);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isRegister ? "Registering" : "Logging in", form);
    // TODO: connect to backend
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-gray-900">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
        {isRegister ? "Create an Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={toggleForm}
          className="text-blue-600 hover:underline dark:text-teal-300"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
