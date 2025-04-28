import { motion } from "framer-motion";
import { use } from "react";

import { FiFilm, FiCamera, FiEdit, FiHome, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const router = useNavigate();

  // Film reel animation variants
  const reelVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Text glitch effect
  const glitchVariants = {
    initial: { opacity: 1, x: 0 },
    animate: {
      opacity: 1,
      x: [0, -2, 2, -1, 1, 0],
      transition: {
        duration: 0.5,
        repeat: 3,
        repeatType: "reverse",
      },
    },
  };

  // Button hover effect
  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
    transition: { duration: 0.3 },
  };

  // Page transition
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative flex items-center justify-center"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-10 pointer-events-none z-10"></div>

      {/* Floating film particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0,
          }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
            opacity: [0, 0.5, 0],
            transition: {
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            },
          }}
        />
      ))}

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-20 text-center">
        {/* Film reel animation */}
        <motion.div
          className="relative mx-auto w-40 h-40 mb-12"
          variants={reelVariants}
        >
          <div className="absolute inset-0 rounded-full border-8 border-white/10 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border-4 border-white/5"></div>
          </div>
          {/* Film reel holes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-white/10 rounded-full "
              style={{
                left: "45%",
                top: "45%",

                transform: `rotate(${i * 30}deg) translateX(60px) rotate(-${
                  i * 30
                }deg)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <FiFilm className="text-red-500 text-4xl" />
          </div>
        </motion.div>

        {/* Glitchy 404 text */}
        <motion.div
          className="mb-8"
          variants={glitchVariants}
          animate="animate"
        >
          <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-white/80 mt-4">
            SCENE NOT FOUND
          </h2>
        </motion.div>

        <p className="max-w-2xl mx-auto text-white/70 mb-12 text-lg">
          The reel you're looking for has been cut or never made it to the final
          edit. Maybe it's on the cutting room floor, or perhaps you typed the
          wrong location.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {/* Error details cards */}
          <motion.div
            className="p-4 border border-white/10 bg-black/30 backdrop-blur-sm rounded-lg text-center w-36"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FiCamera className="text-red-400 text-2xl mx-auto mb-2" />
            <h3 className="text-sm font-medium">SHOT MISSING</h3>
            <p className="text-xs text-white/60 mt-1">Error 404</p>
          </motion.div>

          <motion.div
            className="p-4 border border-white/10 bg-black/30 backdrop-blur-sm rounded-lg text-center w-36"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FiFilm className="text-red-400 text-2xl mx-auto mb-2" />
            <h3 className="text-sm font-medium">REEL NOT FOUND</h3>
            <p className="text-xs text-white/60 mt-1">File Missing</p>
          </motion.div>

          <motion.div
            className="p-4 border border-white/10 bg-black/30 backdrop-blur-sm rounded-lg text-center w-36"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FiEdit className="text-red-400 text-2xl mx-auto mb-2" />
            <h3 className="text-sm font-medium">EDIT REQUIRED</h3>
            <p className="text-xs text-white/60 mt-1">Fix URL</p>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            onClick={() => router("/")}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiHome /> Back to Home
          </motion.button>

          <motion.button
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            onClick={() => router("/dashboard")}
            className="px-6 py-3 bg-transparent border border-white/20 hover:border-red-400 text-white rounded-lg flex items-center gap-2"
          >
            Go to Dashboard <FiArrowRight />
          </motion.button>
        </div>

        {/* Director's clapboard */}
        <motion.div
          className="mt-16 mx-auto w-64 bg-black/50 border border-white/10 rounded-lg p-4 relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="absolute -top-3 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
            DIRECTOR'S NOTE
          </div>
          <p className="text-sm text-white/80 italic">
            "Sometimes the best scenes are the ones we don't plan. Try a
            different take."
          </p>
        </motion.div>
      </div>

      {/* Film strip border effects */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-[#1a1a1a] border-b border-white/10 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full w-8 border-r border-white/5"></div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#1a1a1a] border-t border-white/10 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full w-8 border-r border-white/5"></div>
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-red-500 opacity-50"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-red-500 opacity-50"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-red-500 opacity-50"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-red-500 opacity-50"></div>
    </motion.div>
  );
}
