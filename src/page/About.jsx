import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import jayed_Profile from "/image/jayed-2.JPG";
import macbookImage from "/image/jayed-9.jpg";
import { Link } from "react-router-dom";

// Background particles configuration
const particlePositions = [
  { top: "10%", left: "15%", size: "w-3 h-3", color: "bg-red-500/20" },
  { top: "20%", left: "80%", size: "w-2 h-2", color: "bg-red-400/15" },
  { top: "30%", left: "25%", size: "w-3 h-3", color: "bg-red-500/20" },
  { top: "40%", left: "70%", size: "w-2 h-2", color: "bg-red-400/15" },
  { top: "50%", left: "10%", size: "w-3 h-3", color: "bg-red-500/20" },
  { top: "60%", left: "85%", size: "w-2 h-2", color: "bg-red-400/15" },
  { top: "70%", left: "35%", size: "w-3 h-3", color: "bg-red-500/20" },
  { top: "80%", left: "65%", size: "w-2 h-2", color: "bg-red-400/15" },
  { top: "15%", left: "45%", size: "w-2 h-2", color: "bg-red-400/10" },
  { top: "85%", left: "20%", size: "w-3 h-3", color: "bg-red-500/15" },
];

// Background Animation Component
const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
    {/* Gradient Orbs - Red theme */}
    <motion.div
      className="absolute top-20 left-10 w-60 h-60 bg-gradient-to-r from-red-600/10 to-red-500/15 rounded-full z-0 blur-3xl"
      animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-10 w-52 h-52 bg-gradient-to-r from-red-500/10 to-red-600/15 rounded-full z-0 blur-3xl"
      animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.15, 0.25] }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-600/5 to-red-500/8 rounded-full z-0 blur-3xl"
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />

    {/* Floating Particles - Red theme */}
    {particlePositions.map((particle, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${particle.size} ${particle.color} z-10`}
        style={{ top: particle.top, left: particle.left }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3,
        }}
      />
    ))}

    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

    {/* Grain texture */}
    <div
      className="absolute inset-0 opacity-15"
      style={{
        backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')`,
      }}
    />
  </div>
);

