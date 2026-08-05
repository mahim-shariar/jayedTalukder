import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getPackages } from "../../services/api";
import { 
  FaCheck, 
  FaStar, 
  FaRocket, 
  FaShieldAlt, 
  FaHeadset,
  FaCreditCard,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

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
    <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
  </div>
);

// Liquid Glass Card Component
const PricingCard = ({ pkg, index }) => {
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

  const isFeatured = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative h-full"
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <div
            className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-2"
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 4px 20px rgba(239, 68, 68, 0.2)",
            }}
          >
            <FaStar className="w-3 h-3" />
            Most Popular
          </div>
        </div>
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
            className="relative p-6 rounded-[22px] overflow-hidden h-full flex flex-col"
            style={{
              background: isFeatured 
                ? "rgba(30, 20, 20, 0.8)" 
                : "rgba(20, 20, 20, 0.65)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: `
                0 25px 35px -12px rgba(0, 0, 0, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.05),
                inset 0 -1px 1px rgba(0, 0, 0, 0.1),
                ${isFeatured ? '0 0 30px rgba(239, 68, 68, 0.05)' : ''}
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
                    }%, rgba(255,255,255,0.06) 0%, transparent 60%)`
                ),
              }}
            />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/4 to-transparent" />
            </div>

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

            <motion.div
              className="absolute w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                left: useTransform(glowX, [-0.5, 0.5], [10, 70]),
                top: useTransform(glowY, [-0.5, 0.5], [10, 70]),
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.3s",
                filter: "blur(8px)",
              }}
            />

            <motion.div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 relative overflow-hidden self-start"
              style={{
                background: "rgba(35,35,35,0.9)",
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
              <span className="relative z-10">{pkg.name}</span>
            </motion.div>

            <div className="space-y-4 relative z-10 flex-1 flex flex-col">
              <div>
                <div className="flex items-baseline space-x-2">
                  <motion.span
                    className="text-4xl md:text-5xl font-extrabold text-white"
                    style={{
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                      transform: "translateZ(15px)",
                    }}
                  >
                    {pkg.price}
                  </motion.span>
                  <span className="text-sm text-gray-400">{pkg.currency}</span>
                </div>
                <div
                  className="inline-block text-xs px-2 py-1 rounded bg-gray-800/50 text-gray-400 self-start mt-1"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  {pkg.billingType}
                </div>
              </div>

              {pkg.description && (
                <motion.p
                  className="text-gray-300/80 text-sm leading-relaxed"
                  style={{
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                    transform: "translateZ(10px)",
                  }}
                >
                  {pkg.description}
                </motion.p>
              )}

              <motion.div
                className="h-px rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ef4444 0%, #dc2626 50%, transparent 100%)",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                  transform: "translateZ(12px)",
                }}
                animate={{
                  width: isHovered ? "100%" : "3rem",
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
              />

              <ul className="space-y-2 flex-1">
                {pkg.features && pkg.features.slice(0, 6).map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-400"
                    style={{ transform: "translateZ(8px)" }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <FaCheck className="mt-0.5 h-3.5 w-3.5 text-red-500/60 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

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

// Skeleton Component
const PricingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((n) => (
      <div key={n} className="relative group animate-pulse">
        <div
          className="relative rounded-2xl p-6 overflow-hidden h-96"
          style={{
            background: "rgba(20, 20, 20, 0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="space-y-4">
            <div className="w-24 h-8 bg-red-900/20 rounded-full" />
            <div className="h-12 w-32 bg-white/5 rounded" />
            <div className="h-4 w-20 bg-gray-800/50 rounded" />
            <div className="h-px w-12 bg-red-900/20 rounded-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/5 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function PricingSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPackages({ isActive: true, sort: "sortOrder" })
      .then((res) => {
        if (mounted) setPackages(res.data.packages || res.packages || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden bg-[#0a0a0a]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.02) 0%, transparent 70%)`,
      }}
    >
      <BackgroundAnimation />

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            Flexible Plans
          </div>

          <div className="space-y-2">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.5)" }}
            >
              Packages & 
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                Pricing
              </span>
            </h2>
          </div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-4">
            Choose a package that fits your project and budget. Upgrade anytime or contact us for a custom plan.
          </p>
        </motion.div>

        {loading ? (
          <PricingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages && packages.length > 0 ? (
              packages.slice(0, 3).map((pkg, index) => (
                <PricingCard key={pkg._id} pkg={pkg} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                <p className="text-gray-400">No packages available</p>
              </div>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center relative z-10 mt-12"
        >
          <div
            className="inline-block rounded-2xl px-6 py-6 md:px-10 md:py-8 overflow-hidden max-w-2xl w-full"
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
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-4"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium text-sm tracking-wide">
                Need a Custom Plan?
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>

            <p className="text-gray-300/80 mb-6 max-w-lg mx-auto text-base md:text-lg">
              Don't see what you're looking for? Contact us for a personalized package tailored to your specific needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact">
                <button
                  className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-[1.03] relative overflow-hidden group"
                  style={{ boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Contact Sales</span>
                </button>
              </Link>
              <Link to="/pricing">
                <button
                  className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-red-500/30 text-red-400 rounded-full font-semibold text-base hover:bg-red-500/10 transition-all duration-300 transform hover:scale-[1.03]"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  View All Plans
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-[1200px] {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
}