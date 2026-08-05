import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { getReviews } from "../../services/api";

// Background Animation Component with second component's style
const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

    {/* Animated grid */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

    {/* Animated particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.15,
          }}
        />
      ))}
    </div>

    {/* Binary rain effect */}
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-500/30 font-mono text-lg"
          animate={{
            y: ["-100%", "100%"],
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        >
          {Math.random() > 0.5 ? "1" : "0"}
        </motion.div>
      ))}
    </div>
  </div>
);

// Liquid Glass Testimonial Card Component
const LiquidGlassTestimonialCard = ({
  testimonial,
  index,
  isSelected,
  onClick,
}) => {
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

  const renderStars = (count) => {
    return Array(count || 5)
      .fill()
      .map((_, i) => (
        <motion.svg
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ));
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-[1200px] cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
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

        {/* Selected indicator border */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "transparent",
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
            }}
            layoutId="selectedBorder"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Card body - Liquid Glass */}
        <div
          className="relative p-5 rounded-[22px] overflow-hidden"
          style={{
            background: isSelected
              ? "rgba(30, 30, 30, 0.75)"
              : "rgba(20, 20, 20, 0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: `
              0 25px 35px -12px rgba(0, 0, 0, 0.4),
              inset 0 1px 1px rgba(255, 255, 255, 0.05)
            `,
            transition: "background 0.3s ease",
          }}
        >
          {/* Dynamic light overlay */}
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

          {/* Liquid glass layers */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Stars */}
          <div className="flex mb-3 relative z-10">
            {renderStars(testimonial.rating)}
          </div>

          {/* Content */}
          <p className="text-white/80 text-sm line-clamp-3 mb-4 relative z-10 leading-relaxed">
            {testimonial.content || "No review content available"}
          </p>

          {/* Author info */}
          <div className="flex items-center justify-between relative z-10">
            <p className="text-red-400 text-sm font-medium">
              {testimonial.userName || testimonial.user?.name || "Anonymous"}
            </p>
            <span className="text-white/30 text-xs">
              {testimonial.createdAt
                ? new Date(testimonial.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          {/* Edge highlights */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Corner accent */}
          <motion.div
            className="absolute top-3 right-3 w-1.5 h-1.5"
            animate={{
              opacity: isHovered ? 0.8 : 0.3,
            }}
          >
            <div className="absolute inset-0 bg-white/40 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Liquid Glass Detail Card Component
const LiquidGlassDetailCard = ({ testimonial, activeTab, setActiveTab }) => {
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

  const renderStars = (count) => {
    return Array(count || 5)
      .fill()
      .map((_, i) => (
        <motion.svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ));
  };

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
          className="relative p-6 md:p-8 rounded-[22px] md:rounded-[30px] overflow-hidden h-full"
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
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6 relative z-10">
            <button
              className={`py-2 px-4 font-medium text-sm transition-all relative ${
                activeTab === "text"
                  ? "text-red-400"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Review Text
              {activeTab === "text" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
            {testimonial?.screenshot && (
              <button
                className={`py-2 px-4 font-medium text-sm transition-all relative ${
                  activeTab === "screenshot"
                    ? "text-red-400"
                    : "text-white/60 hover:text-white"
                }`}
                onClick={() => setActiveTab("screenshot")}
              >
                Actual Screenshot
                {activeTab === "screenshot" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )}
          </div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === "text" ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="flex mb-6">
                  {renderStars(testimonial?.rating)}
                </div>

                <div className="mb-8">
                  <blockquote className="text-white/90 text-lg md:text-xl italic leading-relaxed">
                    {testimonial?.content || "No review content available"}
                  </blockquote>
                </div>

                <div className="flex items-center pt-6 border-t border-white/10">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg mr-4"
                    whileHover={{ scale: 1.05 }}
                    style={{
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                    }}
                  >
                    {testimonial?.userName?.charAt(0) ||
                      testimonial?.user?.name?.charAt(0) ||
                      "A"}
                  </motion.div>
                  <div>
                    <p className="text-red-400 font-medium">
                      {testimonial?.userName ||
                        testimonial?.user?.name ||
                        "Anonymous"}
                    </p>
                    <p className="text-white/50 text-sm">
                      {testimonial?.createdAt
                        ? new Date(testimonial?.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="screenshot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={testimonial?.screenshot}
                    alt={`Review from ${
                      testimonial?.userName ||
                      testimonial?.user?.name ||
                      "Anonymous"
                    }`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <div
                    className="absolute bottom-4 left-4 text-sm px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(0, 0, 0, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Actual client review
                  </div>
                </div>

                <div className="flex items-center mt-6 pt-6 border-t border-white/10">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg mr-4"
                    whileHover={{ scale: 1.05 }}
                    style={{
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                    }}
                  >
                    {testimonial?.userName?.charAt(0) ||
                      testimonial?.user?.name?.charAt(0) ||
                      "A"}
                  </motion.div>
                  <div>
                    <p className="text-red-400 font-medium">
                      {testimonial?.userName ||
                        testimonial?.user?.name ||
                        "Anonymous"}
                    </p>
                    <p className="text-white/50 text-sm">
                      {testimonial?.createdAt
                        ? new Date(testimonial?.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edge highlights */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

// Liquid Glass Marquee Item
const LiquidGlassMarqueeItem = ({ testimonial }) => {
  const renderStars = (count) => {
    return Array(count || 5)
      .fill()
      .map((_, i) => (
        <motion.svg
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          whileHover={{ scale: 1.2 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ));
  };

  return (
    <div className="inline-flex items-center mx-5">
      <div className="flex mr-2">{renderStars(testimonial.rating)}</div>
      <span className="text-red-400 font-medium mr-2">
        {testimonial.userName || testimonial.user?.name || "Anonymous"}:
      </span>
      <span className="text-white/80 text-sm max-w-xs truncate">
        {testimonial.content || "No review content available"}
      </span>
      <div className="mx-2 text-red-500/40">◆</div>
    </div>
  );
};

// Skeleton Components
const TestimonialsSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a] py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-12 w-64 bg-red-900/20 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-48 bg-red-900/10 rounded-full mx-auto animate-pulse" />
      </div>

      <div className="h-12 border-y border-red-500/30 mb-16 animate-pulse" />

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="h-7 w-40 bg-white/5 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl animate-pulse"
              style={{ background: "rgba(20, 20, 20, 0.5)" }}
            >
              <div className="flex mb-3 gap-1">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-4 h-4 bg-yellow-900/30 rounded" />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="h-4 bg-white/5 rounded w-4/6" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-red-900/20 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-3/5">
          <div className="h-7 w-40 bg-white/5 rounded mb-6 animate-pulse" />
          <div
            className="rounded-3xl p-8 h-96 animate-pulse"
            style={{ background: "rgba(20, 20, 20, 0.5)" }}
          />
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getReviews({ isBest: true });
        setTestimonials(response.data.reviews || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load testimonials");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);

  if (loading) return <TestimonialsSkeleton />;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="min-h-screen py-24 text-white relative overflow-hidden"
    >
      {memoizedBackground}

      <div className="container mx-auto px-4 relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide mb-4"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(10px)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
            }}
          >
            Client Praise
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Voices of
            </span>{" "}
            Satisfaction
          </h2>

          <div className="font-mono text-red-400/80 text-lg">
            <span>Jayed&gt; _ Real feedback from real clients</span>
            <motion.span
              className="ml-1 inline-block"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              _
            </motion.span>
          </div>
        </motion.div>

        {error ? (
          <div className="text-center py-16">
            <div
              className="inline-block p-8 rounded-2xl"
              style={{
                background: "rgba(20, 20, 20, 0.5)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <p className="text-gray-400">No testimonials available yet.</p>
            </div>
          </div>
        ) : testimonials.length > 0 ? (
          <>
            {/* Marquee Banner */}
            <div className="relative mb-16 overflow-hidden py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent z-10 pointer-events-none" />
              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

              <motion.div
                ref={marqueeRef}
                className="flex whitespace-nowrap"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {[...testimonials, ...testimonials].map(
                  (testimonial, index) => (
                    <LiquidGlassMarqueeItem
                      key={`${testimonial._id}-${index}`}
                      testimonial={testimonial}
                    />
                  )
                )}
              </motion.div>

              {/* Top and bottom borders */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Testimonials List */}
              <div className="w-full lg:w-2/5">
                <h3 className="text-xl font-semibold text-red-400 mb-6">
                  All Testimonials
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-custom">
                  {testimonials.map((testimonial, index) => (
                    <LiquidGlassTestimonialCard
                      key={testimonial._id}
                      testimonial={testimonial}
                      index={index}
                      isSelected={selectedTestimonial === index}
                      onClick={() => setSelectedTestimonial(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Detail View */}
              <div className="w-full lg:w-3/5">
                <h3 className="text-xl font-semibold text-red-400 mb-6">
                  Review Details
                </h3>

                <LiquidGlassDetailCard
                  testimonial={testimonials[selectedTestimonial]}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div
              className="inline-block p-8 rounded-2xl"
              style={{
                background: "rgba(20, 20, 20, 0.5)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <p className="text-white/50">No testimonials available yet.</p>
            </div>
          </div>
        )}
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
        .perspective-[1200px] {
          perspective: 1200px;
        }

        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #f43f5e #0f0f0f;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
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
