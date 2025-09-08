import { Navigate } from "react-router-dom";
import LoadingSpinner from "../sections/LoadingSpinner";
import { useEffect, useState } from "react";

// Moved outside component to avoid recreation on each render
const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    // More robust check for valid token
    return (
      !!token && token !== "undefined" && token !== "null" && token.length > 0
    );
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const checkAuth = async () => {
      try {
        // Simulate async authentication check (e.g., token validation API call)
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay

        if (isMounted) {
          const authenticated = isAuthenticated();
          setIsAuth(authenticated);
          setAuthChecked(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        if (isMounted) {
          setIsAuth(false);
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading spinner while checking authentication
  if (!authChecked) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated
  if (!isAuth) {
    return <Navigate to="/*" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
