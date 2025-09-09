import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const productionStages = [
  {
    id: 1,
    title: "Pre-Production",
    icon: "📝",
    description: "Blueprinting your visual narrative",
    features: [
      "Concept development",
      "Storyboard creation",
      "Shot list planning",
      "Equipment selection",
    ],
    cta: "View Planning Samples",
    videoPreview:
      "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
  },
  {
    id: 2,
    title: "Production",
    icon: "🎥",
    description: "Capturing your vision frame by frame",
    features: [
      "On-set direction",
      "Cinematography",
      "Performance coaching",
      "Lighting design",
    ],
    cta: "See On-Set Work",
    videoPreview:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-at-her-desk-and-typing-on-her-51749-large.mp4",
  },
  {
    id: 3,
    title: "Post-Production",
    icon: "✂️",
    description: "Crafting the final story",
    features: [
      "Editing & color grading",
      "Sound design",
      "Visual effects",
      "Motion graphics",
    ],
    cta: "View Post Samples",
    videoPreview:
      "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-typing-on-a-laptop-40837-large.mp4",
  },
  {
    id: 4,
    title: "Delivery",
    icon: "🚀",
    description: "Optimized for every platform",
    features: [
      "4K/8K mastering",
      "Platform encoding",
      "HDR/SDR versions",
      "Quality control",
    ],
    cta: "Delivery Specs",
    videoPreview:
      "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-working-on-a-desk-40985-large.mp4",
  },
];

// Animation variants for desktop
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const timelineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const dotVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

// Mobile-specific variants
const mobileContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const mobileCardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const mobileIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
};

export default function ProductionProcess() {
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleMouseEnter = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index]
        .play()
        .catch((e) => console.log("Autoplay prevented:", e));
    }
  };

  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="min-h-screen py-12 md:py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

      {/* Content container with Framer Motion animation */}
      <motion.div
        className="container mx-auto px-4 relative z-20"
        variants={isMobile ? mobileContainerVariants : containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Framer Motion */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          variants={isMobile ? mobileCardVariants : itemVariants}
        >
          <h2 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-4">
            EDITOR'S WORKFLOW
          </h2>
          <div className="font-mono text-red-400/80 text-sm md:text-lg">
            <span>
              Jayed&gt; _ My creative process from concept to delivery
            </span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </motion.div>

        {/* Mobile Layout */}
        {isMobile ? (
          <div className="md:hidden">
            {/* Horizontal Scroller Container for Mobile */}
            <div
              className="overflow-x-auto pb-10 snap-x snap-mandatory hide-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex w-[calc(85vw*4+1.5rem*3)]">
                {productionStages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    id={`stage-${index}`}
                    className="w-[85vw] ml-4 first:ml-6 flex-shrink-0 snap-start"
                    variants={mobileCardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="relative overflow-hidden rounded-xl border border-white/10 mb-6"
                      onTouchStart={() => setActiveStage(index)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={stage.videoPreview}
                        muted
                        loop
                        playsInline
                        className="w-full h-auto aspect-video object-cover opacity-90"
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="text-xs font-mono bg-black/70 px-2 py-1 rounded">
                          {stage.title.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center mb-4">
                        <motion.span
                          className="text-3xl mr-3"
                          variants={mobileIconVariants}
                        >
                          {stage.icon}
                        </motion.span>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-white/80 mb-4 text-sm">
                        {stage.description}
                      </p>

                      <ul className="grid grid-cols-1 gap-2 mb-4">
                        {stage.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 + i * 0.05 }}
                          >
                            <svg
                              className="w-4 h-4 mt-0.5 mr-2 text-red-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            <span className="text-sm text-white/90">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        className="w-full px-4 py-2.5 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center justify-center text-sm rounded-lg group"
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {stage.cta}
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress indicator for mobile */}
            <div className="flex justify-center mt-6">
              {productionStages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === activeStage ? "bg-red-500" : "bg-white/30"
                  }`}
                  onClick={() => {
                    const element = document.getElementById(`stage-${index}`);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                      });
                    }
                    setActiveStage(index);
                  }}
                  aria-label={`Go to stage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="hidden md:block relative">
            {/* Vertical timeline line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-red-500/20 via-red-500/50 to-transparent origin-top"
              variants={timelineVariants}
              initial="hidden"
              animate="visible"
            ></motion.div>

            {/* Process cards with Framer Motion */}
            <div className="space-y-32 py-16">
              {productionStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  className={`relative flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } items-center gap-12`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  whileHover={{ scale: 1.02 }}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 border-4 border-[#0a0a0a] z-10"
                    variants={dotVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.2 }}
                  />

                  {/* Video preview */}
                  <motion.div
                    className="flex-1 relative overflow-hidden rounded-xl border border-white/10 group"
                    whileHover={{ scale: 1.03 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: index * 0.2 + 0.2,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={stage.videoPreview}
                      muted
                      loop
                      playsInline
                      className="w-full h-auto aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="text-xs font-mono bg-black/70 px-2 py-1 rounded">
                        {stage.title.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>

                  {/* Stage details */}
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{stage.icon}</span>
                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="text-white/80 mb-6">{stage.description}</p>

                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {stage.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                        >
                          <svg
                            className="w-4 h-4 mt-0.5 mr-2 text-red-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-sm text-white/90">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.button
                      className="px-4 py-2.5 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center justify-center text-sm rounded-lg group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.8 }}
                    >
                      {stage.cta}
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA with Framer Motion */}
        <motion.div
          className="mt-20 md:mt-32 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a href="#contact">
            <motion.button
              className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg relative overflow-hidden group"
              whileHover={{ scale: isMobile ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Start Your Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            </motion.button>
          </a>

          <p className="mt-4 md:mt-6 text-white/60 text-sm font-mono">
            Let's collaborate on something extraordinary
          </p>
        </motion.div>
      </motion.div>

      {/* Floating UI elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-red-500/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-20 w-40 h-40 rounded-full bg-red-500/10 blur-3xl -z-10"></div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
