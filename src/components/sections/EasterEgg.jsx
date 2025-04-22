import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function EasterEgg() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const lockRef = useRef(null);
  const eggRef = useRef(null);
  const riddleRef = useRef(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showRiddle, setShowRiddle] = useState(false);
  const [activeTab, setActiveTab] = useState("first-edit");
  const [currentHint, setCurrentHint] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
          unlockEgg();
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
    </div>
  );
}
