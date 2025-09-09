import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/sections/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded pages
const Home = lazy(() => import("./page/Home"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const ProfilePage = lazy(() => import("./page/ProfilePage"));
const NotFoundPage = lazy(() => import("./page/NotFoundPage"));
const AllProject = lazy(() => import("./page/AllProject"));
const About = lazy(() => import("./page/About"));
const Testimonials = lazy(() => import("./page/Testimonials"));
const Contact = lazy(() => import("./page/Contact"));

// Layout components
const RootLayout = lazy(() => import("./layouts/RootLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const PrivateRoute = lazy(() => import("./components/auth/PrivateRoute"));

// Create router configuration
export const routerConfig = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RootLayout />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects",
        element: <AllProject />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "testimonials",
        element: <Testimonials />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        {/* <PrivateRoute> */}
        <DashboardLayout />
        {/* </PrivateRoute> */}
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
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
];

// Create the router
const router = createBrowserRouter(routerConfig);

export default router;
