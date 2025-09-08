import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootLayout from "./layouts/RootLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import ErrorBoundary from "./components/sections/ErrorBoundry";
import DelayedSpinner from "./hooks/DelayedSpinner";

// Lazy-loaded pages
const Home = lazy(() => import("./page/Home"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const ProfilePage = lazy(() => import("./page/ProfilePage"));
const NotFoundPage = lazy(() => import("./page/NotFoundPage"));
const AllProject = lazy(() => import("./page/AllProject"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<DelayedSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<DelayedSpinner />}>
            <AllProject />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "profile",
    element: (
      <Suspense fallback={<DelayedSpinner />}>
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<DelayedSpinner />}>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Suspense>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<DelayedSpinner />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
