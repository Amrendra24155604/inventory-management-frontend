// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuthStatus } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus().then((user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) return null;

  if (!isAuthenticated) {
    alert("Please register or login first");
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;