// src/pages/Auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
<<<<<<< HEAD
  const [role, setRole] = useState(localStorage.getItem("role"))
=======
  const [user, setUser] = useState(null);
>>>>>>> 3633f9d46186ae350fd09fea0fe68c4916980ba4

  useEffect(() => {
    const loadUser = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setUser({
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const login = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
<<<<<<< HEAD
    setRole(newRole);
    console.log("role")
=======
    const decoded = jwtDecode(newToken);
    setUser({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    });
>>>>>>> 3633f9d46186ae350fd09fea0fe68c4916980ba4
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
<<<<<<< HEAD
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
=======
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
>>>>>>> 3633f9d46186ae350fd09fea0fe68c4916980ba4
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
