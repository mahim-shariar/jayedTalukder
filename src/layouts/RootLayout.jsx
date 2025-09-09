import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/sections/Navber";
import Footer from "../components/sections/Footer";
import ScrollToTop from "../components/ScrollToTop";

const RootLayout = () => {
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
