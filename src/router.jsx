import { createBrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./page/ProfilePage";
import Dashboard from "./page/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      //   { path: "settings", element: <DashboardSettings /> },
    ],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

export default router;
