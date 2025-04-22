import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-based animations
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [80, 0]);

  const socialLinks = [
    {
      icon: "📱",
      platform: "Call",
      handle: "+880 1234 567890",
      url: "tel:+8801234567890",
    },
    {
      icon: "✉️",
      platform: "Email",
      handle: "hello@jayed.com",
      url: "mailto:hello@jayed.com",
    },
    { icon: "🎬", platform: "Instagram", handle: "@jayed.films", url: "#" },
    { icon: "📹", platform: "YouTube", handle: "Jayed Films", url: "#" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#f43f5e", "#dc2626"],
      shapes: ["circle", "star"],
    });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  // Generate red star particles with different sizes and opacities
  const generateStars = () => {
    const starColors = [
      "#ff0000",
      "#ff3333",
      "#ff6666",
      "#ff9999",
      "#ffcccc",
      "#ff1a1a",
      "#ff4d4d",
      "#ff8080",
      "#ffb3b3",
      "#ffe6e6",
    ];

    return [...Array(120)].map((_, i) => {
      const size = Math.random() * 4;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const glowIntensity = Math.random() * 0.8 + 0.2;

      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            opacity: glowIntensity,
            boxShadow: `0 0 ${size * 3}px ${size}px rgba(239, 68, 68, ${
              glowIntensity * 0.5
            })`,
            filter: `blur(${size / 4}px)`,
          }}
          animate={{
            opacity: [glowIntensity * 0.3, glowIntensity, glowIntensity * 0.3],
            boxShadow: [
              `0 0 ${size * 2}px ${size / 2}px rgba(239, 68, 68, ${
                glowIntensity * 0.3
              })`,
              `0 0 ${size * 4}px ${size}px rgba(239, 68, 68, ${
                glowIntensity * 0.7
              })`,
              `0 0 ${size * 2}px ${size / 2}px rgba(239, 68, 68, ${
                glowIntensity * 0.3
              })`,
            ],
          }}
          transition={{
            duration: Math.random() * 6 + 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      );
    });
  };

  // Generate red shooting stars
  const generateShootingStars = () => {
    return [...Array(6)].map((_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 30;
      const angle = Math.random() * 45 - 22.5;
      const length = Math.random() * 100 + 100;

      return (
        <motion.div
          key={`shooting-${i}`}
          className="absolute h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"
          style={{
            left: `${startX}%`,
            top: `${startY}%`,
            width: `${length}px`,
            rotate: angle,
            filter: "blur(1px)",
          }}
          initial={{ x: -length, y: -length / 2, opacity: 0 }}
          animate={{
            x: [`-${length}px`, `${length}px`],
            y: [`-${length / 2}px`, `${length / 2}px`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatDelay: Math.random() * 15 + 10,
            ease: "linear",
          }}
        />
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="contact-section py-32 bg-[#0a0a0a] text-white relative overflow-hidden"
      id="contact"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-20 pointer-events-none z-0"></div>

      {/* Red starfield particles - full width cinematic effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {generateStars()}
        {generateShootingStars()}
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, y }}
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            CONTACT
          </motion.h2>
          <motion.div
            className="font-mono text-red-400/80 text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
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
        <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact form */}
          <motion.div
            className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/5 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-red-900/20 hover:shadow-red-500/30 transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-2xl font-medium mb-6 flex items-center">
              <span className="text-red-400 mr-3">✍️</span>
              <span>Send a Message</span>
            </h3>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎬</div>
                <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
                <p className="text-white/70">I'll get back to you soon</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-black/30 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-black/30 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <textarea
                    rows="4"
                    placeholder="Tell me about your project..."
                    className="w-full bg-black/30 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-red-500 transition-all placeholder-white/40"
                    required
                  ></textarea>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 flex items-center justify-center group relative overflow-hidden mt-6"
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">🚀</span>
                      <span>Launch Project</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Contact methods */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                className="block bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4 group-hover:text-red-400 transition-colors">
                    {link.icon}
                  </span>
                  <div>
                    <h4 className="text-lg font-medium group-hover:text-red-400 transition-colors">
                      {link.platform}
                    </h4>
                    <p className="text-white/70 mt-1">{link.handle}</p>
                  </div>
                  <span className="ml-auto text-white/30 group-hover:text-red-400 transition-colors">
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
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>📍 Studio Location: Dhaka, Bangladesh</p>
          <p className="mt-1">Available Worldwide for Projects</p>
        </motion.div>
      </motion.div>

      {/* Glowing accents */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
    </section>
  );
}
