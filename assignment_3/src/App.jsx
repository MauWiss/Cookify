import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import EditProfile from "./components/EditProfile";

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // 1) Use loggedInUser state for isLoggedIn:
  const isLoggedIn = !!loggedInUser; // <-- Instead of sessionStorage

  // Load users and logged-in user from localStorage/sessionStorage on mount
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
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Protected route logic
  const ProtectedRoute = ({ element, roles }) => {
    // Check using loggedInUser from state
    if (!loggedInUser) {
      console.log("No user logged in. Redirecting to /Login.");
      return <Navigate to="/Login" />;
    }

    if (roles && !roles.includes(loggedInUser.role)) {
      console.log(`User role (${loggedInUser.role}) not authorized. Redirecting to /Login.`);
      return <Navigate to="/Login" />;
    }

    return element;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser"); // Clear storage
    setLoggedInUser(null);                    // Update state so navbar re-renders
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid justify-content-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {/* If NOT logged in, show Register/Login */}
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">
                      Login
                    </Link>
                  </li>
                </>
              )}

              {/* If logged in, show Profile and Admin (if role=admin) */}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Profile">
                      Profile
                    </Link>
                  </li>
                  {loggedInUser && loggedInUser.role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/Admin">
                        Admin
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <h1>User Management System</h1>

      <Routes>
        <Route
          path="/Register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route
          path="/Login"
          element={<Login onLogin={setLoggedInUser} />}
        />
        <Route
          path="/Profile"
          element={<ProtectedRoute element={
            <Profile onLogout={handleLogout} />
          } roles={["user", "admin"]} />}
        />
        <Route
          path="/EditProfile"
          element={<EditProfile />}
        />
        <Route
          path="/Admin"
          element={<ProtectedRoute element={<Admin />} roles={["admin"]} />}
        />
        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                loggedInUser
                  ? loggedInUser.role === "admin"
                    ? "/Admin"
                    : "/Profile"
                  : "/Login"
              }
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
