import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Admin from "./components/Admin"; // Import Admin component

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Load users and logged-in user from localStorage/sessionStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const sessionUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    setUsers(storedUsers);
    setLoggedInUser(sessionUser);
  }, []);

  // Handle registration
  const handleRegister = (newUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Store users in localStorage
      return updatedUsers;
    });
  };

  const ProtectedRoute = ({ element, roles }) => {
    const sessionUser = JSON.parse(sessionStorage.getItem("loggedInUser")); // Get user from sessionStorage
    console.log("ProtectedRoute: Logged-in user from sessionStorage:", sessionUser);

    if (!sessionUser) {
      console.log("No user logged in. Redirecting to /Login.");
      return <Navigate to="/Login" />;
    }

    if (roles && !roles.includes(sessionUser.role)) {
      console.log(`User role (${sessionUser.role}) not authorized. Redirecting to /Login.`);
      return <Navigate to="/Login" />;
    }

    console.log("Access granted to the route.");
    return element;
  };

  const isLoggedIn = !!sessionStorage.getItem("loggedInUser"); // Check if user is logged in



  return (
    <div>
      {/* Show navigation links only if the user is not logged in */}
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">Login</Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">Profile</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <h1>User Management System</h1>
      <Routes>
        <Route path="/Register" element={<Register onRegister={handleRegister} />} />
        <Route path="/Login" element={<Login onLogin={setLoggedInUser} />} />
        <Route path="/Profile" element={<ProtectedRoute element={<Profile />} roles={["user", "admin"]} />} />
        <Route path="/Admin" element={<ProtectedRoute element={<Admin />} roles={["admin"]} />} />
        <Route path="*" element={<Navigate to={loggedInUser ? (loggedInUser.role === "admin" ? "/Admin" : "/Profile") : "/Login"} />} />
      </Routes>
      <div className="overlay"></div>
    </div>
  );
}

export default App;
