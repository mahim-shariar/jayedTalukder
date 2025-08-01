import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jayed_Profile from "/image/jayed-2.JPG";
import macbookImage from "/image/jayed-9.jpg";
import { FiAward, FiFilm, FiEdit2, FiCamera, FiCode } from "react-icons/fi";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function About() {
  const grainRef = useRef(null);
  const bioModalRef = useRef(null);
  const [showBio, setShowBio] = useState(false);
  const modalOverlayRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [macbookImageLoaded, setMacbookImageLoaded] = useState(false);
  const aboutSectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const storyContentRef = useRef(null);
  const textContainerRef = useRef(null);
  const skillsRef = useRef(null);

  // Color palette
  const colors = {
    primary: "#FF4D4D", // Vibrant red
    secondary: "#0F0F0F", // Dark background
    accent: "#1E1E1E", // Slightly lighter dark
    text: "#E0E0E0", // Off-white text
    highlight: "#FF7E7E", // Lighter red
  };

  useEffect(() => {
    // Set initial hidden state
    gsap.set([leftColumnRef.current, rightColumnRef.current], {
      y: 50,
      opacity: 0,
    });

    // Terminal-like text animation
    const sections = [
      { text: "Jayed> _ Visual Alchemist", delay: 0.3 },
      { text: "Jayed> _ Frame Sculptor", delay: 1.2 },
      { text: "Jayed> _ Emotion Architect", delay: 1.8 },
    ];

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    sections.forEach((section) => {
      tl.to(textContainerRef.current, {
        duration: 1.5,
        text: section.text,
        ease: "none",
        delay: section.delay,
      });
    });

    // Cursor blink effect
    gsap.to("#terminal-cursor", {
      opacity: 0,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });

    // Grain effect
    gsap.from(grainRef.current, {
      opacity: 0,
      duration: 2,
      ease: "expo.out",
    });

    // Scroll-triggered animations
    ScrollTrigger.batch([leftColumnRef.current, rightColumnRef.current], {
      start: "top 80%",
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.2)",
        });
      },
      once: true,
    });

    // Skills animation
    ScrollTrigger.create({
      trigger: skillsRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          skillsRef.current.querySelectorAll(".skill-item"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    // Story content animation
    ScrollTrigger.create({
      trigger: storyContentRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          storyContentRef.current.querySelectorAll("h2, p, div, button"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const toggleBio = () => {
    if (showBio) {
      // Closing animation sequence
      gsap.to(bioModalRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
      gsap.to(modalOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => setShowBio(false),
      });
    } else {
      setShowBio(true);
      // Opening animation sequence
      gsap.fromTo(
        modalOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.in" }
      );
      gsap.fromTo(
        bioModalRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.2)",
          delay: 0.1,
        }
      );
    }
  };

  const skills = [
    { name: "Color Grading", icon: <FiEdit2 />, level: 95 },
    { name: "Cinematography", icon: <FiCamera />, level: 90 },
    { name: "Motion Graphics", icon: <FiFilm />, level: 85 },
    { name: "Visual Effects", icon: <FiCode />, level: 80 },
    { name: "Storytelling", icon: <FiAward />, level: 98 },
  ];

  return (
    <section
      ref={aboutSectionRef}
      id="about"
      className="about-section min-h-screen relative overflow-hidden"
      style={{ backgroundColor: colors.secondary }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.accent} 1px, transparent 1px), linear-gradient(to bottom, ${colors.accent} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Grain overlay */}
      <div
        ref={grainRef}
        className="absolute inset-0 opacity-5 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-20 h-full flex flex-col lg:flex-row items-center gap-12 relative z-20">
        {/* Left column - Image and skills */}
        <div
          ref={leftColumnRef}
          className="w-full lg:w-1/2 flex flex-col gap-12"
        >
          {/* Profile image with glitch effect */}
          <div className="relative group">
            <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-lg border border-white/10">
              {/* Skeleton loader */}
              {!imageLoaded && (
                <div
                  className="absolute inset-0 bg-gray-800 animate-pulse"
                  style={{ backgroundColor: colors.accent }}
                />
              )}

              {/* Main image */}
              <img
                src={jayed_Profile}
                alt="Jayed - Video Editor"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Glitch layers */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                  style={{
                    backgroundImage: `url(${jayed_Profile})`,
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                    transform: "translateX(-5px)",
                  }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                  style={{
                    backgroundImage: `url(${jayed_Profile})`,
                    clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                    transform: "translateX(5px)",
                  }}
                />
              </div>

              {/* RGB split effect on hover */}
              <div className="absolute inset-0 bg-transparent group-hover:bg-red-500/10 transition-colors duration-300 mix-blend-screen" />
            </div>

            {/* Decorative elements */}
            <div
              className="absolute -top-4 -left-4 w-16 h-16 border-2 border-red-500/30 z-10 pointer-events-none"
              style={{ transform: "rotate(15deg)" }}
            />
            <div
              className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-red-500/30 z-10 pointer-events-none"
              style={{ transform: "rotate(-15deg)" }}
            />
          </div>

          {/* Skills section */}
          <div ref={skillsRef} className="space-y-6">
            <h3
              className="text-xl font-semibold"
              style={{ color: colors.primary }}
            >
              CORE SKILLS
            </h3>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="flex justify-between items-center mb-1">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <span className="text-red-500">{skill.icon}</span>
                      <span>{skill.name}</span>
                    </div>
                    <span
                      style={{ color: colors.text }}
                      className="text-xs opacity-70"
                    >
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Bio and story */}
        <div
          ref={rightColumnRef}
          className="w-full lg:w-1/2 flex flex-col gap-8"
          style={{ color: colors.text }}
        >
          {/* Terminal-style text */}
          <div className="font-mono text-lg">
            <span
              ref={textContainerRef}
              style={{ color: colors.primary }}
            ></span>
            <span
              id="terminal-cursor"
              className="ml-1"
              style={{ color: colors.primary }}
            >
              |
            </span>
          </div>

          {/* Story content */}
          <div ref={storyContentRef} className="space-y-6">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.highlight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Visual Storyteller
            </h2>

            <p className="leading-relaxed opacity-90">
              I transform raw footage into cinematic experiences. With a keen
              eye for detail and a passion for storytelling, I craft visuals
              that resonate emotionally and leave lasting impressions. Every
              frame is purposeful, every cut intentional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div
                className="p-4 border border-white/10 rounded-lg hover:border-red-500/30 transition-all duration-300"
                style={{ backgroundColor: colors.accent }}
              >
                <h3 className="text-red-500 mb-2 font-medium">Approach</h3>
                <p className="text-sm opacity-80">
                  "I don't just edit videos—I sculpt time and emotion, frame by
                  frame."
                </p>
              </div>
              <div
                className="p-4 border border-white/10 rounded-lg hover:border-red-500/30 transition-all duration-300"
                style={{ backgroundColor: colors.accent }}
              >
                <h3 className="text-red-500 mb-2 font-medium">Specialty</h3>
                <p className="text-sm opacity-80">
                  Creating visual narratives that connect on a human level
                </p>
              </div>
            </div>

            <button
              onClick={toggleBio}
              className="mt-6 px-6 py-3 rounded-lg border border-red-500/50 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2 group max-w-fit"
              style={{ color: colors.primary }}
            >
              <span>Explore My Journey</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Biography Modal */}
      {showBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark overlay */}
          <div
            ref={modalOverlayRef}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={toggleBio}
          />

          {/* Modal content */}
          <div
            ref={bioModalRef}
            className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 p-8 scrollbar-custom"
            style={{
              backgroundColor: colors.secondary,
              boxShadow: `0 0 40px ${colors.primary}20`,
            }}
          >
            {/* Close button */}
            <button
              onClick={toggleBio}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
              style={{
                color: colors.primary,
                border: `1px solid ${colors.primary}50`,
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Biography content */}
            <div className="space-y-8">
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: colors.primary }}
              >
                The Evolution of a Visual Storyteller
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3
                      style={{ color: colors.primary }}
                      className="text-xl font-semibold mb-4 pb-2 border-b border-white/10"
                    >
                      CHAPTER ONE: THE AWAKENING
                    </h3>
                    <p
                      style={{ color: colors.text }}
                      className="opacity-90 leading-relaxed"
                    >
                      My journey began in 2024 when I discovered the power of
                      visual storytelling. What started as university
                      experiments with a basic camera evolved into a passion for
                      crafting emotional narratives. That first MacBook from
                      Digital Dropout Skool became my canvas, where I taught
                      myself the art of editing through countless late nights.
                    </p>
                  </div>

                  <div>
                    <h3
                      style={{ color: colors.primary }}
                      className="text-xl font-semibold mb-4 pb-2 border-b border-white/10"
                    >
                      CHAPTER TWO: THE CRAFT
                    </h3>
                    <p
                      style={{ color: colors.text }}
                      className="opacity-90 leading-relaxed"
                    >
                      I immersed myself in the technical and artistic aspects of
                      filmmaking. From color theory to pacing psychology, every
                      project became an opportunity to refine my skills.
                      Weddings taught me to capture authentic emotion,
                      commercials sharpened my precision, and personal projects
                      allowed me to push creative boundaries.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div
                    className="p-4 rounded-lg border border-white/10"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <h4
                      style={{ color: colors.primary }}
                      className="text-red-500 font-mono text-sm mb-3"
                    >
                      MILESTONES
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {[
                        "First paid project (2024)",
                        "Digital Dropout Skool Award",
                        "100+ projects completed",
                        "Specialized in emotional storytelling",
                        "Developed signature color grading style",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start opacity-90">
                          <span className="text-red-500 mr-2">▸</span>
                          <span style={{ color: colors.text }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* MacBook achievement */}
                  <div className="relative rounded-lg overflow-hidden border border-white/10">
                    {!macbookImageLoaded && (
                      <div
                        className="absolute inset-0 bg-gray-800 animate-pulse"
                        style={{ backgroundColor: colors.accent }}
                      />
                    )}
                    <img
                      src={macbookImage}
                      alt="MacBook achievement"
                      className={`w-full h-auto object-cover transition-opacity duration-500 ${
                        macbookImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setMacbookImageLoaded(true)}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                      style={{ color: colors.text }}
                    >
                      <div className="flex items-center gap-2 text-red-500">
                        <FiAward />
                        <span className="font-medium">
                          Digital Dropout Skool 2025
                        </span>
                      </div>
                      <p className="text-xs opacity-80 mt-1">
                        Awarded for exceptional creative potential
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3
                  style={{ color: colors.primary }}
                  className="text-xl font-semibold mb-4 pb-2 border-b border-white/10"
                >
                  CHAPTER THREE: THE VISION
                </h3>
                <p
                  style={{ color: colors.text }}
                  className="opacity-90 leading-relaxed"
                >
                  Today, I approach every project with the same curiosity and
                  passion as those early days. My style blends technical
                  precision with raw emotion—creating work that feels both
                  polished and profoundly human. I believe the best edits aren't
                  noticed; they're felt.
                </p>

                <div
                  className="p-6 rounded-lg border border-red-500/20"
                  style={{ backgroundColor: colors.primary + "10" }}
                >
                  <h4 className="text-red-500 font-mono text-sm mb-2">CREED</h4>
                  <p
                    style={{ color: colors.text }}
                    className="italic opacity-90"
                  >
                    "I don't chase trends—I craft timeless visual experiences
                    that resonate across cultures and generations. The frame is
                    my canvas, time is my medium, and emotion is my ultimate
                    goal."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: colors.primary,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary} ${colors.secondary};
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: ${colors.secondary};
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: ${colors.primary};
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
