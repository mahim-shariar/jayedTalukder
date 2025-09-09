import { Navigate } from "react-router-dom";
import LoadingSpinner from "../sections/LoadingSpinner";
import { useEffect, useState } from "react";

// Moved outside component to avoid recreation on each render
const checkAuthentication = () => {
  try {
    const token = localStorage.getItem("token");
    // More robust check for valid token
    return (
      !!token && token !== "undefined" && token !== "null" && token.length > 10 // Most tokens are longer than 10 characters
    );
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    checked: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    let isActive = true;

    // Immediate check without artificial delay
    const authenticated = checkAuthentication();

    // Use requestAnimationFrame to avoid blocking UI thread
    const id = requestAnimationFrame(() => {
      if (isActive) {
        setAuthStatus({
          checked: true,
          isAuthenticated: authenticated,
        });
      }
    });

    // Cleanup function
    return () => {
      isActive = false;
      cancelAnimationFrame(id);
    };
  }, []);

  // Show loading spinner while checking authentication
  if (!authStatus.checked) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated - use a valid path
  if (!authStatus.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
