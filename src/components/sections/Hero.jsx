import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { getVideoReels } from "../../services/api";

// Register plugin once outside component
if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

// Constants
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
};

const FRAME_COUNTS = {
  mobile: 12, // Reduced from 20 for better performance
  desktop: 24, // Reduced from 40
};

const ANIMATION_CONFIG = {
  textDuration: { mobile: 1.2, desktop: 1.5 },
  textStagger: { mobile: 0.15, desktop: 0.18 },
  filmDuration: { mobile: 1.8, desktop: 2.2 },
  frameStagger: { mobile: 0.08, desktop: 0.12 },
  frameDuration: { mobile: 1, desktop: 1.2 },
  floatAmount: { mobile: 10, desktop: 15 },
  floatDuration: { mobile: 4, desktop: 6 },
  particleDuration: { mobile: 15, desktop: 25 },
  particleFadeDuration: { mobile: 2, desktop: 3 },
};

// Optimized Skeleton Frame Component - CSS only, no JS animations
const SkeletonFrame = ({ width, height, margin, index }) => {
  // Pre-compute styles for better performance
  const gradientStyle = {
    background: `linear-gradient(135deg, rgb(38,38,38) 0%, rgb(23,23,23) 50%, rgb(38,38,38) 100%)`,
    backgroundSize: "200% 200%",
  };

  return (
    <div
      className="inline-block bg-neutral-900 overflow-hidden rounded-xl shadow-2xl relative"
      style={{ width, height, margin }}
    >
      {/* Animated gradient background - CSS animation only */}
      <div
        className="absolute inset-0 skeleton-gradient"
        style={gradientStyle}
      />

      {/* Shimmer overlay - CSS animation only */}
      <div className="absolute inset-0 skeleton-shimmer" />

      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-20 skeleton-grain" />

      {/* Border with animated glow */}
      <div className="absolute inset-0 pointer-events-none border-glow" />

      {/* Animated corner accent */}
      <div
        className="absolute top-0 left-0 w-16 h-16 pointer-events-none skeleton-corner"
        style={{ animationDelay: `${(index % 5) * 0.3}s` }}
      />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Animated scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none skeleton-scan"
        style={{ animationDelay: `${(index % 3) * 0.5}s` }}
      />

      {/* Bottom info bar skeleton */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500/30 rounded-full skeleton-pulse" />
          <div
            className="h-3 rounded-full overflow-hidden skeleton-bar"
            style={{ width: `${60 + ((index * 7) % 40)}px` }}
          />
        </div>
      </div>

      {/* Animated frame number */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full skeleton-dot"
          style={{
            backgroundColor: `hsl(${(index * 30) % 360}, 70%, 50%)`,
            animationDelay: `${(index % 8) * 0.1}s`,
          }}
        />
        <div className="w-6 h-3 rounded-sm skeleton-number" />
      </div>
    </div>
  );
};

// Optimized Skeleton Text Component - CSS animations only
const SkeletonText = ({ isMobile, isSmallMobile, isTablet }) => {
  const titleSize = isSmallMobile
    ? "2.25rem"
    : isMobile
    ? "2.5rem"
    : isTablet
    ? "3.5rem"
    : "4.5rem";

  return (
    <div className="relative z-30 text-center px-4 w-full">
      <div className="inline-block rounded-3xl px-8 py-8 md:px-12 md:py-10 relative overflow-hidden skeleton-text-container">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20 skeleton-pattern" />

        {/* Glow effect */}
        <div className="absolute inset-0 skeleton-glow" />

        <div className="space-y-5 relative z-10">
          <div className="space-y-3">
            {/* Main title skeleton */}
            <div className="relative">
              <div
                className="h-14 md:h-20 rounded-xl overflow-hidden mx-auto skeleton-title-main"
                style={{
                  fontSize: titleSize,
                  maxWidth: isMobile ? "280px" : "500px",
                }}
              />
              <div className="absolute inset-0 opacity-20 skeleton-reflection" />
            </div>

            {/* Second line skeleton */}
            <div className="relative">
              <div
                className="h-14 md:h-20 rounded-xl overflow-hidden mx-auto skeleton-title-secondary"
                style={{
                  fontSize: titleSize,
                  maxWidth: isMobile ? "240px" : "420px",
                }}
              />
              <div className="absolute inset-0 opacity-20 skeleton-reflection-red" />
            </div>
          </div>

          {/* Description lines skeleton */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-center">
              <div
                className="h-5 rounded-lg overflow-hidden skeleton-desc"
                style={{
                  width: isMobile ? "90%" : "400px",
                  maxWidth: "100%",
                }}
              />
            </div>
            <div className="flex justify-center">
              <div
                className="h-5 rounded-lg overflow-hidden skeleton-desc-delayed"
                style={{
                  width: isMobile ? "75%" : "320px",
                  maxWidth: "100%",
                }}
              />
            </div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-3 md:gap-4 justify-center pt-6">
            <div
              className="h-12 rounded-full overflow-hidden relative skeleton-btn-primary"
              style={{ width: isMobile ? "130px" : "160px" }}
            >
              <div className="absolute inset-0 opacity-30 skeleton-btn-overlay" />
            </div>
            <div
              className="h-12 rounded-full overflow-hidden relative skeleton-btn-secondary"
              style={{ width: isMobile ? "120px" : "140px" }}
            >
              <div className="absolute inset-0 opacity-20 skeleton-btn-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations to head once
const addAnimationStyles = () => {
  if (document.getElementById("hero-animation-styles")) return;

  const style = document.createElement("style");
  style.id = "hero-animation-styles";
  style.textContent = `
    @keyframes shimmerSlide {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
    }
    @keyframes grainShift {
      0% { background-position: 0 0; }
      100% { background-position: 100% 100%; }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    @keyframes scanLine {
      0% { background-position: 0 -100%; }
      100% { background-position: 0 200%; }
    }
    @keyframes patternShift {
      0% { background-position: 0 0; }
      100% { background-position: 80px 80px; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    @keyframes scrollPulse {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(8px); }
    }
    
    /* Skeleton animations */
    .skeleton-gradient { animation: gradientShift 4s ease-in-out infinite; }
    .skeleton-shimmer {
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2.5s ease-in-out infinite;
    }
    .skeleton-grain {
      background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, transparent 1px, transparent 2px);
      background-size: 100% 3px;
      animation: grainShift 0.5s steps(10) infinite;
    }
    .border-glow {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    }
    .skeleton-corner {
      background: radial-gradient(circle at 0% 0%, rgba(239,68,68,0.15) 0%, transparent 70%);
      animation: pulseGlow 3s ease-in-out infinite;
    }
    .skeleton-scan {
      background: linear-gradient(transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%);
      background-size: 100% 200%;
      animation: scanLine 3s linear infinite;
    }
    .skeleton-pulse { animation: pulse 2s ease-in-out infinite; }
    .skeleton-bar {
      background: linear-gradient(90deg, rgb(82,82,82) 0%, rgb(64,64,64) 50%, rgb(82,82,82) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2s ease-in-out infinite;
    }
    .skeleton-dot { animation: pulse 1.5s ease-in-out infinite; }
    .skeleton-number {
      background: linear-gradient(90deg, rgb(64,64,64) 0%, rgb(82,82,82) 50%, rgb(64,64,64) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 1.8s ease-in-out infinite;
    }
    .skeleton-text-container {
      background: rgba(23, 23, 23, 0.7);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.06);
    }
    .skeleton-pattern {
      background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(239,68,68,0.03) 20px, rgba(239,68,68,0.03) 40px);
      animation: patternShift 10s linear infinite;
    }
    .skeleton-glow {
      background: radial-gradient(circle at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 70%);
      animation: pulseGlow 4s ease-in-out infinite;
    }
    .skeleton-title-main {
      background: linear-gradient(90deg, rgb(64,64,64) 0%, rgb(82,82,82) 25%, rgb(100,100,100) 50%, rgb(82,82,82) 75%, rgb(64,64,64) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2s ease-in-out infinite;
    }
    .skeleton-title-secondary {
      background: linear-gradient(90deg, rgb(82,28,28) 0%, rgb(120,40,40) 25%, rgb(160,50,50) 50%, rgb(120,40,40) 75%, rgb(82,28,28) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2s ease-in-out infinite;
      animation-delay: 0.3s;
    }
    .skeleton-reflection {
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%);
      border-radius: 0.75rem;
    }
    .skeleton-reflection-red {
      background: linear-gradient(180deg, rgba(255,100,100,0.15) 0%, transparent 50%);
      border-radius: 0.75rem;
    }
    .skeleton-desc {
      background: linear-gradient(90deg, rgb(55,55,55) 0%, rgb(75,75,75) 50%, rgb(55,55,55) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2.2s ease-in-out infinite;
    }
    .skeleton-desc-delayed {
      background: linear-gradient(90deg, rgb(55,55,55) 0%, rgb(75,75,75) 50%, rgb(55,55,55) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2.2s ease-in-out infinite;
      animation-delay: 0.7s;
    }
    .skeleton-btn-primary {
      background: linear-gradient(90deg, rgb(180,40,40) 0%, rgb(220,50,50) 50%, rgb(180,40,40) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2s ease-in-out infinite;
    }
    .skeleton-btn-secondary {
      background: linear-gradient(90deg, rgb(55,55,55) 0%, rgb(75,75,75) 50%, rgb(55,55,55) 100%);
      background-size: 200% 100%;
      animation: shimmerSlide 2s ease-in-out infinite;
      animation-delay: 1.1s;
    }
    .skeleton-btn-overlay {
      background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%);
    }
    
    /* Video frame optimizations */
    .video-frame {
      will-change: transform, opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    .video-element {
      will-change: opacity;
      transition: opacity 0.3s ease-out;
    }
    
    /* Performance optimizations */
    .hero-section {
      transform: translateZ(0);
      will-change: background-position;
    }
    .film-strip {
      will-change: transform;
      transform: translateZ(0);
    }
    .particle {
      will-change: transform, opacity;
      transform: translateZ(0);
    }
    
    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      *, .skeleton-gradient, .skeleton-shimmer, .skeleton-grain, .skeleton-corner,
      .skeleton-scan, .skeleton-pulse, .skeleton-bar, .skeleton-dot, .skeleton-number,
      .skeleton-pattern, .skeleton-glow, .skeleton-title-main, .skeleton-title-secondary,
      .skeleton-desc, .skeleton-desc-delayed, .skeleton-btn-primary, .skeleton-btn-secondary {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Lazy load GSAP only when needed
let gsapLoaded = false;
const loadGSAP = () => {
  if (gsapLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.gsap) {
      gsapLoaded = true;
      resolve();
    } else {
      // GSAP is already imported, just wait for next tick
      setTimeout(() => {
        gsapLoaded = true;
        resolve();
      }, 0);
    }
  });
};

export default function Hero() {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const filmStripRef = useRef(null);
  const framesRef = useRef([]);
  const videoRefs = useRef([]);
  const lightRef = useRef(null);
  const glassRef = useRef(null);
  const animationRef = useRef({
    filmTl: null,
    floatTls: [],
    particleTls: [],
    masterTl: null,
  });
  const rafRef = useRef(null);
  const resizeTimerRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const animationsStarted = useRef(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFrame, setActiveFrame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Memoized values
  const isMobile = useMemo(
    () => windowSize.width < BREAKPOINTS.md,
    [windowSize.width]
  );
  const isSmallMobile = useMemo(
    () => windowSize.width < BREAKPOINTS.sm,
    [windowSize.width]
  );
  const isTablet = useMemo(
    () =>
      windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg,
    [windowSize.width]
  );

  // Add animation styles on mount
  useEffect(() => {
    addAnimationStyles();
  }, []);

  // Intersection Observer for lazy animation start
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch videos with AbortController
  useEffect(() => {
    const abortController = new AbortController();

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getVideoReels({ isBest: true });

        const videoData = response.data.videoReels.map((video) => ({
          id: video._id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          videoUrl: video.videoUrl,
          description: video.description,
          tags: video.tags || [],
        }));

        if (!abortController.signal.aborted) {
          setVideos(videoData);
          // Shorter delay for faster transition
          setTimeout(() => {
            if (!abortController.signal.aborted) setLoading(false);
          }, 200);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Failed to fetch videos:", error);
          setLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      abortController.abort();
    };
  }, []);

  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  // Optimized mouse move with RAF and throttling
  const handleMouseMove = useCallback(
    (e) => {
      if (!heroRef.current || loading) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        setMousePos({ x, y });

        // Use CSS transform for better performance
        if (lightRef.current) {
          lightRef.current.style.transform = `translate(${x}%, ${y}%) translate(-50%, -50%)`;
        }
        if (glassRef.current) {
          glassRef.current.style.transform = `translate(${x}%, ${y}%) translate(-50%, -50%)`;
        }
      });
    },
    [loading]
  );

  // Create particles with useMemo - reduced count for performance
  const particles = useMemo(() => {
    const count = isMobile ? FRAME_COUNTS.mobile : FRAME_COUNTS.desktop;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (isMobile ? 2 : 3) + 1,
      speed: Math.random() * 0.5 + 0.2,
      color: `hsla(${Math.random() * 60 + 0}, 80%, 60%, ${
        Math.random() * 0.2 + 0.05
      })`,
      path: Math.random() > 0.7 ? "circle" : "line",
      pathRadius: Math.random() * (isMobile ? 15 : 20) + 10,
    }));
  }, [isMobile]);

  // Toggle playback
  const togglePlayback = useCallback(() => {
    const newState = !isPlaying;
    setIsPlaying(newState);

    if (animationRef.current.masterTl) {
      animationRef.current.masterTl.timeScale(newState ? 1 : 0);
    }
  }, [isPlaying]);

  // Initialize animations when visible and videos are loaded
  useEffect(() => {
    if (!isVisible || videos.length === 0 || loading || !textRef.current)
      return;
    if (animationsStarted.current) return;
    animationsStarted.current = true;

    const startAnimations = async () => {
      await loadGSAP();

      // Create master timeline
      animationRef.current.masterTl = gsap.timeline({
        paused: !isPlaying,
        defaults: { ease: "power3.out" },
      });

      const textElements = textRef.current.children;
      const textDuration = isMobile
        ? ANIMATION_CONFIG.textDuration.mobile
        : ANIMATION_CONFIG.textDuration.desktop;
      const textStagger = isMobile
        ? ANIMATION_CONFIG.textStagger.mobile
        : ANIMATION_CONFIG.textStagger.desktop;

      // Set initial styles with GSAP
      gsap.set(textElements, {
        opacity: 0,
        y: isMobile ? 40 : 60,
        rotationX: isMobile ? 10 : 15,
      });

      if (filmStripRef.current) {
        gsap.set(filmStripRef.current, {
          x: "-100%",
          rotationY: isMobile ? 10 : 20,
        });
      }

      if (framesRef.current.length) {
        gsap.set(framesRef.current, {
          opacity: 0,
          scale: isMobile ? 0.7 : 0.8,
          rotationY: isMobile ? -10 : -15,
        });
      }

      gsap.set(".particle", { opacity: 0 });
      if (lightRef.current) gsap.set(lightRef.current, { opacity: 0 });
      if (glassRef.current) {
        gsap.set(glassRef.current, {
          opacity: 0,
          scale: 0.8,
          filter: "blur(20px) brightness(1.1)",
        });
      }

      // Glass morphism reveal
      if (glassRef.current) {
        animationRef.current.masterTl.to(
          glassRef.current,
          {
            opacity: isMobile ? 0.3 : 0.4,
            scale: 1,
            duration: 1.5,
            ease: "expo.out",
          },
          0.3
        );
      }

      // Light reveal
      if (lightRef.current) {
        animationRef.current.masterTl.to(
          lightRef.current,
          {
            opacity: isMobile ? 0.15 : 0.25,
            duration: 1.8,
            ease: "sine.out",
          },
          0
        );
      }

      // Text animation
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
        isMobile ? 0.2 : 0.3
      );

      // Film strip animation
      if (filmStripRef.current) {
        animationRef.current.masterTl.to(
          filmStripRef.current,
          {
            x: "0%",
            rotationY: 0,
            duration: isMobile
              ? ANIMATION_CONFIG.filmDuration.mobile
              : ANIMATION_CONFIG.filmDuration.desktop,
            ease: "expo.out",
          },
          0
        );
      }

      // Frame animations
      if (framesRef.current.length) {
        animationRef.current.masterTl.to(
          framesRef.current,
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            stagger: isMobile
              ? ANIMATION_CONFIG.frameStagger.mobile
              : ANIMATION_CONFIG.frameStagger.desktop,
            duration: isMobile
              ? ANIMATION_CONFIG.frameDuration.mobile
              : ANIMATION_CONFIG.frameDuration.desktop,
            ease: "elastic.out(1, 0.4)",
          },
          isMobile ? 0.4 : 0.6
        );
      }

      // Continuous film movement - simplified for performance
      if (filmStripRef.current && framesRef.current.length > 0) {
        const totalWidth =
          framesRef.current.length *
          (parseInt(frameStyle.width) + parseInt(frameStyle.margin) * 2);
        const filmLoop = gsap.timeline({ repeat: -1 });
        filmLoop.to(filmStripRef.current, {
          x: `-=${totalWidth / 2}`,
          duration: isMobile ? 30 : 45,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
          },
        });
        animationRef.current.filmTl = filmLoop;
        animationRef.current.masterTl.add(filmLoop, isMobile ? 1.5 : 1.8);
      }

      // Floating animations for frames - simplified
      if (framesRef.current.length) {
        const floatAmount = isMobile
          ? ANIMATION_CONFIG.floatAmount.mobile
          : ANIMATION_CONFIG.floatAmount.desktop;
        const baseFloatDuration = isMobile
          ? ANIMATION_CONFIG.floatDuration.mobile
          : ANIMATION_CONFIG.floatDuration.desktop;

        framesRef.current.forEach((frame, i) => {
          if (!frame) return;

          const tl = gsap.timeline({ repeat: -1, yoyo: true });
          tl.to(
            frame,
            {
              y: Math.sin(i * 0.5) * floatAmount,
              rotationY: isMobile ? 3 : 5,
              duration: baseFloatDuration + (i % 5) * 0.3,
              ease: "sine.inOut",
            },
            0
          );
          animationRef.current.floatTls.push(tl);
          animationRef.current.masterTl.add(tl, isMobile ? 1.2 : 1.5);
        });
      }

      // Particle animations - delayed and simplified
      setTimeout(() => {
        const particleDuration = isMobile
          ? ANIMATION_CONFIG.particleDuration.mobile
          : ANIMATION_CONFIG.particleDuration.desktop;

        particles.forEach((particle, i) => {
          const particleElement = document.querySelector(`.particle-${i}`);
          if (!particleElement) return;

          const tl = gsap.timeline({ repeat: -1 });

          if (particle.path === "circle") {
            tl.to(
              particleElement,
              {
                motionPath: {
                  path: `M${particle.x},${particle.y} a${particle.pathRadius},${
                    particle.pathRadius
                  } 0 1,0 ${particle.pathRadius * 2},0 a${
                    particle.pathRadius
                  },${particle.pathRadius} 0 1,0 -${particle.pathRadius * 2},0`,
                  type: "cubic",
                  autoRotate: true,
                },
                duration: particleDuration + (i % 10),
                ease: "none",
              },
              0
            );
          } else {
            tl.to(
              particleElement,
              {
                x: `+=${Math.sin(i) * (isMobile ? 30 : 50)}`,
                y: `+=${Math.cos(i) * (isMobile ? 30 : 50)}`,
                duration: particleDuration + (i % 10),
                ease: "sine.inOut",
              },
              0
            );
          }

          tl.fromTo(
            particleElement,
            { opacity: 0 },
            {
              opacity: 0.12,
              duration: 1.5,
              ease: "sine.inOut",
            },
            0
          );

          animationRef.current.particleTls.push(tl);
          animationRef.current.masterTl.add(tl, isMobile ? 0.8 : 1);
        });
      }, 50);
    };

    startAnimations();

    return () => {
      if (animationRef.current.masterTl) {
        animationRef.current.masterTl.kill();
      }
      animationRef.current.floatTls.forEach((tl) => tl?.kill());
      animationRef.current.particleTls.forEach((tl) => tl?.kill());
      if (animationRef.current.filmTl) animationRef.current.filmTl.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      animationsStarted.current = false;
    };
  }, [windowSize.width, videos, isMobile, isPlaying, loading, isVisible]);

  const handleFrameHover = useCallback(
    (index, isHovering) => {
      if (isMobile || !framesRef.current[index] || loading) return;

      const videoIndex = index % videos.length;
      const videoElement = videoRefs.current[index];

      if (isHovering) {
        setActiveFrame(index);
        if (framesRef.current[index]) {
          framesRef.current[index].style.boxShadow =
            "0 10px 25px -5px rgba(239, 68, 68, 0.4)";
        }

        if (videoElement && videos[videoIndex]?.videoUrl) {
          videoElement.play().catch(() => {});
          videoElement.style.opacity = "1";
        }
      } else {
        setActiveFrame(null);
        if (framesRef.current[index]) {
          framesRef.current[index].style.boxShadow = "none";
        }

        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
          videoElement.style.opacity = "0";
        }
      }
    },
    [isMobile, videos, loading]
  );

  // Memoized frame style
  const frameStyle = useMemo(() => {
    if (isSmallMobile) {
      return { width: "160px", height: "50vh", margin: "0 8px" };
    } else if (isMobile) {
      return { width: "180px", height: "55vh", margin: "0 10px" };
    } else if (isTablet) {
      return { width: "200px", height: "60vh", margin: "0 12px" };
    }
    return { width: "256px", height: "75vh", margin: "0 12px" };
  }, [isSmallMobile, isMobile, isTablet]);

  // Memoized frames
  const frames = useMemo(() => {
    return videos.length > 0
      ? videos.map((video) => video.thumbnail)
      : Array(8).fill("/images/frames/placeholder.jpg");
  }, [videos]);

  // Memoized text styles
  const textStyles = useMemo(
    () => ({
      container: {
        maxWidth: isMobile ? "90%" : isTablet ? "80%" : "64rem",
        paddingBottom: isMobile ? "60px" : "0",
      },
      title: {
        fontSize: isSmallMobile
          ? "2.25rem"
          : isMobile
          ? "2.5rem"
          : isTablet
          ? "3.5rem"
          : "4.5rem",
      },
      description: {
        fontSize: isMobile ? "1rem" : "1.2rem",
        maxWidth: isMobile ? "100%" : "42rem",
      },
    }),
    [isMobile, isSmallMobile, isTablet]
  );

  // Memoized glass styles
  const glassStyles = useMemo(
    () => ({
      container: {
        width: isMobile ? "300px" : "500px",
        height: isMobile ? "300px" : "500px",
      },
      light: {
        width: isMobile ? "250px" : "400px",
        height: isMobile ? "250px" : "400px",
        filter: isMobile ? "blur(25px)" : "blur(40px)",
      },
      playbackBtn: {
        width: isMobile ? "40px" : "48px",
        height: isMobile ? "40px" : "48px",
      },
      playbackIcon: {
        width: isMobile ? "16px" : "20px",
        height: isMobile ? "16px" : "20px",
      },
    }),
    [isMobile]
  );

  return (
    <section
      ref={heroRef}
      className="hero-section h-screen w-full overflow-hidden flex items-center justify-center relative bg-neutral-950"
      onMouseMove={handleMouseMove}
      id="home"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(239, 68, 68, 0.1) 0%, transparent 70%)`,
        transition: "background 0.3s ease-out",
      }}
    >
      {/* Glass Morphism Effect */}
      <div
        ref={glassRef}
        className="absolute rounded-full pointer-events-none will-change-transform"
        style={{
          width: glassStyles.container.width,
          height: glassStyles.container.height,
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.08) 30%,
              rgba(255, 255, 255, 0.04) 50%,
              transparent 70%
            )
          `,
          backdropFilter: "blur(15px) brightness(1.05)",
          WebkitBackdropFilter: "blur(15px) brightness(1.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: `
            0 8px 25px 0 rgba(31, 38, 135, 0.15),
            inset 0 2px 12px 0 rgba(255, 255, 255, 0.08),
            inset 0 -2px 12px 0 rgba(0, 0, 0, 0.1)
          `,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "soft-light",
          opacity: loading ? 0 : undefined,
        }}
      />

      {/* Dynamic light */}
      <div
        ref={lightRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glassStyles.light.width,
          height: glassStyles.light.height,
          background:
            "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)",
          filter: glassStyles.light.filter,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          opacity: loading ? 0 : undefined,
        }}
      />

      {/* Particles container - only render when not loading and visible */}
      {!loading && isVisible && (
        <div ref={particlesContainerRef}>
          {particles.map((particle) => (
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
        </div>
      )}

      {/* Film strip */}
      <div
        ref={filmStripRef}
        className="film-strip absolute top-0 left-0 h-full flex items-center whitespace-nowrap will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {loading
          ? [...Array(6)].map((_, i) => (
              <SkeletonFrame
                key={`skeleton-${i}`}
                width={frameStyle.width}
                height={frameStyle.height}
                margin={frameStyle.margin}
                index={i}
              />
            ))
          : [...frames, ...frames].slice(0, 12).map((frame, i) => {
              const videoIndex = i % videos.length;
              const video = videos[videoIndex] || {};

              return (
                <div
                  key={i}
                  ref={(el) => (framesRef.current[i] = el)}
                  className="video-frame inline-block bg-neutral-900 overflow-hidden rounded-xl shadow-lg transition-shadow duration-300"
                  onMouseEnter={() => !isMobile && handleFrameHover(i, true)}
                  onMouseLeave={() => !isMobile && handleFrameHover(i, false)}
                  style={{
                    width: frameStyle.width,
                    height: frameStyle.height,
                    margin: frameStyle.margin,
                    transformOrigin: "center center",
                  }}
                >
                  {video.videoUrl && (
                    <video
                      ref={(el) => (videoRefs.current[i] = el)}
                      className="video-element absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0 }}
                      muted
                      loop
                      playsInline
                      preload="none"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>
                  )}

                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${frame})`,
                      backgroundColor: "#111",
                    }}
                  />

                  <div className="absolute inset-0 border border-neutral-800/50 pointer-events-none rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-xl" />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none rounded-b-xl" />
                  <div className="absolute bottom-3 left-3 text-xs text-neutral-300 font-mono pointer-events-none truncate max-w-[80%]">
                    {video.title
                      ? `${video.title.slice(0, 15)}${
                          video.title.length > 15 ? "..." : ""
                        }.mp4`
                      : `Clip_${i + 1}.mp4`}
                  </div>
                  <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              );
            })}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonText
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
          isTablet={isTablet}
        />
      ) : (
        <div
          ref={textRef}
          className="relative z-30 text-center px-4 w-full"
          style={textStyles.container}
        >
          <div
            className="inline-block rounded-3xl px-8 py-8 md:px-12 md:py-10 relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px) saturate(160%)",
              WebkitBackdropFilter: "blur(12px) saturate(160%)",
              boxShadow: `
                0 8px 25px 0 rgba(0, 0, 0, 0.25),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)
              `,
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    circle at 50% 0%,
                    rgba(255, 255, 255, 0.06) 0%,
                    transparent 50%
                  )
                `,
                mixBlendMode: "overlay",
              }}
            />

            <h1
              className="font-bold mb-4 md:mb-6 text-neutral-100 tracking-tight relative z-10"
              style={{
                fontSize: textStyles.title.fontSize,
                lineHeight: "1.1",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
              }}
            >
              <span className="block">Visual Storytelling</span>
              <span className="block text-red-500 mt-2 md:mt-4">
                Through the Lens
              </span>
            </h1>

            <p
              className="text-neutral-200 mb-6 md:mb-8 mx-auto leading-relaxed relative z-10"
              style={{
                fontSize: textStyles.description.fontSize,
                maxWidth: textStyles.description.maxWidth,
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.7)",
              }}
            >
              Transforming raw footage into{" "}
              <span className="text-red-400 font-medium">
                compelling narratives
              </span>{" "}
              that captivate audiences.
            </p>

            <div className="flex gap-3 md:gap-4 justify-center flex-wrap relative z-10">
              <a
                href="#showreel"
                className="px-6 py-3 md:px-8 md:py-4 bg-red-500 text-neutral-50 rounded-full hover:bg-red-600 transition-all transform hover:scale-[1.03] flex items-center group will-change-transform text-sm md:text-base shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10">View Portfolio</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1 relative z-10"
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
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 md:px-8 md:py-4 bg-white/08 backdrop-blur-sm border border-white/15 text-neutral-200 rounded-full hover:bg-white hover:text-neutral-900 transition-all transform hover:scale-[1.03] will-change-transform text-sm md:text-base shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10">Get in Touch</span>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    backdropFilter: "blur(4px)",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Playback control */}
      {!loading && (
        <div
          className="absolute z-20 flex items-center"
          style={{
            bottom: isMobile ? "20px" : "32px",
            left: isMobile ? "16px" : "32px",
          }}
        >
          <button
            onClick={togglePlayback}
            className="playback-btn rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 will-change-transform relative overflow-hidden"
            style={{
              width: glassStyles.playbackBtn.width,
              height: glassStyles.playbackBtn.height,
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {isPlaying ? (
              <svg
                className="text-neutral-300 relative z-10"
                style={{
                  width: glassStyles.playbackIcon.width,
                  height: glassStyles.playbackIcon.height,
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
                className="text-neutral-300 relative z-10"
                style={{
                  width: glassStyles.playbackIcon.width,
                  height: glassStyles.playbackIcon.height,
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
          {!isSmallMobile && (
            <span className="ml-2 md:ml-3 text-xs md:text-sm text-neutral-400 font-medium tracking-wider">
              {isPlaying ? "PAUSE ANIMATIONS" : "PLAY ANIMATIONS"}
            </span>
          )}
        </div>
      )}

      {/* Scrolling indicator */}
      {!loading && (
        <div
          className="absolute z-20"
          style={{
            bottom: isMobile ? "20px" : "32px",
            right: isMobile ? "16px" : "32px",
          }}
        >
          <div
            className="animate-bounce flex flex-col items-center p-3 rounded-xl"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-red-500/50 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-red-500 mt-2 rounded-full animate-[scrollPulse_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
