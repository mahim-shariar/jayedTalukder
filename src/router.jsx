import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/sections/LoadingSpinner";

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
    errorElement: <div>Error occurred!</div>,
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
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      </Suspense>
    ),
    errorElement: <div>Error occurred!</div>,
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
];

// Create the router
const router = createBrowserRouter(routerConfig);

// Export as named export
export { router };
