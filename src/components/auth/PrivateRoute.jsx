import { Navigate } from "react-router-dom";
import LoadingSpinner from "../sections/LoadingSpinner"; // Your cinematic loader component
import { useEffect, useState } from "react";

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    return !!token && token !== "undefined";
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // You might want to add an endpoint to get current user
          // const userData = await getCurrentUser();
          // setUser(userData);
          setAuthChecked(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default PrivateRoute;
