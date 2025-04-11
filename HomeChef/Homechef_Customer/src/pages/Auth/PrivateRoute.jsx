// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();

  return token ? children : <Navigate to="/auth/login" replace />;
}
