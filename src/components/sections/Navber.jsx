import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { scrollY, scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [checkLoginStatus]);

  useEffect(() => {
    if (!showProfileDropdown) return;

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const newScrolled = latest > 20;
    if (newScrolled !== isScrolled) {
      setIsScrolled(newScrolled);
    }
  });

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate("/");
  }, [navigate]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
      setShowProfileDropdown(false);
    },
    [navigate]
  );

  const isActiveLink = useCallback(
    (path) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Showreel", path: "/projects" },
    { name: "Pricing", path: "/pricing" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  // Ultra-smooth custom easing
  const smoothEase = [0.34, 1.56, 0.64, 1];
  const gentleEase = [0.43, 0.13, 0.23, 0.96];
  const softSpring = {
    type: "spring",
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  };

  return (
    <>
      <motion.header
        ref={navbarRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 1.2,
          ease: gentleEase,
          delay: 0.1,
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Main Navbar Container */}
        <motion.div
          className={`mx-auto transition-all duration-1000 ${
            isScrolled
              ? "mt-4 sm:mt-6 px-4 sm:px-6 max-w-7xl"
              : "mt-0 px-0 max-w-full"
          }`}
          transition={{ ease: gentleEase }}
        >
          <motion.nav
            className={`relative ${
              isScrolled
                ? "rounded-2xl sm:rounded-3xl overflow-visible"
                : "rounded-none border-b border-white/10 overflow-visible"
            }`}
            style={{
              background: isScrolled
                ? "rgba(10, 10, 10, 0.4)"
                : "rgba(10, 10, 10, 0.3)",
              backdropFilter: isScrolled
                ? "blur(30px) saturate(180%)"
                : "blur(20px) saturate(180%)",
              WebkitBackdropFilter: isScrolled
                ? "blur(30px) saturate(180%)"
                : "blur(20px) saturate(180%)",
            }}
            transition={{ ease: gentleEase }}
          >
            {/* Liquid Glass Overlays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit">
              {/* Top highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 80%, transparent)",
                }}
              />

              {/* Ambient light effects */}
              <motion.div
                className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 70%)",
                }}
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)",
                }}
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Content Container */}
            <div className="relative px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 lg:h-20">
                {/* Logo */}
                <Link to="/" className="flex items-center group">
                  <motion.div
                    className="relative w-9 h-9 mr-2"
                    whileHover={{ scale: 1.08 }}
                    transition={softSpring}
                  >
                    {/* Animated ring */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(244,63,94,0.8), rgba(244,63,94,0.4))",
                        padding: "1.5px",
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="w-full h-full rounded-xl bg-[#0a0a0a]/80 backdrop-blur-sm" />
                    </motion.div>

                    {/* Center dot */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                      }}
                      whileHover={{ scale: 1.3 }}
                      transition={softSpring}
                    />

                    {/* Orbiting dots */}
                    <motion.div
                      className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2"
                      style={{ background: "#f43f5e" }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2"
                      style={{ background: "#f43f5e" }}
                      animate={{
                        opacity: [1, 0.3, 1],
                        scale: [1.2, 0.8, 1.2],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  <span className="text-white font-bold text-lg tracking-tight">
                    <motion.span
                      className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent group-hover:from-[#f43f5e] group-hover:via-[#f43f5e] group-hover:to-[#f43f5e]/70 transition-all duration-700"
                      whileHover={{ letterSpacing: "0.05em" }}
                      transition={softSpring}
                    >
                      JAYED
                    </motion.span>
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="relative px-4 py-2 group"
                    >
                      <motion.span
                        className={`relative z-10 text-sm font-medium tracking-wide transition-all duration-700 ${
                          isActiveLink(link.path)
                            ? "text-white"
                            : "text-white/60 group-hover:text-white"
                        }`}
                        whileHover={{ y: -1 }}
                        transition={softSpring}
                      >
                        {link.name}
                      </motion.span>

                      {/* Active/Hover background */}
                      {(isActiveLink(link.path) ||
                        isActiveLink(link.path) === false) && (
                        <motion.div
                          className={`absolute inset-0 rounded-xl ${
                            isActiveLink(link.path)
                              ? "bg-gradient-to-r from-[#f43f5e]/10 to-[#f43f5e]/5"
                              : "bg-white/0 group-hover:bg-white/[0.06]"
                          }`}
                          layoutId={
                            isActiveLink(link.path) ? "activeTab" : undefined
                          }
                          transition={{
                            type: "spring",
                            bounce: 0.1,
                            duration: 0.9,
                            stiffness: 150,
                            damping: 25,
                          }}
                        />
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">
                  {/* Watch Reel Button */}
                  <motion.button
                    onClick={() => handleNavigation("/projects")}
                    className="relative hidden sm:flex items-center gap-2 px-5 py-2.5 overflow-hidden group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={softSpring}
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f43f5e]/20 via-[#f43f5e]/10 to-[#f43f5e]/20 border border-white/10" />

                    {/* Play icon */}
                    <motion.div
                      className="relative w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 15px rgba(244,63,94,0.3)",
                          "0 0 40px rgba(244,63,94,0.7)",
                          "0 0 15px rgba(244,63,94,0.3)",
                        ],
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.svg
                        className="w-2.5 h-2.5 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.2 }}
                        transition={softSpring}
                      >
                        <path d="M8 5v14l11-7z" />
                      </motion.svg>
                    </motion.div>

                    <motion.span
                      className="relative text-sm font-semibold text-white/90 group-hover:text-white transition-all duration-700"
                      whileHover={{ x: 2 }}
                      transition={softSpring}
                    >
                      Watch Reel
                    </motion.span>

                    {/* Hover shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    </div>
                  </motion.button>

                  {/* Profile Dropdown */}
                  {isLoggedIn && (
                    <div className="relative" ref={profileDropdownRef}>
                      <motion.button
                        className="profile-button relative w-10 h-10 rounded-xl flex items-center justify-center group"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={softSpring}
                        onClick={() =>
                          setShowProfileDropdown(!showProfileDropdown)
                        }
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f43f5e]/20 to-[#f43f5e]/20 border border-white/10" />
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#f43f5e] to-[#e11d48] flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
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
                        </div>
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showProfileDropdown && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{
                              duration: 0.5,
                              ease: smoothEase,
                            }}
                            className="absolute right-0 mt-3 w-56 rounded-2xl z-[100]"
                            style={{
                              background: "rgba(20, 20, 20, 0.95)",
                              backdropFilter: "blur(40px) saturate(180%)",
                              WebkitBackdropFilter: "blur(40px) saturate(180%)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              boxShadow:
                                "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset",
                            }}
                          >
                            <div className="py-2">
                              <Link
                                to="/dashboard"
                                className="flex items-center px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-500"
                                onClick={() => setShowProfileDropdown(false)}
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                  />
                                </svg>
                                Dashboard
                              </Link>
                              <Link
                                to="/dashboard/profile"
                                className="flex items-center px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-500"
                                onClick={() => setShowProfileDropdown(false)}
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Profile
                              </Link>
                              <Link
                                to="/dashboard/packages"
                                className="flex items-center px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-white/[0.08] transition-all duration-500"
                                onClick={() => setShowProfileDropdown(false)}
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                                Packages
                              </Link>
                              <div className="border-t border-white/10 my-1"></div>
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 text-sm text-[#f43f5e] hover:text-[#f43f5e] hover:bg-white/[0.08] transition-all duration-500"
                              >
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Logout
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Mobile Menu Button */}
                  <motion.button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative lg:hidden w-10 h-10 rounded-xl flex flex-col items-center justify-center group"
                    whileTap={{ scale: 0.95 }}
                    transition={softSpring}
                  >
                    <div className="absolute inset-0 rounded-xl bg-white/[0.03] border border-white/10" />
                    <div className="relative w-5 h-4 flex flex-col justify-between">
                      <motion.span
                        animate={{
                          rotate: isMenuOpen ? 45 : 0,
                          y: isMenuOpen ? 7 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: smoothEase,
                        }}
                        className="w-full h-0.5 rounded-full bg-white origin-center"
                      />
                      <motion.span
                        animate={{
                          opacity: isMenuOpen ? 0 : 1,
                          x: isMenuOpen ? 20 : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: gentleEase,
                        }}
                        className="w-full h-0.5 rounded-full bg-white"
                      />
                      <motion.span
                        animate={{
                          rotate: isMenuOpen ? -45 : 0,
                          y: isMenuOpen ? -7 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: smoothEase,
                        }}
                        className="w-full h-0.5 rounded-full bg-white origin-center"
                      />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Scroll Progress Indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                scaleX: scrollYProgress,
                transformOrigin: "left",
                background: "linear-gradient(90deg, #f43f5e, #e11d48, #f43f5e)",
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            />
          </motion.nav>
        </motion.div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: gentleEase,
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.7,
                ease: smoothEase,
              }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden"
              style={{
                background: "rgba(10, 10, 10, 0.8)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <motion.span
                    className="text-lg font-semibold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Menu
                  </motion.span>
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.08 }}
                    transition={softSpring}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <nav className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.08,
                          duration: 0.5,
                          ease: smoothEase,
                        }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-500 ${
                            isActiveLink(link.path)
                              ? "bg-gradient-to-r from-[#f43f5e]/20 to-[#f43f5e]/5 text-white border border-white/20"
                              : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}

                    <motion.div
                      className="pt-6 mt-6 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {isLoggedIn ? (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-500"
                          >
                            <svg
                              className="w-5 h-5 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-500"
                          >
                            <svg
                              className="w-5 h-5 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>
                          <Link
                            to="/dashboard/packages"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-500"
                          >
                            <svg
                              className="w-5 h-5 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            Packages
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-[#f43f5e] hover:text-[#f43f5e] hover:bg-white/[0.06] transition-all duration-500"
                          >
                            <svg
                              className="w-5 h-5 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-500"
                        >
                          Login
                        </Link>
                      )}
                    </motion.div>
                  </nav>
                </div>

                {/* Menu Footer */}
                <motion.div
                  className="p-6 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => {
                      handleNavigation("/projects");
                      setIsMenuOpen(false);
                    }}
                    className="relative w-full py-4 rounded-xl overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={softSpring}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f43f5e]/30 via-[#f43f5e]/20 to-[#f43f5e]/30 border border-white/20" />
                    <span className="relative flex items-center justify-center gap-2 text-white font-semibold">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Watch Reel
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}