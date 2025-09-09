import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navbarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const reelBtnControls = useAnimation();
  const navigate = useNavigate();
  const location = useLocation(); // Added to track current location

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-button")
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize animations
  useEffect(() => {
    controls.start({
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    });

    const glowAnimation = async () => {
      while (true) {
        await reelBtnControls.start({
          boxShadow: "0 0 15px 3px rgba(244, 63, 94, 0.7)",
          transition: { duration: 2, ease: "easeInOut" },
        });
        await reelBtnControls.start({
          boxShadow: "0 0 5px 1px rgba(244, 63, 94, 0.3)",
          transition: { duration: 2, ease: "easeInOut" },
        });
      }
    };
    glowAnimation();
  }, []);

  // Scroll effects
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      controls.start({
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(10, 10, 10, 0.9)",
        transition: { duration: 0.3 },
      });
    } else {
      controls.start({
        backdropFilter: "none",
        backgroundColor: "rgba(10, 10, 10, 0.2)",
        transition: { duration: 0.3 },
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate("/"); // Redirect to home after logout
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowProfileDropdown(false); // Close dropdown when navigating
  };

  // Check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" }, // Changed from #about to /about
    { name: "Showreel", path: "/projects" },
    { name: "Testimonials", path: "/testimonials" }, // Changed from #testimonials
    { name: "Contact", path: "/contact" }, // Changed from #contact
  ];

  return (
    <motion.header
      ref={navbarRef}
      initial={{ y: -100 }}
      animate={controls}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/20 border-b border-white/10"
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 rounded-full border-2 border-white/70 group-hover:border-red-500 transition-colors duration-300"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/80 group-hover:bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"></div>
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/50 group-hover:bg-red-400 rounded-full transform -translate-x-1/2 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white/50 group-hover:bg-red-400 rounded-full transform -translate-x-1/2 transition-colors duration-300"></div>
              </div>
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-red-400 transition-colors duration-300">
                JAYED
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                <Link
                  to={link.path}
                  className={`${
                    isActiveLink(link.path) ? "text-red-400" : "text-white/80"
                  } hover:text-red-400 font-medium text-sm uppercase tracking-wider transition-colors duration-300 relative`}
                >
                  {link.name}
                </Link>
                {isActiveLink(link.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f43f5e] to-[#f43f5e80]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#f43f5e] to-[#f43f5e80]"
                  initial={{ scaleX: 0, transformOrigin: "left center" }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Watch Reel CTA Button */}
            <motion.button
              animate={reelBtnControls}
              onClick={() => handleNavigation("/projects")}
              className="hidden md:block px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Watch Reel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            {/* Profile dropdown */}
            {isLoggedIn && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  className="profile-button w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <a
                      href="/dashboard"
                      className="block px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors duration-200"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/dashboard/profile"
                      className="block px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors duration-200 border-t border-white/5"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors duration-200 border-t border-white/5"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center space-y-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 8 : 0,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                }}
                className="block w-6 h-0.5"
              ></motion.span>
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                }}
                className="block w-6 h-0.5"
              ></motion.span>
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -8 : 0,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                }}
                className="block w-6 h-0.5"
              ></motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          paddingTop: isMenuOpen ? "1rem" : 0,
          paddingBottom: isMenuOpen ? "1rem" : 0,
          borderTopWidth: isMenuOpen ? "1px" : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden bg-[#0a0a0a] overflow-hidden border-white/10"
      >
        <div className="container mx-auto px-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  to={link.path}
                  className={`${
                    isActiveLink(link.path) ? "text-red-400" : "text-white/80"
                  } hover:text-red-400 py-2 font-medium uppercase tracking-wider transition-colors duration-300 border-b border-white/5`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </div>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white/80 hover:text-red-400 py-2 font-medium uppercase tracking-wider transition-colors duration-300 border-b border-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="text-white/80 hover:text-red-400 py-2 font-medium uppercase tracking-wider transition-colors duration-300 border-b border-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-red-400 py-2 font-medium uppercase tracking-wider transition-colors duration-300 border-b border-white/5 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleNavigation("/login");
                  setIsMenuOpen(false);
                }}
                className="text-white/80 hover:text-red-400 py-2 font-medium uppercase tracking-wider transition-colors duration-300 border-b border-white/5 text-left"
              >
                Login
              </button>
            )}
            <button
              onClick={() => handleNavigation("/projects")}
              className="mt-4 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 text-center"
            >
              Watch Reel
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 to-red-600"
          style={{ width: "0%" }}
          animate={{
            width: `${
              (scrollY.get() /
                (document.documentElement.scrollHeight -
                  document.documentElement.clientHeight)) *
              100
            }%`,
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.header>
  );
}
