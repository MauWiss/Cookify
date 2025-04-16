// קבלת user מתוך JWT
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.UserId,
        email: decoded.Email,
        username: decoded.Username,
        profilePictureBase64: decoded.profilePictureBase64 || null, // אם תוסיף בעתיד
      });
    }
  }, []);

  return { user, setUser };
};
