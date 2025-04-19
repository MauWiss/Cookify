import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const loadUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode(storedToken);
      console.log("decoded token:", decoded);

      const res = await getUserProfile();
      const userData = res.data.data;

      console.log("data from profile:", userData);

      // נבדוק אם יש תמונה אמיתית (ולא רק prefix של base64)
      const hasValidImage =
        userData.profilePictureBase64 &&
        userData.profilePictureBase64.trim() !== "" &&
        userData.profilePictureBase64 !== "data:image/jpeg;base64,";

      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        gender: userData.gender,
        profileImage: hasValidImage
          ? `data:image/jpeg;base64,${userData.profilePictureBase64}`
          : null,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
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
