// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// יצירת Context
const AuthContext = createContext();

// hook לגישה ל־context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider של ה־AuthContext
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // פונקציית התחברות
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // פונקציית התנתקות
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // פונקציה שתשדר את ה־token החדש
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
