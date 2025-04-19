// src/pages/Auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../../api/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // משתמש
  const [role, setRole] = useState(localStorage.getItem("role")); // תפקיד

  useEffect(() => {
    loadUser();

    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const loadUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      return; // אין טוקן בכלל - לא נשלח בקשה מיותרת
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode(storedToken);
      console.log("decoded token:", decoded);

      const res = await getUserProfile();
      const userData = res.data.data;

        const userData = res.data.data; // גישה נכונה לנתונים עצמם

        
        console.log("data from profile:",userData);
        setUser({
          id: userData.id,
          email: userData.email,
          username: userData.username,
          profileImage: `data:image/jpeg;base64,${userData.profilePictureBase64 || ""}`,
          gender: userData.gender,
        });

      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const login = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);

    try {
      const decoded = jwtDecode(newToken);
      console.log("decoded token:", decoded);
      loadUser();
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
