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
    // Simulate async auth check (replace with actual async check if needed)
    const timer = setTimeout(() => setAuthChecked(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default PrivateRoute;
