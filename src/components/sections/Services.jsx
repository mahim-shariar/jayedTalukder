import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const productionStages = [
  {
    id: 1,
    title: "Pre-Production Planning",
    icon: "📝",
    description:
      "Script breakdown, storyboarding, and shot list creation to ensure your vision is perfectly captured",
    features: [
      "Creative concept development",
      "Shooting schedule optimization",
      "Location scouting guidance",
      "Equipment recommendations",
    ],
    cta: "View Planning Samples",
  },
  {
    id: 2,
    title: "On-Set Supervision",
    icon: "🎥",
    description:
      "On-location direction to maintain editorial vision during filming",
    features: [
      "Real-time continuity checks",
      "Performance coaching",
      "Coverage optimization",
      "Technical quality control",
    ],
    cta: "See On-Set Work",
  },
  {
    id: 3,
    title: "Post-Production",
    icon: "✂️",
    description: "From assembly cut to final delivery with professional polish",
    features: [
      "Rough cut to final edit",
      "Color correction & grading",
      "Audio sweetening",
      "Export all formats",
    ],
    cta: "View Post Samples",
  },
  {
    id: 4,
    title: "Final Delivery",
    icon: "🚀",
    description: "Platform-optimized exports with quality assurance",
    features: [
      "4K/8K mastering",
      "HDR/SDR versions",
      "Closed captions",
      "Platform-specific encoding",
    ],
    cta: "Delivery Specs",
  },
];

export default function ProductionProcess() {
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards on scroll
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Section title animation
      gsap.fromTo(
        ".process-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="min-h-screen py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Dark gradient background - matches original */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Grid pattern - matches original */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>

      {/* Cinematic grain overlay - matches original */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

      {/* Floating particles - matches original */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 2})`,
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div ref={containerRef} className="container mx-auto px-4 relative z-20">
        {/* Terminal-style header - matches original */}
        <div className="text-center mb-20">
          <h2 className="process-title text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-4">
            PRODUCTION PROCESS
          </h2>
          <div className="font-mono text-red-400/80 text-lg">
            <span>Jayed&gt; _ End-to-end video creation workflow</span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </div>

        {/* Process timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productionStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              {/* Glow effect - matches original */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/10 blur-lg rounded-lg"></div>
              </div>

              {/* Card content */}
              <div className="h-full flex flex-col bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] p-6">
                <div className="text-5xl mb-4">{stage.icon}</div>
                <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                <p className="text-white/80 text-sm mb-6">
                  {stage.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {stage.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
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
                      <span className="text-sm text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className="mt-auto px-4 py-3 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center justify-center text-sm w-full rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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

        {/* Footer note - matches original */}
        <div className="mt-16 text-center text-white/60 text-sm font-mono">
          <p>Custom workflows available — Let's discuss your production</p>
        </div>
      </div>

      {/* Corner accents - matches original */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
    </section>
  );
}
