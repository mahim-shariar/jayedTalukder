import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { login, getVideoReelsByCategory } from "../../services/api";

export default function EasterEgg() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const lockRef = useRef(null);
  const eggRef = useRef(null);
  const riddleRef = useRef(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showRiddle, setShowRiddle] = useState(false);
  const [activeTab, setActiveTab] = useState("myFirstEdit");
  const [currentHint, setCurrentHint] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Riddle configuration
  const riddles = [
    {
      question:
        "I capture moments but don't use film. I tell stories without words. What am I?",
      answer: "camera",
      hints: [
        "I have lenses but don't wear them",
        "My best work often happens in low light",
        "I'm a director's best friend",
      ],
    },
    {
      question:
        "I'm always running but never get tired. I show your work but don't get paid. What am I?",
      answer: "timeline",
      hints: [
        "Editors spend hours with me",
        "I'm linear but can be manipulated",
        "I live inside your editing software",
      ],
    },
    {
      question:
        "I shift the skies and paint the air,Four faces I wear, none ever rare.Not in plain sight, yet close to you—Crack my rhythm to find what's true. Who am I?",
      answer: "ritu",
      hints: [
        "I come and go, but always return—like a cycle written by nature.",
        "My name hides in the seasons' song, known best to poets and lovers.",
        "Look beyond the weather—I'm also the one your heart answers to.",
      ],
    },
    {
      question:
        "I speak without a mouth and hear without ears. I have no body, but I come alive with movement. What am I?",
      answer: "echo",
      hints: [
        "I'm often found in mountains or caves",
        "I'm your own voice, coming back",
        "You call, I answer—but never first",
      ],
    },
    {
      question:
        "I'm not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
      answer: "fire",
      hints: [
        "I dance in the dark but disappear in rain",
        "I warm your hands but can destroy homes",
        "Without me, there's no light in the wild",
      ],
    },
    {
      question:
        "I hide in code and dance in light, you see me in dreams or deep at night. I'm not real, but I feel true—what am I to you?",
      answer: "illusion",
      hints: [
        "I live in magic, mirrors, and minds",
        "Sometimes I'm beauty, sometimes I lie",
        "I blur the line between real and fake",
      ],
    },
    {
      question:
        "You'll find me in hearts, yet I'm not blood. I'm said in silence, felt more than seen. What am I?",
      answer: "love",
      hints: [
        "I'm stronger than time but weigh nothing",
        "Poets chase me, fighters fight for me",
        "I'm often broken, but never truly gone",
      ],
    },
    {
      question:
        "I'm made to be shared but often kept secret. Once I'm told, I'm no longer mine. What am I?",
      answer: "secret",
      hints: [
        "You whisper me when no one's near",
        "I can destroy or deepen trust",
        "One word from you, and I'm free",
      ],
    },
  ];
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch videos when active tab changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const categoryMap = {
          myFirstEdit: "myFirstEdit",
          bloopers: "bloopers",
          behindScenes: "behindTheScenes",
        };

        const response = await getVideoReelsByCategory(categoryMap[activeTab]);
        setVideos(response.data.videoReels || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    if (isUnlocked && showModal) {
      fetchVideos();
    }
  }, [activeTab, isUnlocked, showModal]);

  // Unlock animations
  useEffect(() => {
    if (isUnlocked) {
      gsap.fromTo(
        eggRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            setShowContent(true);
            setShowModal(true);
          },
        }
      );
    }
  }, [isUnlocked]);

  // Scroll detection
  const handleScrollToBottom = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      unlockEgg();
    }
  };

  const unlockEgg = () => {
    if (!isUnlocked) {
      // Play lock animation
      gsap.to(lockRef.current, {
        y: -10,
        duration: 0.3,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut",
      });

      setIsUnlocked(true);
      window.removeEventListener("scroll", handleScrollToBottom);
    }
  };

  // Riddle functions
  const checkAnswer = () => {
    if (
      userAnswer.toLowerCase() === riddles[currentRiddle].answer.toLowerCase()
    ) {
      gsap.to(riddleRef.current, {
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 0.5)",
        duration: 0.5,
        onComplete: () => {
          // Special case for the "ritu" riddle (index 2)
          if (currentRiddle === 2) {
            setShowLoginModal(true);
          } else {
            unlockEgg();
          }
          setShowRiddle(false);
        },
      });
    } else {
      gsap.fromTo(
        riddleRef.current,
        { x: -5 },
        {
          x: 5,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => gsap.to(riddleRef.current, { x: 0, duration: 0.2 }),
        }
      );
    }
  };

  const showHint = () => {
    const hints = riddles[currentRiddle].hints;
    setCurrentHint(hints[hintIndex]);
    setHintIndex((hintIndex + 1) % hints.length);
  };

  // Video control functions
  const handleVideoPlay = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideos((prev) => ({ ...prev, [videoId]: true }));
      } else {
        video.pause();
        setPlayingVideos((prev) => ({ ...prev, [videoId]: false }));
      }
    }
  };

  const handleVideoEnded = (videoId) => {
    const video = videoRefs.current[videoId];
    if (video) {
      video.currentTime = 0;
      setPlayingVideos((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  // Close modal
  const closeModal = () => {
    // Pause all videos when closing modal
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setPlayingVideos({});

    gsap.to(eggRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setShowContent(false);
        setShowModal(false);
        setIsUnlocked(false);
      },
    });
  };

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      // Handle successful login
      console.log(response);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setLoginSuccess(true);

        // Show success message for 2 seconds before closing modal
        setTimeout(() => {
          closeLoginModal();
          window.location.reload();
        }, 2000);
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Close login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setUserAnswer("");
    setCurrentHint(null);
    setHintIndex(0);
    setLoginData({ email: "", password: "" });
    setLoginError(null);
  };

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScrollToBottom);
    return () => window.removeEventListener("scroll", handleScrollToBottom);
  }, []);

  return (
    <div className="relative">
      {/* Floating lock button - always visible */}
      <div
        ref={lockRef}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        onClick={() => {
          if (!isUnlocked) {
            setShowRiddle(true);
            setCurrentHint(null);
            setHintIndex(0);
          } else {
            setShowModal(true);
          }
        }}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg
            className={`w-8 h-8 transition-all duration-300 ${
              isUnlocked
                ? "text-green-500 rotate-45"
                : "text-red-400 group-hover:text-red-300"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isUnlocked ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            )}
          </svg>

          <div
            className={`absolute inset-0 rounded-full ${
              isUnlocked ? "bg-green-500/10" : "bg-red-500/10"
            } group-hover:opacity-100 opacity-0 transition-opacity duration-300`}
          ></div>

          {!isUnlocked && (
            <div className="absolute inset-0 border border-red-400/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </div>
      </div>

      {/* Riddle Modal */}
      {showRiddle && !isUnlocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={riddleRef}
            className="bg-[#0f0f0f] border border-white/10 rounded-lg max-w-md w-full p-6 relative shadow-2xl shadow-red-900/20"
          >
            <button
              onClick={() => setShowRiddle(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-xl font-mono text-red-400 mb-4">
              UNLOCK THE VAULT
            </h3>
            <p className="text-white/80 mb-6">
              {riddles[currentRiddle].question}
            </p>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 bg-black/30 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="Your answer..."
                  onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                />
                <button
                  onClick={checkAnswer}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors rounded"
                >
                  Submit
                </button>
              </div>

              {/* Hint display area */}
              {currentHint && (
                <div className="bg-black/20 p-2 rounded text-xs text-white/70 mt-1 animate-fadeIn">
                  <span className="text-red-400 mr-1">Hint:</span> {currentHint}
                </div>
              )}
            </div>

            <div className="text-xs text-white/50 mt-2">
              <button
                onClick={() => {
                  setCurrentRiddle((currentRiddle + 1) % riddles.length);
                  setUserAnswer("");
                  setCurrentHint(null);
                  setHintIndex(0);
                }}
                className="hover:text-white/80 transition-colors mr-4"
              >
                Different riddle
              </button>
              <button
                onClick={showHint}
                className="hover:text-white/80 transition-colors"
              >
                Need a hint?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Easter Egg Content Modal */}
      {showModal && isUnlocked && (
        <div
          ref={eggRef}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <div
            className="relative w-full max-w-4xl h-full md:h-[80vh] bg-gradient-to-br from-[#0f0f0f] to-black border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-red-900/30"
            style={{
              maxHeight: isMobile ? "100vh" : "80vh",
            }}
          >
            {/* Film strip overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPHBhdGggZD0iTTAgMTBoMTB2MTBIMHpNMjAgMTBoMTB2MTBIMjB6TTQwIDEwaDEwdjEwSDQwek02MCAxMGgxMHYxMEg2MHpNODAgMTBoMTB2MTBIODB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-10"></div>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-colors"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="relative h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="border-b border-white/10 p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  <span className="font-mono text-red-500">SECRET_VAULT:</span>{" "}
                  BLOOPERS & BEGINNINGS
                </h2>
                <p className="text-white/60 mt-1">
                  Unlocked achievement: Curious Explorer
                </p>
              </div>

              {/* Tabbed content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex border-b border-white/10">
                  <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "myFirstEdit"
                        ? "border-red-500 text-red-400"
                        : "border-transparent text-white/50 hover:text-white/80"
                    } transition-colors`}
                    onClick={() => setActiveTab("myFirstEdit")}
                  >
                    {isMobile ? "1st Edit" : "My First Edit"}
                  </button>
                  <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "bloopers"
                        ? "border-red-500 text-red-400"
                        : "border-transparent text-white/50 hover:text-white/80"
                    } transition-colors`}
                    onClick={() => setActiveTab("bloopers")}
                  >
                    Bloopers
                  </button>
                  <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === "behindScenes"
                        ? "border-red-500 text-red-400"
                        : "border-transparent text-white/50 hover:text-white/80"
                    } transition-colors`}
                    onClick={() => setActiveTab("behindScenes")}
                  >
                    {isMobile ? "BTS" : "Behind Scenes"}
                  </button>
                </div>

                {/* Main content area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-custom">
                  {loadingVideos ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <div key={video._id} className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          {video.title}
                        </h3>
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden border border-white/10 relative">
                          <video
                            ref={(el) => (videoRefs.current[video._id] = el)}
                            className="w-full h-full object-cover"
                            loop
                            controls={false}
                            onClick={() => handleVideoPlay(video._id)}
                            onEnded={() => handleVideoEnded(video._id)}
                            poster={video.thumbnailUrl}
                          >
                            <source src={video.videoUrl} type="video/mp4" />
                          </video>
                          {!playingVideos[video._id] && (
                            <button
                              onClick={() => handleVideoPlay(video._id)}
                              className="absolute inset-0 flex items-center justify-center w-full h-full group"
                            >
                              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-black/70 transition-colors">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </button>
                          )}
                          <div className="absolute bottom-4 text-white left-4 bg-black/80 px-3 py-1 rounded text-sm font-mono z-20 backdrop-blur-sm">
                            {video.title.toUpperCase().replace(/\s+/g, "_")}.MP4
                          </div>
                        </div>
                        <p className="text-white/70 mt-4 text-sm">
                          {video.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-white/50">
                      No videos found for this category.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <h4 className="text-red-400 font-mono text-xs mb-2">
                        CREATIVE ARSENAL
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Hand-me-down DSLR (my first "professional" camera)
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          GarageBand for early audio experiments
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Free music from YouTube's audio library
                        </li>
                      </ul>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <h4 className="text-red-400 font-mono text-xs mb-2">
                        HARD-WON WISDOM
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Audio quality matters more than 4K resolution
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          The magic happens in pre-production
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Clients remember feelings, not frame rates
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-8">
                      MY CREATIVE EVOLUTION
                    </h3>

                    {/* Alternate Timeline Design */}
                    <div className="relative">
                      {/* Decorative elements */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-red-500/30 to-transparent"></div>
                        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
                      </div>

                      {/* Timeline Items */}
                      <div className="space-y-12 pl-12">
                        {/* Item 1 */}
                        <div className="relative group">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 transition-all duration-300 group-hover:scale-110">
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
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              ></path>
                            </svg>
                          </div>

                          <div className="bg-gradient-to-r from-black/30 to-black/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs font-mono px-2 py-1 rounded bg-red-900/30 text-red-400 border border-red-800/50">
                                    AWAKENING
                                  </span>
                                  <span className="text-xs text-white/50">
                                    2024
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  The Classroom Rebellion
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  Found more inspiration in editing event
                                  footage than attending lectures - the first
                                  crack in my academic facade
                                </p>
                              </div>
                              <div className="sm:w-32 flex justify-center">
                                <div className="w-16 h-16 bg-black/50 rounded-lg border border-white/10 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item 2 */}
                        <div className="relative group">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-110">
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>

                          <div className="bg-gradient-to-r from-black/30 to-black/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs font-mono px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50">
                                    VALIDATION
                                  </span>
                                  <span className="text-xs text-white/50">
                                    2024
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  Digital Dropout Skool
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  That MacBook wasn't just a tool - it was proof
                                  I could build a future outside traditional
                                  education
                                </p>
                              </div>
                              <div className="sm:w-32 flex justify-center">
                                <div className="relative">
                                  <div className="w-16 h-12 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-500 rounded-full"></div>
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gray-900 rounded-full"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-400 font-mono">
                                      MacBook Pro
                                    </div>
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] px-1 rounded">
                                    REWARD
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item 3 */}
                        <div className="relative group">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:scale-110">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>

                          <div className="bg-gradient-to-r from-black/30 to-black/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs font-mono px-2 py-1 rounded bg-purple-900/30 text-purple-400 border border-purple-800/50">
                                    GRIND
                                  </span>
                                  <span className="text-xs text-white/50">
                                    2024
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  The Nocturnal Editor
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  2AM color grading sessions between classes -
                                  sacrificing sleep for skills that would become
                                  my career
                                </p>
                              </div>
                              <div className="sm:w-32 flex justify-center">
                                <div className="w-16 h-16 bg-black/50 rounded-lg border border-white/10 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item 4 */}
                        <div className="relative group">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20 transition-all duration-300 group-hover:scale-110">
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
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              ></path>
                            </svg>
                          </div>

                          <div className="bg-gradient-to-r from-black/30 to-black/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs font-mono px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800/50">
                                    CLARITY
                                  </span>
                                  <span className="text-xs text-white/50">
                                    2024
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  The Pivot
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  Realized my "side hustle" was actually my main
                                  hustle - the moment education became
                                  self-directed
                                </p>
                              </div>
                              <div className="sm:w-32 flex justify-center">
                                <div className="w-16 h-16 bg-black/50 rounded-lg border border-white/10 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item 5 */}
                        <div className="relative group">
                          <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-500/20 transition-all duration-300 group-hover:scale-110">
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
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              ></path>
                            </svg>
                          </div>

                          <div className="bg-gradient-to-r from-black/30 to-black/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs font-mono px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-800/50">
                                    NOW
                                  </span>
                                  <span className="text-xs text-white/50">
                                    Present
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  Storytelling Alchemist
                                </h4>
                                <p className="text-white/70 text-sm mt-1">
                                  Transforming raw footage into emotional
                                  experiences - the hungry student now crafts
                                  what inspires others
                                </p>
                              </div>
                              <div className="sm:w-32 flex justify-center">
                                <div className="w-16 h-16 bg-black/50 rounded-lg border border-white/10 flex items-center justify-center">
                                  <svg
                                    className="w-8 h-8 text-yellow-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.5"
                                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 text-center text-xs text-white/50">
                Found {Math.floor(Math.random() * 20) + 5} more secrets. Keep
                exploring!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal - shown when "ritu" riddle is solved */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Success notification */}
          {loginSuccess && (
            <motion.div
              className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Login successful! Redirecting...
            </motion.div>
          )}

          <motion.section
            className="max-h-screen my-10 py-24 bg-[#0a0a0a] text-white relative overflow-hidden w-full max-w-2xl rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back button */}
            <motion.button
              onClick={closeLoginModal}
              className="absolute top-6 left-6 z-30 flex items-center justify-center p-2 rounded-full bg-black/30 border border-white/10 hover:border-red-500 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-red-400"
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
            </motion.button>

            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

            {/* Content container */}
            <div className="container mx-auto px-4 relative z-20 flex items-center justify-center h-full">
              <motion.div
                className="login-form w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Terminal-style header */}
                <motion.div
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 mb-2">
                    EDITOR LOGIN
                  </h2>
                  <div className="font-mono text-red-400/80 text-sm">
                    <span>Jayed&gt; _ Access your projects dashboard</span>
                    <span className="ml-1 animate-pulse">_</span>
                  </div>
                </motion.div>

                {/* Login form */}
                <motion.div
                  className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-xl p-8 relative overflow-hidden group"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)",
                  }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/10 blur-lg rounded-xl"></div>
                  </motion.div>

                  <form onSubmit={handleLoginSubmit}>
                    <div className="space-y-6">
                      {/* Email field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <label
                          htmlFor="email"
                          className="block text-sm font-mono text-red-400 mb-2"
                        >
                          EMAIL_ADDRESS
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white placeholder-white/30 font-mono text-sm transition-all duration-300"
                            placeholder="editor@jayed.com"
                            required
                          />
                          <div className="absolute right-3 top-3 text-white/30">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      {/* Password field */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <label
                          htmlFor="password"
                          className="block text-sm font-mono text-red-400 mb-2"
                        >
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white placeholder-white/30 font-mono text-sm transition-all duration-300"
                            placeholder="••••••••"
                            required
                          />
                          <div className="absolute right-3 top-3 text-white/30">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      {/* Error message */}
                      {loginError && (
                        <motion.div
                          className="text-red-400 text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {loginError}
                        </motion.div>
                      )}

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Login
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
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>

                {/* Sign up link */}
                <motion.div
                  className="mt-6 text-center text-sm text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <span>Need an editor account? </span>
                  <a
                    href="#"
                    className="font-mono text-red-400 hover:text-red-300 transition-colors"
                  >
                    Request access
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>
          </motion.section>
        </div>
      )}
    </div>
  );
}
