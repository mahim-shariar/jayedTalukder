import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Implement your actual authentication check here
  // For example: check localStorage, auth context, or cookies
  return (
    localStorage.getItem("token") &&
    localStorage.getItem("token") !== "undefined"
  );
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/*" replace />;
};

export default PrivateRoute;
