import React, { createContext, useContext, useEffect, useState } from "react";
import cognitoConfig from "../../cognitoConfig";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1) קוד החזרה מ-Cognito → החלפה ב-tokens
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(`https://${cognitoConfig.domain}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `grant_type=authorization_code` +
          `&client_id=${cognitoConfig.clientId}` +
          `&code=${code}` +
          `&redirect_uri=${encodeURIComponent(cognitoConfig.redirectUri)}`
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("idToken", data.id_token);
          setUser({ idToken: data.id_token });
          // ננקה את הקוד מה־URL כדי שלא נטפל בו שוב
          window.history.replaceState({}, "", "/");
        })
        .catch(console.error);
    } else {
      // אם אין קוד, נטען מה־localStorage
      const token = localStorage.getItem("idToken");
      if (token) setUser({ idToken: token });
      console.log(token)
    }
  }, []);

  // login/raw redirect
  const login = () => {
    const { domain, clientId, redirectUri, responseType, scope } = cognitoConfig;
    const authUrl =
      `https://${domain}/login?` +
      `response_type=${encodeURIComponent(responseType)}` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  // התנתקות
  const logout = () => {
    localStorage.removeItem("idToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