// Liquid Glass Profile Card Component
const LiquidGlassProfileCard = ({ imageLoaded, setImageLoaded }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
    springConfig
  );
  const glowX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const glowY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      className="w-full lg:w-1/3 relative"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -z-10 -inset-4 blur-xl rounded-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Skeleton loader */}
      {!imageLoaded && (
        <div
          className="w-full h-[28rem] rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, rgb(64,64,64) 0%, rgb(82,82,82) 25%, rgb(100,100,100) 50%, rgb(82,82,82) 75%, rgb(64,64,64) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmerSlide 2s ease-in-out infinite",
          }}
        />
      )}

      <motion.div
        ref={cardRef}
        className="relative group perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative rounded-2xl p-px overflow-hidden">
          {/* Subtle border gradient */}
          <motion.div
            className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                    (y + 0.5) * 100
                  }%, rgba(255,255,255,0.12) 0%, transparent 70%)`
              ),
            }}
          />

          {/* Card body - Liquid Glass */}
          <div
            className={`relative rounded-[22px] overflow-hidden transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "rgba(20, 20, 20, 0.55)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: `
                0 25px 35px -12px rgba(0, 0, 0, 0.4),
                inset 0 1px 1px rgba(255, 255, 255, 0.05)
              `,
              height: "28rem",
            }}
          >
            <img
              src={jayed_Profile}
              alt="Jayed - Video Editor"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Dynamic light overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                      (y + 0.5) * 100
                    }%, rgba(255,255,255,0.08) 0%, transparent 60%)`
                ),
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Liquid glass layers */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />

            {/* Badge */}
            <motion.div
              className="absolute bottom-4 left-4 text-white px-3 py-1.5 text-sm font-mono rounded-full"
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
              }}
              whileHover={{ scale: 1.05 }}
            >
              EDITOR'S CUT
            </motion.div>

            {/* Edge highlights */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Liquid Glass Philosophy Card Component
const LiquidGlassPhilosophyCard = ({ icon, title, description, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    springConfig
  );
  const glowX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const glowY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative rounded-2xl p-px overflow-hidden h-full">
        <motion.div
          className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                  (y + 0.5) * 100
                }%, rgba(255,255,255,0.12) 0%, transparent 70%)`
            ),
          }}
        />

        <div
          className="relative p-6 rounded-[22px] overflow-hidden h-full text-center"
          style={{
            background: "rgba(20, 20, 20, 0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: `
              0 25px 35px -12px rgba(0, 0, 0, 0.4),
              inset 0 1px 1px rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                    (y + 0.5) * 100
                  }%, rgba(255,255,255,0.05) 0%, transparent 60%)`
              ),
            }}
          />

          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
            {title}
          </h3>
          <p className="text-white/80 relative z-10">{description}</p>

          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <motion.div
            className="absolute top-2 right-2 w-1.5 h-1.5"
            animate={{ opacity: isHovered ? 0.6 : 0.2 }}
          >
            <div className="absolute inset-0 bg-white/40 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Liquid Glass Tool Card Component
const LiquidGlassToolCard = ({ category, items, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [2, -2]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-2, 2]),
    springConfig
  );

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative rounded-xl p-px overflow-hidden h-full">
        <div
          className="relative p-4 rounded-[20px] overflow-hidden h-full text-center"
          style={{
            background: "rgba(20, 20, 20, 0.45)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: `
              0 20px 30px -10px rgba(0, 0, 0, 0.3),
              inset 0 1px 1px rgba(255, 255, 255, 0.03)
            `,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/3 to-transparent pointer-events-none" />

          <div className="text-red-400 font-mono text-sm mb-2 relative z-10">
            {category}
          </div>
          {items.map((item, i) => (
            <div key={i} className="text-white relative z-10">
              {item}
            </div>
          ))}

          <motion.div
            className="absolute bottom-1 right-1 w-1 h-1"
            animate={{ opacity: isHovered ? 0.5 : 0.15 }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Liquid Glass Section Card Component
const LiquidGlassSectionCard = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative rounded-2xl md:rounded-3xl p-px overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="relative p-6 md:p-8 rounded-[22px] md:rounded-[30px] overflow-hidden"
        style={{
          background: "rgba(20, 20, 20, 0.5)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: `
            0 25px 35px -12px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        {children}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
};

