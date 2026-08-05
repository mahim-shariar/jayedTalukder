import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import jayed_Profile from "/image/jayed-2.JPG";
import macbookImage from "/image/jayed-9.jpg";
import { getVideoReelsByCategory } from "../../services/api";

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

// Liquid Glass Video Card Component
const LiquidGlassVideoCard = ({
  video,
  loading,
  videoPlaying,
  onPlay,
  videoRef,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [5, -5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-5, 5]),
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
      className="w-full lg:w-1/2 h-[400px] lg:h-[600px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        ref={cardRef}
        className="relative group perspective-[1200px] h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative rounded-2xl md:rounded-3xl p-px overflow-hidden h-full">
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
            className="relative rounded-[22px] md:rounded-[30px] overflow-hidden h-full"
            style={{
              background: "rgba(20, 20, 20, 0.65)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: `
                0 25px 35px -12px rgba(0, 0, 0, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.05),
                inset 0 -1px 1px rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            {/* Dynamic light overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                      (y + 0.5) * 100
                    }%, rgba(255,255,255,0.06) 0%, transparent 60%)`
                ),
              }}
            />

            {/* Liquid glass layers */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/4 to-transparent" />
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 rounded-full border-t-2 border-b-2 border-red-500"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30 blur-md"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)",
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                <video
                  ref={videoRef}
                  playsInline
                  className="w-full h-full object-cover"
                  src={video?.videoUrl || "/assets/reel.mp4"}
                  poster={video?.thumbnailUrl}
                  onClick={onPlay}
                >
                  <source
                    src={video?.videoUrl || "/assets/reel.mp4"}
                    type={
                      video?.videoUrl?.endsWith(".webm")
                        ? "video/webm"
                        : "video/mp4"
                    }
                  />
                </video>

                {!videoPlaying && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                    onClick={onPlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center relative"
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full opacity-50 blur-md"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)",
                        }}
                      />
                      <svg
                        className="w-8 h-8 text-white relative z-10"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}

                <motion.div
                  className="absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm font-mono z-20"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {video ? `▶︎ ${video.title}` : "▶︎ REEL_2024.MP4"}
                </motion.div>

                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  {[
                    { color: "bg-red-500", shadow: "shadow-red-900/50" },
                    { color: "bg-yellow-500", shadow: "shadow-yellow-900/50" },
                    { color: "bg-green-500", shadow: "shadow-green-900/50" },
                  ].map((dot, i) => (
                    <motion.span
                      key={i}
                      className={`w-3 h-3 rounded-full ${dot.color} shadow-lg ${dot.shadow} relative`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i, type: "spring" }}
                    >
                      <span className="absolute inset-0 rounded-full bg-white/20 blur-[2px]" />
                    </motion.span>
                  ))}
                </div>
              </>
            )}

            {/* Edge highlights */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent z-10" />
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Liquid Glass Card for Philosophy/Specialty - Equal Height
const LiquidGlassInfoCard = ({ title, content }) => {
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
      className="relative group perspective-[1200px] h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
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
          className="relative p-5 rounded-[22px] overflow-hidden h-full flex flex-col"
          style={{
            background: "rgba(20, 20, 20, 0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: `
              0 25px 35px -12px rgba(0, 0, 0, 0.4),
              inset 0 1px 1px rgba(255, 255, 255, 0.05)
            `,
            minHeight: "100px",
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

          <h3 className="text-red-400 mb-2 font-medium relative z-10">
            {title}
          </h3>
          <p className="text-sm text-white/80 relative z-10 flex-1">
            "{content}"
          </p>

          <motion.div
            className="absolute bottom-2 right-2 w-1.5 h-1.5"
            animate={{
              opacity: isHovered ? 0.6 : 0.2,
            }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Liquid Glass Profile Image Component - Fixed overflow for EDITOR'S CUT badge
const LiquidGlassProfileImage = ({ imageLoaded, setImageLoaded }) => {
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
      className="relative float-right ml-4 md:ml-6 mb-8 md:mb-10"
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
    >
      <div className="w-40 h-40 md:w-48 md:h-48 relative">
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

        {!imageLoaded && (
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
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
          className="relative group perspective-[1200px] h-full"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Removed overflow-hidden from this container */}
          <div className="relative rounded-2xl p-px h-full">
            <motion.div
              className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500 rounded-2xl"
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

            {/* Image container with overflow-hidden for the image itself */}
            <div
              className={`relative rounded-[22px] overflow-hidden transition-opacity duration-500 h-full ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: `
                  0 0 40px rgba(239, 68, 68, 0.2),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${jayed_Profile})` }}
              >
                <div className="absolute inset-0 shadow-[inset_0_0_40px_10px_rgba(0,0,0,0.7)]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xNSIvPgo8L3N2Zz4=')] opacity-30"></div>
              </div>

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

              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
            </div>

            {/* EDITOR'S CUT Badge - Moved OUTSIDE the overflow-hidden container */}
            <motion.div
              className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 z-30"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="relative px-3 py-1.5 md:px-4 md:py-2 rounded-full"
                style={{
                  background: "rgba(239, 68, 68, 0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1.5px solid rgba(239, 68, 68, 0.5)",
                  boxShadow: `
                    0 4px 20px rgba(239, 68, 68, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)",
                  }}
                />

                {/* Rotated text */}
                <span
                  className="relative z-10 text-white font-bold tracking-wider text-[10px] md:text-xs flex items-center gap-1"
                  style={{ transform: "rotate(-1deg)" }}
                >
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  EDITOR'S CUT
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <img
          src={jayed_Profile}
          alt="Jayed Profile"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    </motion.div>
  );
};

// Liquid Glass Modal Component
const LiquidGlassModal = ({
  showBio,
  toggleBio,
  macbookImageLoaded,
  setMacbookImageLoaded,
}) => {
  if (!showBio) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dark overlay with blur */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={toggleBio}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Film strip borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-black/80 via-red-950/20 to-black/80 backdrop-blur-sm border-b border-white/10" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-black/80 via-red-950/20 to-black/80 backdrop-blur-sm border-t border-white/10" />

      {/* Modal content */}
      <motion.div
        className="relative z-10 max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-3xl p-6 md:p-8 scrollbar-custom"
        style={{
          background: "rgba(20, 20, 20, 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(239, 68, 68, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.2)
          `,
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `
              radial-gradient(
                circle at 50% 0%,
                rgba(239, 68, 68, 0.08) 0%,
                transparent 50%
              )
            `,
            mixBlendMode: "overlay",
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Close button */}
        <motion.button
          onClick={toggleBio}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-20"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        {/* Content */}
        <div className="space-y-6 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
            <span className="font-mono text-red-500">THE_REAL_STORY</span> FROM
            BOREDOM TO BRILLIANCE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                CHAPTER ONE: THE AWAKENING
              </h3>
              <p className="text-white/80 leading-relaxed">
                It was 2024. I was sitting in my university classroom, feeling
                completely disconnected. The traditional education path wasn't
                lighting me up. Then came my first paid video gig - shaky
                footage of a local event, edited on borrowed hardware. It wasn't
                glamorous, but that spark of creation changed everything.
              </p>
              <p className="text-white/80 leading-relaxed mt-4">
                When I joined Digital Dropout Skool, it felt like someone
                finally handed me the keys to my future. That MacBook they
                awarded me for my performance? It became my weapon of choice -
                my passport from boredom to creative freedom.
              </p>
            </div>
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <h4 className="text-red-400 font-mono text-sm mb-3">
                TURNING POINTS
              </h4>
              <ul className="space-y-3 text-sm text-white/80">
                {[
                  "2024: First paid video work while in university",
                  "Joined Digital Dropout Skool program",
                  "Earned MacBook through exceptional performance",
                  "Found my voice in visual storytelling",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-red-400 mr-2">▶</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* MacBook Achievement Section */}
          <div
            className="mt-8 p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: `
                0 8px 20px -5px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.05)
              `,
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
              MY TURNING POINT
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/2">
                {!macbookImageLoaded && (
                  <div
                    className="relative rounded-xl overflow-hidden h-48"
                    style={{
                      background:
                        "linear-gradient(90deg, rgb(64,64,64) 0%, rgb(82,82,82) 25%, rgb(100,100,100) 50%, rgb(82,82,82) 75%, rgb(64,64,64) 100%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmerSlide 2s ease-in-out infinite",
                    }}
                  />
                )}
                <motion.div
                  className={`relative rounded-xl overflow-hidden transition-opacity duration-500 ${
                    macbookImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 0 30px rgba(239, 68, 68, 0.15)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    src={macbookImage}
                    alt="MacBook achievement"
                    className="w-full h-auto object-cover"
                    onLoad={() => setMacbookImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div
                    className="absolute bottom-4 left-4 text-white font-mono text-sm px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(0, 0, 0, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Digital Dropout Skool Reward
                  </div>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <p className="text-white/80 leading-relaxed">
                  This MacBook represents more than just hardware - it
                  symbolizes my transformation. Awarded by Digital Dropout Skool
                  for exceptional performance, it became the tool that launched
                  my creative journey.
                </p>
                <div className="mt-4 flex items-center text-red-400">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="font-mono text-sm">
                    Performance Reward 2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
            CHAPTER TWO: THE HUSTLE
          </h3>
          <p className="text-white/80 leading-relaxed mb-6">
            That MacBook became my film studio. I taught myself color grading by
            watching YouTube tutorials at 2AM. Mastered transitions by failing
            spectacularly on client projects.
          </p>

          <div
            className="p-6 rounded-2xl mb-6 relative overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <h4 className="text-red-400 font-mono text-sm mb-3">
              CREATIVE TOOLS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              {[
                {
                  name: "My Trusted MacBook",
                  desc: "First real creative tool",
                },
                { name: "DaVinci Resolve", desc: "Color grading wizardry" },
                { name: "Premiere Pro", desc: "Editing playground" },
                { name: "After Effects", desc: "Motion magic" },
                { name: "Final Cut Pro", desc: "Final cut magic" },
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-white font-medium">{tool.name}</div>
                  <div className="text-white/60">{tool.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
            CHAPTER THREE: THE VISION
          </h3>
          <p className="text-white/80 leading-relaxed">
            "My journey proves that creativity can't be contained in classrooms.
            Real growth happens when you take that first shaky shot, render your
            first terrible edit, and keep going anyway."
          </p>

          <div
            className="mt-8 p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)",
            }}
          >
            <h4 className="text-red-400 font-mono text-sm mb-2">
              TO THOSE STARTING OUT:
            </h4>
            <p className="text-white/80 italic">
              "The equipment doesn't make the artist - your vision does. I went
              from bored student to visual storyteller with nothing but passion
              and a single laptop. If I can do it, so can you."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30" />
    </motion.div>
  );
};

// Skeleton Components
const AboutSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center">
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px]">
          <div
            className="h-full rounded-3xl animate-pulse"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              backdropFilter: "blur(20px)",
            }}
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="h-10 w-64 bg-red-900/20 rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function About() {
  const videoRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const [showBio, setShowBio] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [macbookImageLoaded, setMacbookImageLoaded] = useState(false);
  const [introVideo, setIntroVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntroVideo = async () => {
      try {
        setLoadingVideo(true);
        const response = await getVideoReelsByCategory("my-self-introduction");
        if (response.data?.videoReels?.length > 0) {
          setIntroVideo(response.data.videoReels[0]);
        }
      } catch (error) {
        console.error("Failed to fetch intro video:", error);
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchIntroVideo();

    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setVideoPlaying(false);
      video.currentTime = 0;
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => video.removeEventListener("ended", handleVideoEnd);
  }, []);

  const handlePlayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.muted = false;
      setVideoPlaying(true);
    }
  }, []);

  const toggleBio = useCallback(() => setShowBio((prev) => !prev), []);

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);

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

      <div className="container mx-auto px-4 py-16 md:py-20 h-full flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative z-20">
        {/* Video Card */}
        <LiquidGlassVideoCard
          video={introVideo}
          loading={loadingVideo}
          videoPlaying={videoPlaying}
          onPlay={handlePlayVideo}
          videoRef={videoRef}
        />

        {/* Right Column Content */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col lg:pl-8 xl:pl-12 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Terminal Badge */}
          <motion.div
            className="mb-6 md:mb-8 font-mono text-red-400 text-base md:text-lg inline-block px-4 py-2 rounded-full"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span>Jayed&gt; _ Passionate visual storyteller</span>
            <motion.span
              className="ml-1 inline-block"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.div>

          <div className="relative">
            {/* Profile Image - Floated right */}
            <LiquidGlassProfileImage
              imageLoaded={imageLoaded}
              setImageLoaded={setImageLoaded}
            />

            {/* Story Content - Wraps around the floated image */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                The Storyteller
              </h2>

              <p className="text-white/80 leading-relaxed font-light text-sm md:text-base">
                My journey began in the backstreets of Dhaka, armed with nothing
                but a handheld camcorder and relentless curiosity. Today, I
                craft visual narratives that make brands unforgettable and
                wedding moments eternal. From my first shaky footage to
                professional productions, every frame tells a story of growth
                and passion.
              </p>
            </div>
          </div>

          {/* Info Cards - Equal height grid */}
          <motion.div
            className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <LiquidGlassInfoCard
              title="Philosophy"
              content="Frame every shot like it's your last"
            />
            <LiquidGlassInfoCard
              title="Specialty"
              content="Emotional storytelling through movement"
            />
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={toggleBio}
            className="mt-6 md:mt-8 px-6 md:px-7 py-3 md:py-3.5 rounded-full transition-all duration-300 flex items-center group relative overflow-hidden w-fit"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.1)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at 30% 50%, rgba(239,68,68,0.3) 0%, transparent 70%)",
              }}
            />
            <span className="text-red-400 group-hover:text-white relative z-10 transition-colors text-sm md:text-base">
              Full Biography
            </span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 ml-2 text-red-400 group-hover:text-white group-hover:translate-x-1 transition-all relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Biography Modal */}
      <LiquidGlassModal
        showBio={showBio}
        toggleBio={toggleBio}
        macbookImageLoaded={macbookImageLoaded}
        setMacbookImageLoaded={setMacbookImageLoaded}
      />

      {/* Animation Styles */}
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

        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #f43f5e #0f0f0f;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #0f0f0f;
          border-left: 1px solid #ffffff10;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #f43f5e;
          border-radius: 4px;
          border: 1px solid #ffffff20;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: #e11d48;
        }
      `}</style>
    </section>
  );
}
