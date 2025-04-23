import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function Hero() {
  const heroRef = useRef();
  const textRef = useRef();
  const filmStripRef = useRef();
  const framesRef = useRef([]);
  const particlesRef = useRef([]);
  const lightRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFrame, setActiveFrame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const animationRef = useRef({
    filmTl: null,
    floatTls: [],
    particleTls: [],
    masterTl: null,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic light source with smoother movement
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      heroRef.current.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePos({ x, y });

    // Using GSAP for smoother light movement
    gsap.to(lightRef.current, {
      x: `${x}%`,
      y: `${y}%`,
      duration: 1.2,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  // Create particles with different behaviors
  const createParticles = () => {
    const particleCount = windowSize.width < 768 ? 20 : 40; // Fewer particles on mobile
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (windowSize.width < 768 ? 2 : 3) + 1, // Smaller on mobile
      speed: Math.random() * 0.5 + 0.2,
      color: `hsla(${Math.random() * 60 + 0}, 80%, 60%, ${
        Math.random() * 0.2 + 0.05
      })`,
      path: Math.random() > 0.7 ? "circle" : "line",
      pathRadius: Math.random() * (windowSize.width < 768 ? 15 : 20) + 10, // Smaller paths on mobile
    }));
  };

  // Toggle all animations smoothly with better synchronization
  const togglePlayback = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);

    // Use a single timeline to control all animations
    if (animationRef.current.masterTl) {
      gsap.to(animationRef.current.masterTl, {
        timeScale: newState ? 1 : 0,
        duration: 0.8,
        ease: "power3.inOut",
        overwrite: true,
      });
    }

    // Pulse effect to show state change
    gsap.to(".playback-btn", {
      scale: 1.2,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  };

  // Initialize all animations with responsive adjustments
  useEffect(() => {
    createParticles();

    // Create master timeline to control all animations
    animationRef.current.masterTl = gsap.timeline({
      paused: !isPlaying,
      defaults: { ease: "power3.out" },
    });

    // Responsive text size adjustments
    const isMobile = windowSize.width < 768;
    const textElements = textRef.current.children;
    const textDuration = isMobile ? 1.2 : 1.5;
    const textStagger = isMobile ? 0.15 : 0.18;

    // Set initial styles with responsive adjustments
    gsap.set(textElements, {
      opacity: 0,
      y: isMobile ? 40 : 60,
      rotationX: isMobile ? 10 : 15,
    });

    gsap.set(filmStripRef.current, {
      x: "-100%",
      rotationY: isMobile ? 10 : 20,
    });

    gsap.set(framesRef.current, {
      opacity: 0,
      scale: isMobile ? 0.7 : 0.8,
      rotationY: isMobile ? -10 : -15,
    });

    gsap.set(".particle", { opacity: 0 });
    gsap.set(lightRef.current, { opacity: 0 });

    // Light reveal
    animationRef.current.masterTl.to(
      lightRef.current,
      {
        opacity: isMobile ? 0.15 : 0.25, // Less intense on mobile
        duration: 2.5,
        ease: "sine.out",
      },
      0
    );

    // Text animation with responsive adjustments
    animationRef.current.masterTl.to(
      textElements,
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: textStagger,
        duration: textDuration,
        ease: "back.out(1.7)",
      },
      isMobile ? 0.3 : 0.5
    );

    // Film strip animation with responsive duration
    animationRef.current.masterTl.to(
      filmStripRef.current,
      {
        x: "0%",
        rotationY: 0,
        duration: isMobile ? 1.8 : 2.2,
        ease: "expo.out",
      },
      0
    );

    // Frame animations with responsive adjustments
    animationRef.current.masterTl.to(
      framesRef.current,
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        stagger: isMobile ? 0.08 : 0.12,
        duration: isMobile ? 1 : 1.2,
        ease: "elastic.out(1, 0.4)",
      },
      isMobile ? 0.6 : 0.8
    );

    // Continuous film movement with perfect loop (added to master timeline)
    const filmLoop = gsap.timeline({ repeat: -1 });
    filmLoop.to(filmStripRef.current, {
      x: "-=100%",
      duration: isMobile ? 40 : 60, // Faster on mobile
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % 100),
      },
    });
    animationRef.current.filmTl = filmLoop;
    animationRef.current.masterTl.add(filmLoop, isMobile ? 1.8 : 2.2);

    // Floating animations for frames with responsive adjustments
    framesRef.current.forEach((frame, i) => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      const floatAmount = isMobile ? 10 : 15; // Less movement on mobile
      const floatDuration = isMobile ? 4 + i * 0.5 : 6 + i * 0.5; // Faster on mobile

      tl.to(
        frame,
        {
          y: Math.sin(i * 0.5) * floatAmount,
          rotationY: isMobile ? 3 : 5,
          duration: floatDuration,
          ease: "sine.inOut",
        },
        0
      );
      animationRef.current.floatTls.push(tl);
      animationRef.current.masterTl.add(tl, isMobile ? 1.5 : 2);
    });

    // Particle animations with responsive adjustments
    particlesRef.current.forEach((particle, i) => {
      const tl = gsap.timeline({ repeat: -1 });

      if (particle.path === "circle") {
        tl.to(
          `.particle-${i}`,
          {
            motionPath: {
              path: `M${particle.x},${particle.y} a${particle.pathRadius},${
                particle.pathRadius
              } 0 1,0 ${particle.pathRadius * 2},0 a${particle.pathRadius},${
                particle.pathRadius
              } 0 1,0 -${particle.pathRadius * 2},0`,
              type: "cubic",
              autoRotate: true,
            },
            duration: isMobile
              ? 15 + Math.random() * 10
              : 25 + Math.random() * 15,
            ease: "none",
          },
          0
        );
      } else {
        tl.to(
          `.particle-${i}`,
          {
            x: `+=${Math.sin(i) * (isMobile ? 40 : 60)}`,
            y: `+=${Math.cos(i) * (isMobile ? 40 : 60)}`,
            duration: isMobile
              ? 10 + Math.random() * 10
              : 15 + Math.random() * 15,
            ease: "sine.inOut",
          },
          0
        );
      }

      // Smoother fade in for particles
      tl.fromTo(
        `.particle-${i}`,
        { opacity: 0 },
        {
          opacity: particle.alpha || 0.15,
          duration: isMobile ? 2 : 3,
          ease: "sine.inOut",
        },
        0
      );

      animationRef.current.particleTls.push(tl);
      animationRef.current.masterTl.add(tl, isMobile ? 1 : 1.5);
    });

    // Cleanup function
    return () => {
      animationRef.current.masterTl?.kill();
      animationRef.current.floatTls.forEach((tl) => tl.kill());
      animationRef.current.particleTls.forEach((tl) => tl.kill());
      if (animationRef.current.filmTl) animationRef.current.filmTl.kill();
    };
  }, [windowSize.width]); // Re-run effect when window size changes

  const handleFrameHover = (index, isHovering) => {
    if (windowSize.width < 768) return; // Disable hover effects on mobile

    if (isHovering) {
      setActiveFrame(index);
      gsap.to(framesRef.current[index], {
        boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      setActiveFrame(null);
      gsap.to(framesRef.current[index], {
        boxShadow: "none",
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const frames = [
    "/images/frames/1.jpg",
    "/images/frames/2.jpg",
    "/images/frames/3.jpg",
    "/images/frames/4.jpg",
    "/images/frames/5.jpg",
    "/images/frames/6.jpg",
    "/images/frames/7.jpg",
    "/images/frames/8.jpg",
  ];

  // Responsive frame dimensions
  const getFrameDimensions = () => {
    if (windowSize.width < 640) {
      return { width: "160px", height: "50vh", margin: "0 8px" };
    } else if (windowSize.width < 768) {
      return { width: "180px", height: "55vh", margin: "0 10px" };
    } else if (windowSize.width < 1024) {
      return { width: "200px", height: "60vh", margin: "0 12px" };
    } else {
      return { width: "256px", height: "75vh", margin: "0 12px" };
    }
  };

  const frameStyle = getFrameDimensions();

  return (
    <section
      ref={heroRef}
      className="hero-section h-screen w-full overflow-hidden flex items-center justify-center relative bg-neutral-950"
      onMouseMove={handleMouseMove}
      id="home"
      style={{
        backgroundImage: `
          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
          rgba(239, 68, 68, 0.1) 0%, 
          transparent 70%)
        `,
        transition: "background 0.5s ease-out",
      }}
    >
      {/* Dynamic light with responsive size */}
      <div
        ref={lightRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: windowSize.width < 768 ? "250px" : "400px",
          height: windowSize.width < 768 ? "250px" : "400px",
          background:
            "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)",
          filter: windowSize.width < 768 ? "blur(25px)" : "blur(40px)",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />

      {/* Particles */}
      {particlesRef.current.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle-${particle.id} absolute rounded-full pointer-events-none will-change-transform`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Film strip with responsive adjustments */}
      <div
        ref={filmStripRef}
        className="absolute top-0 left-0 h-full flex items-center whitespace-nowrap will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {[...frames, ...frames].map((frame, i) => (
          <div
            key={i}
            ref={(el) => (framesRef.current[i] = el)}
            className={`inline-block bg-neutral-900 overflow-hidden rounded-md shadow-lg transition-all duration-300 ${
              windowSize.width >= 768 ? "cursor-pointer" : ""
            }`}
            onMouseEnter={() =>
              windowSize.width >= 768 && handleFrameHover(i, true)
            }
            onMouseLeave={() =>
              windowSize.width >= 768 && handleFrameHover(i, false)
            }
            style={{
              width: frameStyle.width,
              height: frameStyle.height,
              margin: frameStyle.margin,
              transformOrigin: "center center",
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${frame})`,
                backgroundColor: "#111",
              }}
            />
            <div className="absolute inset-0 border border-neutral-800/50 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 text-xs text-neutral-300 font-mono pointer-events-none">
              Clip_{i + 1}.mp4
            </div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Content with responsive text sizing */}
      <div
        ref={textRef}
        className="relative z-20 text-center px-4 w-full"
        style={{
          maxWidth:
            windowSize.width < 768
              ? "90%"
              : windowSize.width < 1024
              ? "80%"
              : "64rem",
          paddingBottom: windowSize.width < 768 ? "60px" : "0",
        }}
      >
        <h1
          className="font-bold mb-4 md:mb-6 text-neutral-100 tracking-tight"
          style={{
            fontSize:
              windowSize.width < 640
                ? "2.25rem"
                : windowSize.width < 768
                ? "2.5rem"
                : windowSize.width < 1024
                ? "4rem"
                : "5rem",
            lineHeight: "1.1",
          }}
        >
          <span className="block">Visual Storytelling</span>
          <span className="block text-red-500 mt-2 md:mt-4">
            Through the Lens
          </span>
        </h1>

        <p
          className="text-neutral-300 mb-6 md:mb-10 mx-auto leading-relaxed"
          style={{
            fontSize: windowSize.width < 768 ? "1rem" : "1.25rem",
            maxWidth: windowSize.width < 768 ? "100%" : "42rem",
          }}
        >
          Transforming raw footage into{" "}
          <span className="text-red-400 font-medium">
            compelling narratives
          </span>{" "}
          that captivate audiences.
        </p>

        <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
          <button className="px-6 py-3 md:px-8 md:py-4 bg-red-500 text-neutral-50 rounded-full hover:bg-red-600 transition-all transform hover:scale-[1.03] flex items-center group will-change-transform text-sm md:text-base">
            <span>View Portfolio</span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1"
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
          </button>
          <button className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-neutral-600 text-neutral-200 rounded-full hover:bg-neutral-100 hover:text-neutral-900 transition-all transform hover:scale-[1.03] will-change-transform text-sm md:text-base">
            Get in Touch
          </button>
        </div>
      </div>

      {/* Playback control with responsive positioning */}
      <div
        className="absolute z-20 flex items-center"
        style={{
          bottom: windowSize.width < 768 ? "20px" : "32px",
          left: windowSize.width < 768 ? "16px" : "32px",
        }}
      >
        <button
          onClick={togglePlayback}
          className="playback-btn rounded-full bg-neutral-900/80 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition-all duration-300 will-change-transform"
          style={{
            width: windowSize.width < 768 ? "40px" : "48px",
            height: windowSize.width < 768 ? "40px" : "48px",
          }}
        >
          {isPlaying ? (
            <svg
              className="text-neutral-300"
              style={{
                width: windowSize.width < 768 ? "16px" : "20px",
                height: windowSize.width < 768 ? "16px" : "20px",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="text-neutral-300"
              style={{
                width: windowSize.width < 768 ? "16px" : "20px",
                height: windowSize.width < 768 ? "16px" : "20px",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          )}
        </button>
        <span
          className="ml-2 md:ml-3 text-xs md:text-sm text-neutral-400 font-medium tracking-wider"
          style={{
            display: windowSize.width < 640 ? "none" : "block",
          }}
        >
          {isPlaying ? "PAUSE ANIMATIONS" : "PLAY ANIMATIONS"}
        </span>
      </div>

      {/* Scrolling indicator with responsive positioning */}
      <div
        className="absolute z-20"
        style={{
          bottom: windowSize.width < 768 ? "20px" : "32px",
          right: windowSize.width < 768 ? "16px" : "32px",
        }}
      >
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-red-500/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-red-500 mt-2 rounded-full animate-scrollPulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
