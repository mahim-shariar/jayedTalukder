// components/Contact.js
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import confetti from "canvas-confetti";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiSend, FiLoader } from "react-icons/fi";
import { BsStars, BsPencil } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaSquareXTwitter } from "react-icons/fa6";

// Note: You'll need to create this emailService file
// For now, let's create a mock function
const sendEmail = async (data) => {
  // Mock email sending - replace with your actual email service
  console.log("Sending email:", data);
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
};

// Liquid Glass Form Card Component
const LiquidGlassFormCard = ({
  isSubmitted,
  isLoading,
  formData,
  handleChange,
  handleSubmit,
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
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative rounded-2xl md:rounded-3xl p-px overflow-hidden">
        {/* Subtle border gradient */}
        <motion.div
          className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${(glowX.get() + 0.5) * 100}% ${
              (glowY.get() + 0.5) * 100
            }%, rgba(255,255,255,0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Card body - Liquid Glass */}
        <div
          className="relative p-6 md:p-7 rounded-[22px] md:rounded-[30px] overflow-hidden"
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
              background: `radial-gradient(circle at ${(glowX.get() + 0.5) * 100}% ${
                (glowY.get() + 0.5) * 100
              }%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            }}
          />

          {/* Liquid glass layers */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/4 to-transparent" />

          <h3 className="text-xl font-medium mb-6 flex items-center relative z-10">
            <BsPencil className="text-red-400 mr-3" />
            <span>Send a Message</span>
          </h3>

          {isSubmitted ? (
            <motion.div
              className="text-center py-8 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <BsStars className="text-4xl mb-4 mx-auto text-red-400" />
              </motion.div>
              <h4 className="text-lg font-medium mb-2">Message Sent!</h4>
              <p className="text-white/70">I'll get back to you soon</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder-white/40"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(239, 68, 68, 0.5)";
                    e.target.style.boxShadow =
                      "0 0 15px rgba(239, 68, 68, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder-white/40"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(239, 68, 68, 0.5)";
                    e.target.style.boxShadow =
                      "0 0 15px rgba(239, 68, 68, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Tell me about your project..."
                  className="w-full rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder-white/40 resize-none"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(239, 68, 68, 0.5)";
                    e.target.style.boxShadow =
                      "0 0 15px rgba(239, 68, 68, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <motion.button
                  type="submit"
                  className="w-full py-3 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center group mt-4 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="flex items-center relative z-10">
                    {isLoading ? (
                      <>
                        <FiLoader className="mr-2 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>
          )}

          {/* Edge highlights */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Corner accent */}
          <motion.div
            className="absolute top-3 right-3 w-2 h-2"
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

// Liquid Glass Contact Card Component
const LiquidGlassContactCard = ({ link, index }) => {
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
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <motion.a
      ref={cardRef}
      href={link.url}
      className="block relative group perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1 + 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true }}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative rounded-xl p-px overflow-hidden">
        {/* Subtle border gradient */}
        <motion.div
          className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${(glowX.get() + 0.5) * 100}% ${
              (glowY.get() + 0.5) * 100
            }%, rgba(255,255,255,0.12) 0%, transparent 70%)`,
          }}
        />

        {/* Card body - Liquid Glass */}
        <div
          className="relative p-5 rounded-[20px] overflow-hidden"
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
          {/* Dynamic light overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${(glowX.get() + 0.5) * 100}% ${
                (glowY.get() + 0.5) * 100
              }%, rgba(255,255,255,0.05) 0%, transparent 60%)`,
            }}
          />

          {/* Liquid glass layers */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center relative z-10">
            <span
              className="text-lg mr-4 group-hover:text-red-400 transition-colors p-2 rounded-lg"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              {link.icon}
            </span>
            <div className="flex-1">
              <h4 className="font-medium group-hover:text-red-400 transition-colors">
                {link.platform}
              </h4>
              <p className="text-white/70 text-sm mt-1">{link.handle}</p>
            </div>
            <motion.span
              className="text-white/30 group-hover:text-red-400 transition-colors"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </div>

          {/* Edge highlights */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Corner accent */}
          <motion.div
            className="absolute top-2 right-2 w-1.5 h-1.5"
            animate={{
              opacity: isHovered ? 0.6 : 0.2,
            }}
          >
            <div className="absolute inset-0 bg-white/40 rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

// Generate geometric shapes for background
const generateGeometricShapes = () => {
  const shapes = [];
  const colors = ["#ff6b6b", "#ff5252", "#ff3838", "#ff1a1a"];

  for (let i = 0; i < 12; i++) {
    const size = Math.random() * 80 + 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;
    const isCircle = Math.random() > 0.5;

    shapes.push(
      <motion.div
        key={`shape-${i}`}
        className={`absolute ${isCircle ? "rounded-full" : ""} opacity-5`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          rotate: rotation,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, Math.random() * 10 - 5, 0],
          rotate: [rotation, rotation + 45, rotation],
        }}
        transition={{
          duration: Math.random() * 15 + 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  return shapes;
};

// Generate floating grid dots
const generateGridDots = () => {
  const dots = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      dots.push(
        <motion.div
          key={`dot-${i}-${j}`}
          className="absolute rounded-full bg-red-500 opacity-10"
          style={{
            left: `${12.5 * j + 6.25}%`,
            top: `${12.5 * i + 6.25}%`,
            width: "4px",
            height: "4px",
          }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * j * 0.1,
            ease: "easeInOut",
          }}
        />
      );
    }
  }

  return dots;
};

