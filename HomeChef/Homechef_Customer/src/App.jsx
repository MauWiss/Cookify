import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="*"
          element={<div className="p-4">404 - Page Not Found</div>}
        />
      </Routes>
    </div>
  );
}
