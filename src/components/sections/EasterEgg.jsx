import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { login } from "../../services/api";

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
  const [activeTab, setActiveTab] = useState("first-edit");
  const [currentHint, setCurrentHint] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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

  // Close modal
  const closeModal = () => {
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
                      activeTab === "first-edit"
                        ? "border-red-500 text-red-400"
                        : "border-transparent text-white/50 hover:text-white/80"
                    } transition-colors`}
                    onClick={() => setActiveTab("first-edit")}
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
                      activeTab === "behind-scenes"
                        ? "border-red-500 text-red-400"
                        : "border-transparent text-white/50 hover:text-white/80"
                    } transition-colors`}
                    onClick={() => setActiveTab("behind-scenes")}
                  >
                    {isMobile ? "BTS" : "Behind Scenes"}
                  </button>
                </div>

                {/* Main content area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-custom">
                  {activeTab === "first-edit" && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {isMobile ? "Beginnings" : "The Humble Beginnings"}
                      </h3>
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden border border-white/10 relative">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          controls
                        >
                          <source
                            src="/assets/first-edit.mp4"
                            type="video/mp4"
                          />
                        </video>
                        <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-sm font-mono z-20 backdrop-blur-sm">
                          FIRST_EDIT.MP4
                        </div>
                      </div>
                      <p className="text-white/70 mt-4 text-sm">
                        My first edit - no transitions, no color grading, just
                        raw footage. I thought lens flares every 5 seconds was
                        "cinematic".
                      </p>
                    </div>
                  )}

                  {activeTab === "bloopers" && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Bloopers Reel
                      </h3>
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden border border-white/10 relative">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          controls
                        >
                          <source src="/assets/bloopers.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-sm font-mono z-20 backdrop-blur-sm">
                          BLOOPERS.MP4
                        </div>
                      </div>
                      <p className="text-white/70 mt-4 text-sm">
                        Everyone starts somewhere! My funniest mistakes and
                        unexpected moments.
                      </p>
                    </div>
                  )}

                  {activeTab === "behind-scenes" && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Behind The Scenes
                      </h3>
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden border border-white/10 relative">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          controls
                        >
                          <source
                            src="/assets/behind-scenes.mp4"
                            type="video/mp4"
                          />
                        </video>
                        <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-sm font-mono z-20 backdrop-blur-sm">
                          MAKING_OF.MP4
                        </div>
                      </div>
                      <p className="text-white/70 mt-4 text-sm">
                        See how the magic happens - the unglamorous reality
                        behind the scenes.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <h4 className="text-red-400 font-mono text-xs mb-2">
                        WHAT I USED
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Free editing software trial
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Stock footage from YouTube
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Overheating laptop
                        </li>
                      </ul>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                      <h4 className="text-red-400 font-mono text-xs mb-2">
                        WHAT I LEARNED
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Less is more with effects
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Story &gt; flashy transitions
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Always back up projects
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      My Journey
                    </h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-red-500/50 to-transparent"></div>

                      <div className="space-y-6 pl-10">
                        {[
                          {
                            date: "2024",
                            title: "First Edit",
                            description: "Discovered lens flares",
                          },
                          {
                            date: "2024",
                            title: "First Client",
                            description: "$20 birthday video",
                          },
                          {
                            date: "2024",
                            title: "Color Grading",
                            description: "Orange/teal phase",
                          },
                          {
                            date: "2024",
                            title: "First Wedding",
                            description: "Learned backups",
                          },
                          {
                            date: "Now",
                            title: "Present",
                            description: "Cinematic storytelling",
                          },
                        ].map((item, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                            <h4 className="text-white font-medium">
                              {item.title}
                              <span className="text-white/50 text-sm ml-2">
                                {item.date}
                              </span>
                            </h4>
                            <p className="text-white/60 text-sm mt-1">
                              {item.description}
                            </p>
                          </div>
                        ))}
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
