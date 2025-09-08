import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/sections/LoadingSpinner";
import ErrorBoundary from "./components/sections/ErrorBoundry";
import About from "./page/About";
import Testimonials from "./page/Testimonials";
import Contact from "./page/Contact";

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
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AllProject />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "testimonials",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Testimonials />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
