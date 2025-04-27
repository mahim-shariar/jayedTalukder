import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/sections/Navber";
import Footer from "../components/sections/Footer";

const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};

export default RootLayout;
