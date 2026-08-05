import { Navigate } from "react-router-dom";
import LoadingSpinner from "../sections/LoadingSpinner";
import { useEffect, useState } from "react";

const checkAuthentication = () => {
  try {
    const token = localStorage.getItem("token");
    return (
      !!token && token !== "undefined" && token !== "null" && token.length > 10
    );
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Use a simple timeout to avoid blocking the UI thread
    const timer = setTimeout(() => {
      setIsAuthenticated(checkAuthentication());
    }, 0); // Minimal delay to allow UI to render

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/*" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
