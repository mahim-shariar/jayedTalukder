import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jayed_Profile from "/image/jayed-2.JPG";
import macbookImage from "/image/jayed-9.jpg";
import { getVideoReelsByCategory } from "../../services/api";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function About() {
  const videoRef = useRef(null);
  const textContainerRef = useRef(null);
  const grainRef = useRef(null);
  const imageContainerRef = useRef(null);
  const bioModalRef = useRef(null);
  const [showBio, setShowBio] = useState(false);
  const modalOverlayRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [macbookImageLoaded, setMacbookImageLoaded] = useState(false);
  const aboutSectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const storyContentRef = useRef(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    // Fetch intro video when component mounts
    const fetchIntroVideo = async () => {
      try {
        setLoadingVideo(true);
        const response = await getVideoReelsByCategory("mySelfIntro");
        if (
          response.data &&
          response.data.videoReels &&
          response.data.videoReels.length > 0
        ) {
          // Use the first video from the response
          setIntroVideo(response.data.videoReels[0]);
        }
      } catch (error) {
        console.error("Failed to fetch intro video:", error);
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchIntroVideo();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setVideoPlaying(false);
      // Reset video to show thumbnail/poster
      video.currentTime = 0;
    };

    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    // Set initial hidden state
    gsap.set(imageContainerRef.current, { x: -100, opacity: 0 });
    gsap.set([leftColumnRef.current, rightColumnRef.current], {
      y: 50,
      opacity: 0,
    });

    const sections = [
      { text: "Jayed> _ Passionate visual storyteller", delay: 0.3 },
      { text: "Jayed> _ Cinematic eye since 2024", delay: 1.2 },
      { text: "Jayed> _ Specializing in emotional narratives", delay: 1.8 },
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

    // Image reveal from left after slight delay
    gsap.to(imageContainerRef.current, {
      x: 0,
      opacity: 1,
      duration: 1.5,
      delay: 0.5,
      ease: "back.out(1.2)",
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

  const handleVideoHover = (enter) => {
    if (videoRef.current) {
      if (enter) {
        gsap.to(videoRef.current, { scale: 1.03, duration: 0.5 });
      } else {
        gsap.to(videoRef.current, { scale: 1, duration: 0.5 });
      }
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.muted = false;
      setVideoPlaying(true);
    }
  };

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

  return (
    <section
      ref={aboutSectionRef}
      id="about"
      className="about-section min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>

      {/* Cinematic grain overlay */}
      <div
        ref={grainRef}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"
      />

      {/* Split layout */}
      <div className="container mx-auto px-4 py-20 h-full flex flex-col lg:flex-row items-center gap-12 relative z-20">
        {/* Video reel - Left side */}
        <div
          ref={leftColumnRef}
          className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative overflow-hidden rounded-lg border border-white/10 shadow-2xl hover:shadow-red-500/30 transition-all duration-500 group"
          onMouseEnter={() => handleVideoHover(true)}
          onMouseLeave={() => handleVideoHover(false)}
        >
          {loadingVideo ? (
            <div className="absolute inset-0 bg-gray-800 rounded-sm animate-pulse flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              <video
                ref={videoRef}
                playsInline
                className="w-full h-full object-cover"
                src={introVideo?.videoUrl || "/assets/reel.mp4"}
                poster={introVideo?.thumbnailUrl}
                onClick={handlePlayVideo}
              >
                <source
                  src={introVideo?.videoUrl || "/assets/reel.mp4"}
                  type={
                    introVideo?.videoUrl?.endsWith(".webm")
                      ? "video/webm"
                      : "video/mp4"
                  }
                />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay - shows when video isn't playing */}
              {!videoPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                  onClick={handlePlayVideo}
                >
                  <div className="w-16 h-16 bg-red-500/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-sm font-mono z-20 backdrop-blur-sm">
                {introVideo ? `▶︎ ${introVideo.title}` : "▶︎ REEL_2024.MP4"}
              </div>
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-900/50"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-900/50"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-900/50"></span>
              </div>
            </>
          )}
        </div>

        {/* Personal story - Right side */}
        <div
          ref={rightColumnRef}
          className="w-full lg:w-1/2 flex flex-col lg:pl-12 relative"
        >
          {/* Terminal-style text */}
          <div className="mb-8 font-mono text-red-400 text-lg">
            <span ref={textContainerRef}></span>
            <span id="terminal-cursor" className="ml-1">
              |
            </span>
          </div>

          {/* Profile image container with skeleton loading */}
          <div
            ref={imageContainerRef}
            className="relative float-right ml-6 mb-8"
          >
            <div className="w-48 h-46 relative">
              {/* Skeleton loader */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 rounded-sm animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50"></div>
                </div>
              )}

              {/* Image frame */}
              <div
                className={`absolute inset-0 rounded-sm shadow-[0_0_30px_0_rgba(255,0,0,0.3)] transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center rounded-sm border-4 border-white/20 relative overflow-hidden"
                  style={{ backgroundImage: `url(${jayed_Profile})` }}
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_10px_rgba(0,0,0,0.7)]"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xNSIvPgo8L3N2Zz4=')] opacity-30"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs rotate-3 z-20 shadow-lg shadow-red-900/50">
                  EDITOR'S CUT
                </div>
              </div>

              {/* Hidden image for loading detection */}
              <img
                src={jayed_Profile}
                alt=""
                className="hidden"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            {/* Outer glow */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/5 blur-lg rounded-sm"></div>
          </div>

          {/* Story content */}
          <div ref={storyContentRef} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              The Storyteller
            </h2>

            <p className="text-white/80 leading-relaxed font-light">
              My journey began in the backstreets of Dhaka, armed with nothing
              but a handheld camcorder and relentless curiosity. Today, I craft
              visual narratives that make brands unforgettable and wedding
              moments eternal.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
                <h3 className="text-red-400 mb-2 font-medium">Philosophy</h3>
                <p className="text-sm text-white/80">
                  "Frame every shot like it's your last"
                </p>
              </div>
              <div className="p-4 border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
                <h3 className="text-red-400 mb-2 font-medium">Specialty</h3>
                <p className="text-sm text-white/80">
                  Emotional storytelling through movement
                </p>
              </div>
            </div>

            <button
              onClick={toggleBio}
              className="mt-8 px-6 py-3 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center group"
            >
              <span>Full Biography</span>
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
          </div>
        </div>
      </div>

      {/* Biography Modal - Cinematic Reveal */}
      {showBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark overlay with fade effect */}
          <div
            ref={modalOverlayRef}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={toggleBio}
          ></div>

          {/* Film strip borders */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#1a1a1a] border-b border-white/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a1a1a] border-t border-white/10"></div>

          {/* Modal content with film reel effect */}
          <div
            ref={bioModalRef}
            className="relative z-10 max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-gradient-to-br from-[#0f0f0f] to-black border border-white/10 rounded-lg shadow-2xl shadow-red-900/30 p-8 scrollbar-custom"
          >
            {/* Close button styled as film camera button */}
            <button
              onClick={toggleBio}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-colors"
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
                ></path>
              </svg>
            </button>

            {/* Biography content with cinematic typography */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                <span className="font-mono text-red-500">THE_REAL_STORY</span>{" "}
                FROM BOREDOM TO BRILLIANCE
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                    CHAPTER ONE: THE AWAKENING
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    It was 2024. I was sitting in my university classroom,
                    feeling completely disconnected. The traditional education
                    path wasn't lighting me up. Then came my first paid video
                    gig - shaky footage of a local event, edited on borrowed
                    hardware. It wasn't glamorous, but that spark of creation
                    changed everything.
                  </p>

                  <p className="text-white/80 leading-relaxed mt-4">
                    When I joined Digital Dropout Skool, it felt like someone
                    finally handed me the keys to my future. That MacBook they
                    awarded me for my performance? It became my weapon of choice
                    - my passport from boredom to creative freedom.
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                  <h4 className="text-red-400 font-mono text-sm mb-2">
                    TURNING POINTS
                  </h4>
                  <ul className="space-y-3 text-sm text-white/80">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">▶</span>
                      <span>
                        2024: First paid video work while in university
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">▶</span>
                      <span>Joined Digital Dropout Skool program</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">▶</span>
                      <span>
                        Earned MacBook through exceptional performance
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">▶</span>
                      <span>Found my voice in visual storytelling</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* MacBook Achievement Section with Skeleton */}
              <div className="mt-8 p-6 bg-black/20 rounded-lg border border-white/10 relative overflow-hidden">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                  MY TURNING POINT
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    {/* Skeleton for MacBook image */}
                    {!macbookImageLoaded && (
                      <div className="relative rounded-lg overflow-hidden border-2 border-white/20 h-48 bg-gray-800 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50"></div>
                      </div>
                    )}
                    {/* MacBook image */}
                    <div
                      className={`relative rounded-lg overflow-hidden border-2 border-white/20 transition-opacity duration-500 ${
                        macbookImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={macbookImage}
                        alt="MacBook achievement"
                        className="w-full h-auto object-cover"
                        onLoad={() => setMacbookImageLoaded(true)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white font-mono text-sm bg-black/50 px-2 py-1 rounded">
                        Digital Dropout Skool Reward
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-white/80 leading-relaxed">
                      This MacBook represents more than just hardware - it
                      symbolizes my transformation. Awarded by Digital Dropout
                      Skool for exceptional performance, it became the tool that
                      launched my creative journey. From my first edits to
                      professional projects, this machine has been my constant
                      companion.
                    </p>
                    <div className="mt-4 flex items-center text-red-400">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      <span className="font-mono text-sm">
                        Performance Reward 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                CHAPTER TWO: THE HUSTLE
              </h3>
              <p className="text-white/80 leading-relaxed mb-6">
                That MacBook became my film studio. I taught myself color
                grading by watching YouTube tutorials at 2AM. Mastered
                transitions by failing spectacularly on client projects. Every
                mistake was a lesson, every client a chance to level up. From
                filming friends' birthdays to being trusted with wedding
                memories - each project stretched me further.
              </p>

              <div className="bg-black/20 p-6 rounded-lg border border-white/10 mb-6">
                <h4 className="text-red-400 font-mono text-sm mb-3">
                  CREATIVE TOOLS
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-white font-medium">
                      My Trusted MacBook
                    </div>
                    <div className="text-white/60">
                      First real creative tool
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      DaVinci Resolve
                    </div>
                    <div className="text-white/60">Color grading wizardry</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">Premiere Pro</div>
                    <div className="text-white/60">Editing playground</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">After Effects</div>
                    <div className="text-white/60">Motion magic</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">Final Cut Pro </div>
                    <div className="text-white/60">Final cut magic</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                CHAPTER THREE: THE VISION
              </h3>
              <p className="text-white/80 leading-relaxed">
                "My journey proves that creativity can't be contained in
                classrooms. Real growth happens when you take that first shaky
                shot, render your first terrible edit, and keep going anyway.
                Every frame I create now carries that hungry 2024 version of me
                - the university student who dared to dream bigger than the
                syllabus."
              </p>

              <div className="mt-8 p-4 bg-red-900/10 border border-red-900/30 rounded-lg">
                <h4 className="text-red-400 font-mono text-sm mb-2">
                  TO THOSE STARTING OUT:
                </h4>
                <p className="text-white/80 italic">
                  "The equipment doesn't make the artist - your vision does. I
                  went from bored student to visual storyteller with nothing but
                  passion and a single laptop. If I can do it, so can you."
                </p>
              </div>
            </div>
          </div>

          {/* Film reel corner decorations */}
          <div className="absolute top-8 left-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30"></div>
        </div>
      )}

      {/* Subtle floating film particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
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

      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #f43f5e #0f0f0f;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #0f0f0f;
          border-left: 1px solid #ffffff10;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #f43f5e;
          border-radius: 4px;
          border: 1px solid #ffffff20;
          background-clip: padding-box;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: #e11d48;
        }
      `}</style>
    </section>
  );
}
