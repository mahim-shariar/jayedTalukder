import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Router, RouterProvider } from "react-router-dom";
import router from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
      <SpeedInsights />
    </AuthProvider>
  </StrictMode>
);
