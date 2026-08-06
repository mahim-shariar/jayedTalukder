import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { getPackages } from "../services/api";
import { useMotionValue, useSpring, useTransform,motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { sharePackage } from "../utils/sharePackage";
import { 
  FaCheck, 
  FaStar, 
  FaRocket, 
  FaShieldAlt, 
  FaHeadset,
  FaWallet,
  FaClock,
  FaCreditCard,
  FaPhone,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaShareAlt
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

// Pricing Card Component
const PricingCard = ({ pkg, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  const glowX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const glowY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const isFeatured = index === 1;

  useEffect(() => {
    if (!shareFeedback) return;
    const timer = window.setTimeout(() => setShareFeedback(""), 1800);
    return () => window.clearTimeout(timer);
  }, [shareFeedback]);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await sharePackage(pkg.slug || pkg._id, pkg.name);
      setShareFeedback(result.copied ? "Link copied to clipboard" : "Share link ready");
    } catch {
      setShareFeedback("Unable to share package");
    }
  };

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

            <div className="flex items-start justify-between gap-3 mb-4">
              <motion.div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium relative overflow-hidden self-start"
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

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-gray-200 backdrop-blur transition hover:bg-white/10"
                title={`Share ${pkg.name}`}
              >
                <FaShareAlt className="h-3.5 w-3.5" />
                Share
              </button>
            </div>

            {shareFeedback && (
              <p className="text-xs text-red-300/90 mb-3 relative z-10">{shareFeedback}</p>
            )}

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
                {pkg.features && pkg.features.map((feature, i) => (
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

// Features Section - All cards same height
const FeaturesSection = () => {
  const features = [
    {
      icon: FaRocket,
      title: "Fast Delivery",
      description: "Get your projects delivered on time with our efficient workflow"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payment",
      description: "Your transactions are protected with industry-standard security"
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Our team is always here to help you with any questions"
    },
    {
      icon: FaCreditCard,
      title: "Flexible Payment",
      description: "Choose from multiple payment options that suit your needs"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16 px-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative h-full"
        >
          <div
            className="p-6 rounded-2xl text-center h-full flex flex-col items-center justify-center"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Premium FAQ Section with expand/collapse
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can easily upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. Contact our support team for assistance with plan transitions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, MasterCard, and American Express. We also support bank transfers for enterprise clients. All transactions are secure and encrypted."
    },
    {
      question: "How does the billing cycle work?",
      answer: "Our billing cycle is monthly for all plans. You'll be charged on the same date each month. For annual plans, we offer a discounted rate with a yearly commitment. All subscriptions automatically renew unless cancelled."
    },
    {
      question: "Can I get a custom plan?",
      answer: "Absolutely! We understand that every business has unique needs. Contact our sales team to create a custom plan tailored to your specific requirements, including custom features and volume discounts."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 email and chat support for all plans. Premium plans include priority support with dedicated account managers and faster response times. Our team is always ready to help."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-20 px-4"
    >
      <div className="text-center mb-12">
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
          FAQ
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white">
          Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">Questions</span>
        </h3>
        <p className="text-gray-400 mt-3">Everything you need to know about our plans</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
            >
              <span className="text-white font-medium pr-4">{faq.question}</span>
              <span className="flex-shrink-0 ml-4 text-red-400">
                {openIndex === index ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </span>
            </button>
            
            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <div className="h-px w-full bg-gradient-to-r from-red-500/20 to-transparent mb-3" />
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Skeleton Component
const PricingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default function PricingPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const selectedPackageSlug = new URLSearchParams(location.search).get("package");
  const visiblePackages = useMemo(() => {
    if (!selectedPackageSlug) return packages;

    return packages.filter((pkg) => {
      const slug = pkg.slug || pkg._id;
      return slug?.toLowerCase() === selectedPackageSlug.toLowerCase();
    });
  }, [packages, selectedPackageSlug]);

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

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {memoizedBackground}

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Choose Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 block mt-2">
                Perfect Plan
              </span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Transparent pricing for every project. No hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="relative z-10 pb-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <PricingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {visiblePackages && visiblePackages.length > 0 ? (
                visiblePackages.map((pkg, index) => (
                  <PricingCard key={pkg._id || pkg.slug} pkg={pkg} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  <p className="text-gray-400">No packages found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <FeaturesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative z-10 px-4 py-16"
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: "rgba(25, 25, 25, 0.8)",
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
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium text-sm tracking-wide">
                Have Questions?
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Help Choosing?
            </h2>

            <p className="text-gray-300/80 mb-8 max-w-lg mx-auto text-base">
              Not sure which plan is right for you? Our team is here to help you find the perfect solution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-[1.03] relative overflow-hidden group"
                  style={{ boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    <FaPhone className="w-4 h-4" />
                    Contact Sales
                  </span>
                </button>
              </Link>
              
              <a href="mailto:jayedbinkibria@gmail.com">
                <button
                  className="px-8 py-4 bg-transparent border border-red-500/30 text-red-400 rounded-full font-semibold text-base hover:bg-red-500/10 transition-all duration-300 transform hover:scale-[1.03] flex items-center gap-2 justify-center"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  <FaEnvelope className="w-4 h-4" />
                  Email Us
                </button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <FaShieldAlt className="w-3 h-3 text-red-400" />
                Secure payment
              </span>
              <span className="flex items-center gap-2">
                <FaHeadset className="w-3 h-3 text-red-400" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .perspective-[1200px] {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
}