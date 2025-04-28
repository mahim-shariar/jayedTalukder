import { createBrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./page/ProfilePage";
import Dashboard from "./page/Dashboard";
// You'll need to create this component
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFoundPage from "./page/NotFoundPage";

// This is a mock function - replace with your actual auth check

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
