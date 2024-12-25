import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  // Handle registration
  const handleRegister = (newUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Store users in localStorage
      return updatedUsers;
    });
  };

  // Log out function
  const logOutUser = () => {
    sessionStorage.removeItem("loggedInUser"); // Clear logged-in user session
    navigate("/Login"); // Redirect to login page
  };

  const isLoggedIn = !!sessionStorage.getItem("loggedInUser"); // Check if user is logged in

  // Protected Route Wrapper
  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/Login" />;
  };

  return (
    <div>
      {/* Show navigation links only if the user is not logged in */}
      {!isLoggedIn && (
        <nav>
          <Link to="/Register">Register</Link> || <Link to="/Login">Login</Link>
        </nav>
      )}
      <h1>User Management System</h1>
      <Routes>
        <Route path="/Register" element={<Register onRegister={handleRegister} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile logOutUser={logOutUser} />} />
        <Route path="*" element={<Navigate to="/Login" />} /> {/* Default to Login */}
      </Routes>
      <div className="overlay"></div>
    </div>
  );
}

export default App;