// Generate animated lines
const generateAnimatedLines = () => {
  return [...Array(6)].map((_, i) => {
    const direction = i % 2 === 0 ? "horizontal" : "vertical";
    const position = Math.random() * 100;

    return (
      <motion.div
        key={`line-${i}`}
        className={`absolute bg-gradient-to-r from-red-500/10 to-transparent ${
          direction === "horizontal" ? "w-full h-px" : "h-full w-px"
        }`}
        style={{
          [direction === "horizontal" ? "top" : "left"]: `${position}%`,
        }}
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.7,
          ease: "easeInOut",
        }}
      />
    );
  });
};

// Background Component
const BackgroundAnimation = () => (
  <>
    {/* Animated gradient background */}
    <div className="absolute inset-0 overflow-hidden z-0">
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          background: [
            "radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 20%)",
            "radial-gradient(circle at 30% 70%, rgba(255, 107, 107, 0.1) 0%, transparent 20%)",
            "radial-gradient(circle at 70% 30%, rgba(255, 107, 107, 0.1) 0%, transparent 20%)",
            "radial-gradient(circle at 10% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 20%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>

    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none z-0"></div>

    {/* Animated geometric shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {generateGeometricShapes()}
    </div>

    {/* Animated grid dots */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {generateGridDots()}
    </div>

    {/* Animated lines */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {generateAnimatedLines()}
    </div>

    {/* Pulse circles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute rounded-full border border-red-500/20"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
            width: `${100 + i * 100}px`,
            height: `${100 + i * 100}px`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`pulse2-${i}`}
          className="absolute rounded-full border border-red-500/20"
          style={{
            right: `${20 + i * 30}%`,
            bottom: `${30 + i * 20}%`,
            width: `${100 + i * 100}px`,
            height: `${100 + i * 100}px`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>

    {/* Subtle glowing accents */}
    <motion.div
      className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -z-10"
      animate={{
        opacity: [0.1, 0.15, 0.1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -z-10"
      animate={{
        opacity: [0.1, 0.15, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </>
);

// Skeleton Component
const ContactSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-28">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-12 w-64 bg-red-900/20 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-80 bg-red-900/10 rounded-full mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          className="rounded-3xl p-7 h-96 animate-pulse"
          style={{ background: "rgba(20, 20, 20, 0.5)" }}
        />
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-5 h-24 animate-pulse"
              style={{ background: "rgba(20, 20, 20, 0.5)" }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

  const socialLinks = [
    {
      icon: <FaPhone className="text-xl" />,
      platform: "Call",
      handle: "+8801906979013",
      url: "tel:+8801906979013",
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      platform: "Email",
      handle: "jayedbinkibria@gmail.com",
      url: "mailto:jayedbinkibria@gmail.com",
    },
    {
      icon: <FaWhatsapp className="text-xl text-green-600" />,
      platform: "WhatsApp",
      handle: "01794598569",
      url: "https://wa.me/8801794598569",
    },
    {
      icon: <FaSquareXTwitter className="text-xl" />,
      platform: "X",
      handle: "jayedbinkibria",
      url: "https://x.com/jayedbinkibria",
    },
  ];

  // FIXED: Use useEffect for loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff6b6b", "#ff8e8e", "#ff5252"],
      });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedBackground = useMemo(() => <BackgroundAnimation />, []);

  if (loading) return <ContactSkeleton />;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-28 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white relative overflow-hidden"
      id="contact"
    >
      {memoizedBackground}

      <motion.div
        className="container mx-auto px-4 relative z-20"
        style={{ opacity, y }}
      >
        {/* Header */}
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
            Get in Touch
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Let's{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Connect
            </span>
          </motion.h2>

          <motion.div
            className="font-mono text-red-400/80 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block mr-2">Jayed&gt;</span>
            <span className="text-white/90">
              Ready to create something extraordinary?
            </span>
            <motion.span
              className="ml-1 inline-block"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              _
            </motion.span>
          </motion.div>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact form */}
          <LiquidGlassFormCard
            isSubmitted={isSubmitted}
            isLoading={isLoading}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />

          {/* Contact methods */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {socialLinks.map((link, index) => (
              <LiquidGlassContactCard key={index} link={link} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Studio address */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div
            className="inline-block px-6 py-3 rounded-full"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center justify-center mb-1">
              <HiOutlineLocationMarker className="mr-2 text-red-400" />
              <p className="text-white/60 font-mono text-sm">
                Studio Location: Dhaka, Bangladesh
              </p>
            </div>
            <p className="text-white/40 text-xs">
              Available Worldwide for Projects
            </p>
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .perspective-[1200px] {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
}