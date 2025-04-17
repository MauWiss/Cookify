import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../api/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);

      const baseUser = {
        id: decoded.UserId,
        email: decoded.Email,
        username: decoded.Username,
      };

      // ❗ נטען גם את התמונה (וכך זה ישרוד רענון)
      getUserProfile()
        .then((res) => {
          const profile = res.data;
          setUser({
            ...baseUser,
            profilePictureBase64: profile.profilePictureBase64 || null,
          });
        })
        .catch(() => {
          // fallback רק עם נתוני הטוקן
          setUser(baseUser);
        });
    }
  }, []);

  return { user, setUser };
};
