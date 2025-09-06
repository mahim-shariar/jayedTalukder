// components/Contact.js
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { sendEmail } from "../../utils/emailService";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { FiSend, FiLoader } from "react-icons/fi";
import { BsStars, BsPencil } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Smoother scroll-based animations
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

      // Confetti effect
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

  return (
    <section
      ref={sectionRef}
      className="contact-section py-28 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white relative overflow-hidden"
      id="contact"
    >
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

      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, y }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Let's Connect
          </motion.h2>
          <motion.div
            className="font-mono text-red-400/80 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-block mr-2">Jayed&gt;</span>
            <span className="text-white/90">
              Ready to create something extraordinary?
            </span>
            <span className="ml-1 animate-pulse">_</span>
          </motion.div>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact form */}
          <motion.div
            className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-red-900/10 hover:shadow-red-500/20 transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -3 }}
          >
            <h3 className="text-xl font-medium mb-6 flex items-center">
              <BsPencil className="text-red-400 mr-3" />
              <span>Send a Message</span>
            </h3>

            {isSubmitted ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <BsStars className="text-4xl mb-4 mx-auto text-red-400" />
                <h4 className="text-lg font-medium mb-2">Message Sent!</h4>
                <p className="text-white/70">I'll get back to you soon</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40"
                    required
                    value={formData.name}
                    onChange={handleChange}
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
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40 resize-none"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center justify-center group mt-4"
                    disabled={isLoading}
                  >
                    <span className="flex items-center">
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
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Contact methods */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                className="block bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-xl p-5 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-4 group-hover:text-red-400 transition-colors p-2 bg-black/20 rounded-lg">
                    {link.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-red-400 transition-colors">
                      {link.platform}
                    </h4>
                    <p className="text-white/70 text-sm mt-1">{link.handle}</p>
                  </div>
                  <span className="text-white/30 group-hover:text-red-400 transition-colors">
                    →
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Studio address */}
        <motion.div
          className="mt-12 text-center text-white/60 font-mono text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-1">
            <HiOutlineLocationMarker className="mr-2 text-red-400" />
            <p>Studio Location: Dhaka, Bangladesh</p>
          </div>
          <p className="text-white/40">Available Worldwide for Projects</p>
        </motion.div>
      </motion.div>

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
    </section>
  );
}
