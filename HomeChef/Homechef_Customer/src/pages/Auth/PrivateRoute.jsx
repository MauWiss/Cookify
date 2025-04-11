import { Navigate } from "react-router-dom";
import { useAuth } from "AuthContext"; // ייבוא ה־AuthContext

export default function PrivateRoute({ children }) {
  const { token } = useAuth(); // גישה ל־token מה־context

  if (!token) {
    return <Navigate to="/auth/login" />; // אם אין טוקן, מפנים לדף ההתחברות
  }

  return children; // אם יש טוקן, מציגים את העמוד המוגן
}
