import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "../components/sections/Navber";
import Footer from "../components/sections/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useEffect } from "react";

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app">
      <Navbar />
      <ScrollToTop />
      <Outlet />

      <Footer />
    </div>
  );
};

export default RootLayout;
