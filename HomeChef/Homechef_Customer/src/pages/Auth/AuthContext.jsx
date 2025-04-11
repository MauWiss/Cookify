// src/pages/Auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

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

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUser({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
