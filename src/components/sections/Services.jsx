import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

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
    videoPreview: "/videos/preprod-preview.mp4",
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
    videoPreview: "/videos/prod-preview.mp4",
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
    videoPreview: "/videos/postprod-preview.mp4",
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
    videoPreview: "/videos/delivery-preview.mp4",
  },
];

export default function ProductionProcess() {
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Timeline animation
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      // Card animations
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
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
      className="min-h-screen py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>

      {/* Cinematic grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

      {/* Content container */}
      <div ref={containerRef} className="container mx-auto px-4 relative z-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="process-title text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-4">
            EDITOR'S WORKFLOW
          </h2>
          <div className="font-mono text-red-400/80 text-lg">
            <span>
              Jayed&gt; _ My creative process from concept to delivery
            </span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </div>

        {/* Interactive timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-red-500/20 via-red-500/50 to-transparent origin-top"></div>

          {/* Process cards */}
          <div className="space-y-32 py-16">
            {productionStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`relative flex ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } items-center gap-12`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                whileHover={{ scale: 1.02 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 border-4 border-[#0a0a0a] z-10"></div>

                {/* Video preview */}
                <div className="flex-1 relative overflow-hidden rounded-xl border border-white/10 group">
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
                </div>

                {/* Stage details */}
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{stage.icon}</span>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-white/80 mb-6">{stage.description}</p>

                  <ul className="grid grid-cols-2 gap-2 mb-6">
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
                    className="px-4 py-2.5 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center justify-center text-sm rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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

        {/* Footer CTA */}
        <div className="mt-32 text-center">
          <a href="#contact">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg relative overflow-hidden group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Start Your Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            </motion.button>
          </a>

          <p className="mt-6 text-white/60 text-sm font-mono">
            Let's collaborate on something extraordinary
          </p>
        </div>
      </div>

      {/* Floating UI elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-red-500/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-20 w-40 h-40 rounded-full bg-red-500/10 blur-3xl -z-10"></div>
    </section>
  );
}