// Skeleton Component
const AboutSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a]">
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="h-8 w-64 bg-red-900/20 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-12 w-96 bg-red-900/15 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-3/4 max-w-2xl bg-white/5 rounded mx-auto animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        <div className="w-full lg:w-1/3">
          <div
            className="h-[28rem] rounded-2xl animate-pulse"
            style={{ background: "rgba(20, 20, 20, 0.5)" }}
          />
        </div>
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="h-10 w-48 bg-white/5 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const About = () => {
  const textContainerRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Animated text sections
  useEffect(() => {
    const sections = [
      { text: "Jayed> _ Passionate visual storyteller", delay: 0.3 },
      { text: "Jayed> _ Cinematic eye since 2024", delay: 1.2 },
      { text: "Jayed> _ Specializing in emotional narratives", delay: 1.8 },
    ];

    let currentTimeout;
    let currentIndex = 0;

    const animateText = () => {
      if (textContainerRef.current) {
        textContainerRef.current.textContent = sections[currentIndex].text;
      }
      currentIndex = (currentIndex + 1) % sections.length;
      currentTimeout = setTimeout(
        animateText,
        sections[currentIndex].delay * 1000
      );
    };

    animateText();

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      const cursor = document.getElementById("terminal-cursor");
      if (cursor) {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
      }
    }, 600);

    return () => {
      clearTimeout(currentTimeout);
      clearInterval(cursorInterval);
    };
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);

  const philosophyItems = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Emotional Storytelling",
      description:
        "Every frame should evoke emotion and connect with the viewer on a deeper level.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
          />
        </svg>
      ),
      title: "Technical Excellence",
      description:
        "Precision in editing, color grading, and sound design to create seamless experiences.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
      title: "Client Collaboration",
      description:
        "Working closely with clients to ensure their vision is realized beyond expectations.",
    },
  ];

  const toolItems = [
    { category: "EDITING", items: ["Premiere Pro", "Final Cut Pro"] },
    { category: "COLOR GRADING", items: ["DaVinci Resolve", "Color Theory"] },
    { category: "MOTION", items: ["After Effects", "Motion Graphics"] },
    { category: "SPECIALTIES", items: ["Wedding Films", "Brand Stories"] },
  ];

  const milestones = [
    {
      year: "2024: The Beginning",
      desc: "Started my journey in video editing while studying at university",
      align: "left",
    },
    {
      year: "Joined Digital Dropout Skool",
      desc: "Enhanced my skills through specialized training and mentorship",
      align: "right",
    },
    {
      year: "MacBook Achievement",
      desc: "Awarded for exceptional performance in the program",
      align: "left",
    },
    {
      year: "Present: Professional Editor",
      desc: "Creating compelling visual stories for clients worldwide",
      align: "right",
    },
  ];

  if (loading) return <AboutSkeleton />;

  return (
    <section
      ref={aboutSectionRef}
      id="about"
      className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.02) 0%, transparent 70%)`,
      }}
    >
      {memoizedBackground}

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] -z-5"
        style={{ y: backgroundY }}
      />

      <div className="container mx-auto px-4 py-20 relative z-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide mb-4"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(10px)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
            }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About Me
          </motion.div>

          <div className="mb-8 font-mono text-red-400 text-lg">
            <span ref={textContainerRef}>
              Jayed&gt; _ Passionate visual storyteller
            </span>
            <span id="terminal-cursor" className="ml-1">
              |
            </span>
          </div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Visual Storyteller
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Crafting emotional narratives through motion and light. Specializing
            in cinematic wedding films and brand stories that resonate deeply
            with audiences.
          </motion.p>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <LiquidGlassProfileCard
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
          />

          <motion.div
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              My Journey
            </h2>

            <div className="space-y-4 text-white/80">
              <p>
                My journey began in the vibrant streets of Dhaka, where I
                discovered my passion for visual storytelling. Armed with
                nothing but a handheld camcorder and relentless curiosity, I
                started capturing moments that would eventually shape my career.
              </p>

              <p>
                In 2024, I took a leap of faith and dedicated myself fully to
                the art of video editing. What started as a hobby quickly
                evolved into a profession as I began working with brands and
                couples to create visual narratives that resonate on an
                emotional level.
              </p>

              <p>
                My big break came when I joined the Digital Dropout Skool
                program, where I honed my skills and earned recognition for my
                work. The MacBook I received as a performance reward became my
                most trusted tool, enabling me to bring my creative visions to
                life.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <LiquidGlassSectionCard className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            My Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, index) => (
              <LiquidGlassPhilosophyCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </LiquidGlassSectionCard>

        {/* Tools & Specialties Section */}
        <LiquidGlassSectionCard className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Tools & Specialties
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {toolItems.map((tool, index) => (
              <LiquidGlassToolCard
                key={index}
                category={tool.category}
                items={tool.items}
                index={index}
              />
            ))}
          </div>
        </LiquidGlassSectionCard>

        {/* Milestone Section */}
        <LiquidGlassSectionCard className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Career Milestones
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-red-500/50 via-red-500/30 to-red-500/50"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col md:flex-row items-center relative ${
                    milestone.align === "right" ? "md:flex-row-reverse" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div
                    className={`md:w-1/2 ${
                      milestone.align === "left"
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12"
                    } mb-4 md:mb-0`}
                  >
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(20, 20, 20, 0.4)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {milestone.year}
                      </h3>
                      <p className="text-white/70 text-sm">{milestone.desc}</p>
                    </div>
                  </div>

                  <motion.div
                    className="w-3 h-3 rounded-full z-10 mx-4 relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
                    }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-red-500/50 blur-md" />
                  </motion.div>

                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </LiquidGlassSectionCard>

        {/* Closing Statement */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why I Do What I Do
          </h2>

          <p className="text-xl text-white/80 mb-8 italic">
            "I believe that every moment has a story worth telling. My mission
            is to find those stories and tell them in the most compelling way
            possible through the art of video editing."
          </p>

          <Link to="/contact">
            <motion.button
              className="px-8 py-3 text-white font-medium rounded-full transition-all duration-300 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">Let's Work Together</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes shimmerSlide {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .perspective-[1200px] {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
};

export default About;
