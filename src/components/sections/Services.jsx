import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

const productionStages = [
  {
    number: "01",
    title: "Pre-Production",
    description:
      "Blueprinting your visual narrative with meticulous planning and creative direction. Complete storyboarding and shot list preparation.",
    color: "red",
  },
  {
    number: "02",
    title: "Production",
    description:
      "Capturing your vision frame by frame with professional expertise. On-set direction, cinematography, and lighting design.",
    color: "red",
  },
  {
    number: "03",
    title: "Post-Production",
    description:
      "Crafting the final story through expert editing and visual enhancement. Color grading, sound design, and motion graphics.",
    color: "red",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Optimized delivery for every platform with pristine quality assurance. 4K/8K mastering and platform-specific encoding.",
    color: "red",
  },
];

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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const connectorVariants = {
  hidden: { pathLength: 0, strokeDashoffset: 1000 },
  visible: {
    pathLength: 1,
    strokeDashoffset: 0,
    transition: { duration: 2, ease: "easeInOut" },
  },
};

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
  </div>
);

// Liquid Glass Card Component - No Red on Hover
const LiquidGlassCard = ({ stage, index }) => {
  const isLeft = index % 2 === 0;
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for buttery smooth animation
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
      className={`relative z-20 ${
        isLeft ? "order-2 md:order-1" : "order-1 md:order-2"
      }`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
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
        {/* Main card container */}
        <div className="relative rounded-2xl md:rounded-3xl p-px overflow-hidden md:w-80 w-72">
          {/* Subtle border gradient - White only */}
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
            className="relative p-6 md:p-8 rounded-[22px] md:rounded-[30px] overflow-hidden"
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
            {/* Dynamic light overlay - Pure white/transparent, NO RED */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
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
            <div className="absolute inset-0 pointer-events-none">
              {/* Top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent" />
              {/* Bottom shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
              {/* Left edge light */}
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              {/* Right edge light */}
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/4 to-transparent" />
            </div>

            {/* Floating reflection - White only */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(circle at ${(x + 0.5) * 100}% ${
                      (y + 0.5) * 100
                    }%, rgba(255,255,255,0.05) 0%, transparent 50%)`
                ),
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />

            {/* Specular highlight spot - White only */}
            <motion.div
              className="absolute w-32 h-32 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                left: useTransform(glowX, [-0.5, 0.5], [10, 70]),
                top: useTransform(glowY, [-0.5, 0.5], [10, 70]),
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s",
                filter: "blur(8px)",
              }}
            />

            {/* Number Badge - Red theme stays */}
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl font-mono text-lg md:text-xl font-bold mb-5 md:mb-6 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(35,35,35,0.9) 0%, rgba(25,25,25,0.95) 100%)",
                backdropFilter: "blur(10px)",
                color: "#f87171",
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.06),
                  inset 0 -2px 4px rgba(0,0,0,0.2),
                  0 8px 16px -4px rgba(0,0,0,0.3)
                `,
                transform: "translateZ(20px)",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/6 to-transparent" />
              <span className="relative z-10">{stage.number}</span>
            </motion.div>

            {/* Content */}
            <div className="space-y-4 md:space-y-5 relative z-10">
              <motion.h2
                className="text-lg md:text-xl font-semibold tracking-tight text-white leading-tight"
                style={{
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                  transform: "translateZ(15px)",
                }}
              >
                {stage.title}
              </motion.h2>

              {/* Divider Line - Red stays */}
              <motion.div
                className="h-px rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #ef4444 0%, #dc2626 50%, transparent 100%)",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                  transform: "translateZ(12px)",
                }}
                animate={{
                  width: isHovered ? "100%" : "3rem",
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
              />

              <motion.p
                className="text-gray-300/80 text-sm md:text-base leading-relaxed"
                style={{
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                  transform: "translateZ(10px)",
                }}
              >
                {stage.description}
              </motion.p>
            </div>

            {/* Edge highlights - White only */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Corner accents - White only */}
            <motion.div
              className="absolute top-3 right-3 w-2 h-2"
              animate={{
                opacity: isHovered ? 0.8 : 0.3,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-white/40 rounded-full blur-[1px]" />
            </motion.div>
            <motion.div
              className="absolute bottom-3 left-3 w-1.5 h-1.5"
              animate={{
                opacity: isHovered ? 0.6 : 0.2,
              }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full blur-[1px]" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Connector SVG Component - Red theme
const Connector = ({
  id,
  className = "",
  path = "M10,100 Q200,50 390,100",
}) => (
  <div
    className={`absolute z-10 w-80 h-40 transform hidden md:block ${className}`}
  >
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main dashed line */}
      <motion.path
        d={path}
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeDasharray="5 7"
        fill="none"
        filter={`url(#glow-${id})`}
        variants={connectorVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        opacity="0.5"
      />

      {/* Flowing particle */}
      <motion.circle
        r="3"
        fill="#ef4444"
        filter={`url(#glow-${id})`}
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        viewport={{ once: true }}
      >
        <animateMotion dur="3s" repeatCount="indefinite" path={path} />
      </motion.circle>
    </svg>
  </div>
);

// Stage Row Component
const StageRow = ({ stages, rowIndex, isLast = false }) => {
  const [stage1, stage2] = stages;
  const baseIndex = rowIndex * 2;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl gap-12 md:flex-row md:gap-32">
        <LiquidGlassCard stage={stage1} index={baseIndex} />
        <Connector
          id={`horizontal-${rowIndex}`}
          className="md:top-6 rotate-0"
          path="M10,100 Q200,50 390,100"
        />
        <LiquidGlassCard stage={stage2} index={baseIndex + 1} />
      </div>

      {!isLast && (
        <Connector
          id={`vertical-${rowIndex}`}
          className="md:top-[18rem] md:rotate-45"
          path="M10,100 Q200,150 390,100"
        />
      )}
    </div>
  );
};

// Skeleton Components
const LiquidCardSkeleton = () => (
  <div className="relative group w-72 md:w-80 animate-pulse">
    <div
      className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 overflow-hidden"
      style={{
        background: "rgba(20, 20, 20, 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-red-900/20 mb-5 md:mb-6" />
      <div className="space-y-4 md:space-y-5">
        <div className="h-6 w-3/4 bg-white/5 rounded" />
        <div className="h-px w-12 bg-red-900/20 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-4 bg-white/5 rounded w-4/6" />
        </div>
      </div>
    </div>
  </div>
);

const ProductionProcessSkeleton = () => (
  <div className="flex flex-col text-left justify-center items-center w-full mx-auto py-12 gap-16 md:gap-24 relative overflow-hidden bg-[#0a0a0a]">
    <div className="text-center space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-red-900/20 rounded-full mx-auto" />
      <div className="space-y-3">
        <div className="h-12 w-96 bg-red-900/15 rounded-lg mx-auto" />
        <div className="h-12 w-80 bg-red-900/15 rounded-lg mx-auto" />
      </div>
      <div className="h-5 w-72 bg-red-900/10 rounded-full mx-auto" />
    </div>

    <div className="relative flex flex-col items-center justify-center w-full gap-12 p-4 md:gap-20 z-10">
      {[1, 2].map((row) => (
        <div
          key={row}
          className="relative flex flex-col items-center justify-center w-full max-w-4xl gap-12 md:flex-row md:gap-32"
        >
          <LiquidCardSkeleton />
          <LiquidCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

// Main Component
export default function ProductionProcess() {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: !loading ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  const stageProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, productionStages.length - 1]
  );

  useEffect(() => {
    if (loading) return;
    const unsubscribe = stageProgress.on("change", (latest) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setActiveStage(Math.floor(latest));
        rafRef.current = null;
      });
    });
    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stageProgress, loading]);

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);
  const stagePairs = [
    productionStages.slice(0, 2),
    productionStages.slice(2, 4),
  ];

  if (loading) return <ProductionProcessSkeleton />;

  return (
    <section
      ref={containerRef}
      id="process"
      className="flex flex-col text-left justify-center items-center w-full mx-auto py-12 gap-16 md:gap-24 relative overflow-hidden bg-[#0a0a0a] min-h-screen"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.02) 0%, transparent 70%)`,
      }}
    >
      {memoizedBackground}

      {/* Header - Red theme stays */}
      <motion.div
        className="text-center space-y-4 relative z-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#f87171",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
          }}
        >
          Jayed's Workflow
        </div>

        <div className="space-y-2">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.5)" }}
          >
            Professional
          </h2>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Video Editing Process
            </span>
          </h2>
        </div>

        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          From concept to final delivery, a streamlined workflow for exceptional
          results
        </p>
      </motion.div>

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="relative hidden md:flex flex-col items-center justify-center w-full gap-12 p-4 md:gap-20 z-10">
          {stagePairs.map((pair, index) => (
            <StageRow
              key={index}
              stages={pair}
              rowIndex={index}
              isLast={index === stagePairs.length - 1}
            />
          ))}
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="md:hidden w-full px-4 z-10">
          <div className="overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-4">
              {productionStages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="w-[85vw] flex-shrink-0 snap-start"
                >
                  <LiquidGlassCard stage={stage} index={index} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-6">
            {productionStages.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeStage
                    ? "w-8 bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50"
                    : "w-1.5 bg-gray-700"
                }`}
                aria-label={`Go to stage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA Section - Red theme stays */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center relative z-10 p-6 md:p-8"
      >
        <div
          className="inline-block rounded-2xl md:rounded-3xl px-6 py-6 md:px-10 md:py-8 overflow-hidden max-w-2xl"
          style={{
            background: "rgba(25, 25, 25, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: `
              0 25px 35px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 1px rgba(255, 255, 255, 0.04),
              0 0 0 1px rgba(239, 68, 68, 0.15)
            `,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-5"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-medium text-sm tracking-wide">
              Ready to Start?
            </span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>

          <p className="text-gray-300/80 mb-6 max-w-lg mx-auto text-base md:text-lg">
            Ready to bring your vision to life with professional video editing?
            Let's collaborate and create something extraordinary together.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact">
              <button
                className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-[1.03] relative overflow-hidden group"
                style={{ boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">Start Your Project</span>
              </button>
            </a>
            <a href="#showreel">
              <button
                className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-red-500/30 text-red-400 rounded-full font-semibold text-base hover:bg-red-500/10 transition-all duration-300 transform hover:scale-[1.03]"
                style={{ backdropFilter: "blur(10px)" }}
              >
                View Portfolio
              </button>
            </a>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .perspective-[1200px] {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
}
