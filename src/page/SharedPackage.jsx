import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCheck, FaShareAlt, FaStar, FaClock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { getPackage } from "../services/api";
import { sharePackage } from "../utils/sharePackage";

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

export default function SharedPackage() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("No package was selected.");
      setLoading(false);
      return;
    }

    let mounted = true;

    getPackage(slug)
      .then((res) => {
        const packageData = res.data?.package || res.package || res.data || null;
        if (mounted) {
          if (packageData) {
            setPkg(packageData);
            setError("");
          } else {
            setError("This package could not be found.");
          }
        }
      })
      .catch(() => {
        if (mounted) setError("This package could not be found.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!shareFeedback) return;
    const timer = window.setTimeout(() => setShareFeedback(""), 1800);
    return () => window.clearTimeout(timer);
  }, [shareFeedback]);

  const handleShare = async () => {
    try {
      const result = await sharePackage(pkg?.slug || slug, pkg?.name || "Package");
      setShareFeedback(result.copied ? "Link copied to clipboard" : "Share options opened");
    } catch {
      setShareFeedback("Unable to share this package right now");
    }
  };

  const smoothEase = [0.34, 1.56, 0.64, 1];
  const softSpring = {
    type: "spring",
    stiffness: 200,
    damping: 30,
    mass: 0.8,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <BackgroundAnimation />

      <div className="container mx-auto px-4 pt-32 pb-16 max-w-5xl relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:border-white/20 group"
          >
            <motion.span
              whileHover={{ x: -3 }}
              transition={softSpring}
            >
              <FaArrowLeft className="w-4 h-4" />
            </motion.span>
            Back to pricing
          </Link>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 animate-spin" />
              <p className="text-gray-300">Loading package...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-12 text-center"
          >
            <div className="text-red-400 text-5xl mb-4">✕</div>
            <h1 className="text-2xl font-semibold text-white">Package not available</h1>
            <p className="mt-3 text-sm text-gray-400">{error}</p>
          </motion.div>
        ) : pkg ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="mt-10 rounded-[32px] border border-white/10 overflow-hidden"
            style={{
              background: "rgba(20, 20, 20, 0.7)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="p-8 md:p-10">
              {/* Header Section */}
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300"
                    >
                      {pkg.isPopular && <FaStar className="w-3 h-3" />}
                      {pkg.badge || "Shared Package"}
                    </span>
                    {pkg.isPopular && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                        <FaStar className="w-3 h-3" />
                        Most Popular
                      </span>
                    )}
                  </div>

                  <motion.h1
                    className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {pkg.name}
                  </motion.h1>

                  <motion.p
                    className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {pkg.description || "A custom package designed for your project needs."}
                  </motion.p>
                </div>

                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center min-w-[140px]"
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="text-4xl font-bold text-white">{pkg.price}</div>
                  <div className="mt-1 text-sm text-gray-400">{pkg.currency || "USD"}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.15em] text-red-300">
                    {pkg.billingType || "one-time"}
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <motion.div
                className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />

              {/* Content Grid */}
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                {/* Features Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="rounded-2xl border border-white/5 bg-white/5 p-6"
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaCheck className="w-4 h-4 text-red-400" />
                    What's included
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-gray-300">
                    {(pkg.features || []).map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <FaCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                        <span className="leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                    {(!pkg.features || pkg.features.length === 0) && (
                      <li className="text-gray-500">No features listed</li>
                    )}
                  </ul>
                </motion.div>

                {/* Action Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="rounded-2xl border border-white/5 bg-gradient-to-br from-red-500/10 via-transparent to-transparent p-6"
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h2 className="text-lg font-semibold text-white">Ready to talk?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Share this package with a client or open a conversation for a custom quote.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      <FaShareAlt className="w-4 h-4" />
                      Share this package
                    </motion.button>

                    <Link to="/contact">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 font-semibold text-gray-100 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                      >
                        Contact us
                      </motion.button>
                    </Link>
                  </div>

                  {shareFeedback && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-red-300"
                    >
                      {shareFeedback}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
        >
          <span className="flex items-center gap-2">
            <FaShieldAlt className="w-4 h-4 text-red-400" />
            Secure & trusted
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2">
            <FaClock className="w-4 h-4 text-red-400" />
            Quick delivery
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2">
            <FaHeadset className="w-4 h-4 text-red-400" />
            24/7 support
          </span>
        </motion.div>
      </div>
    </div>
  );
}