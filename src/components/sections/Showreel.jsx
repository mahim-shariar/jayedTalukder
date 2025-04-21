import { useState, useRef, useEffect } from "react";
import {
  FiPlay,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilm,
  FiSliders,
} from "react-icons/fi";
import {
  FaHeart,
  FaMoneyBillWave,
  FaGlobeAmericas,
  FaAward,
} from "react-icons/fa";

const Showreel = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showComparison, setShowComparison] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRefs = useRef({});
  const sectionRef = useRef();
  const projectCardsRef = useRef([]);

  // Enhanced categories with consistent color palettes
  const categories = [
    {
      id: "all",
      name: "All Projects",
      icon: <FiFilm className="text-lg" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      textColor: "text-purple-400",
      accentColor: "#8b5cf6", // Purple
    },
    {
      id: "wedding",
      name: "Wedding Films",
      icon: <FaHeart className="text-lg" />,
      color: "from-rose-500 to-red-500",
      bgColor: "bg-gradient-to-r from-rose-500/10 to-red-500/10",
      textColor: "text-rose-400",
      accentColor: "#f43f5e", // Rose
    },
    {
      id: "commercial",
      name: "Commercial",
      icon: <FaMoneyBillWave className="text-lg" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
      textColor: "text-blue-400",
      accentColor: "#3b82f6", // Blue
    },
    {
      id: "travel",
      name: "Travel",
      icon: <FaGlobeAmericas className="text-lg" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      textColor: "text-emerald-400",
      accentColor: "#10b981", // Emerald
    },
    {
      id: "shortfilm",
      name: "Short Films",
      icon: <FaAward className="text-lg" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      textColor: "text-amber-400",
      accentColor: "#f59e0b", // Amber
    },
  ];

  // Sample projects data with colors matching their categories
  const projects = [
    {
      id: 1,
      title: "Mountain Elopement",
      category: "wedding",
      video: "/reels/wedding-1.mp4",
      thumbnail: "/thumbnails/wedding-1.jpg",
      before: "/before/wedding-1.jpg",
      after: "/after/wedding-1.jpg",
      color: categories.find((c) => c.id === "wedding")?.accentColor,
      tags: ["Romantic", "Cinematic", "4K"],
    },
    {
      id: 2,
      title: "Cityscape Commercial",
      category: "commercial",
      video: "/reels/commercial-1.mp4",
      thumbnail: "/thumbnails/commercial-1.jpg",
      before: "/before/commercial-1.jpg",
      after: "/after/commercial-1.jpg",
      color: categories.find((c) => c.id === "commercial")?.accentColor,
      tags: ["Dynamic", "Product", "Drone"],
    },
    {
      id: 3,
      title: "Tropical Getaway",
      category: "travel",
      video: "/reels/travel-1.mp4",
      thumbnail: "/thumbnails/travel-1.jpg",
      before: "/before/travel-1.jpg",
      after: "/after/travel-1.jpg",
      color: categories.find((c) => c.id === "travel")?.accentColor,
      tags: ["Adventure", "Scenic", "4K"],
    },
    {
      id: 4,
      title: "Artistic Short",
      category: "shortfilm",
      video: "/reels/shortfilm-1.mp4",
      thumbnail: "/thumbnails/shortfilm-1.jpg",
      before: "/before/shortfilm-1.jpg",
      after: "/after/shortfilm-1.jpg",
      color: categories.find((c) => c.id === "shortfilm")?.accentColor,
      tags: ["Experimental", "Narrative", "Award-winning"],
    },
  ];

  // Filter projects
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const playVideo = (project) => {
    setCurrentVideo(project);
    setIsPlaying(true);

    // Play video after modal is opened
    setTimeout(() => {
      if (videoRefs.current[project.id]) {
        videoRefs.current[project.id].currentTime = 0;
        videoRefs.current[project.id].play().catch((e) => {
          console.error("Video play failed:", e);
          // Fallback for browsers that block autoplay
          videoRefs.current[project.id].muted = true;
          videoRefs.current[project.id].play();
        });
      }
    }, 100);
  };

  const closeVideo = () => {
    if (currentVideo && videoRefs.current[currentVideo.id]) {
      videoRefs.current[currentVideo.id].pause();
    }
    setIsPlaying(false);
    setCurrentVideo(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      projectCardsRef.current.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;

        if (isVisible) {
          card.classList.add("animate-fade-up");
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredProjects]);

  return (
    <section
      ref={sectionRef}
      className="showreel-section py-20 bg-gray-950 relative overflow-hidden"
      id="showreel"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a]"></div>
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div
          className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-red-500/10 blur-[100px] animate-move-x"
          style={{ animationDuration: "15s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] animate-move-y"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 15}s linear infinite`,
              transform: `scale(${0.5 + Math.random() * 3})`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-6 md:mb-0 animate-fade-in">
            <FiFilm className="inline mr-3 -mt-2" />
            SHOW<span className="text-white">REEL</span>
          </h2>
          <div className="w-24 h-24 flex items-center justify-center animate-spin-slow">
            <svg className="w-full h-full text-red-500" viewBox="0 0 24 24">
              {/* Film reel icon */}
            </svg>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-16">
          <div className="categories-container flex flex-col items-center">
            {/* Category Selector */}
            <div className="mb-16">
              <div className="categories-container flex flex-col items-center">
                <div
                  className={`w-full bg-gray-500/10 max-w-md mb-6 p-4 rounded-xl border border-white/10 transition-all duration-500 animate-fade-in`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r from-rose-500 to-red-500 shadow-lg`}
                    >
                      {categories.find((c) => c.id === activeCategory)?.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {categories.find((c) => c.id === activeCategory)?.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex overflow-x-auto pb-2 scrollbar-hide w-full justify-center">
                  <div className="flex space-x-2 bg-gray-900/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-5 py-2 rounded-full flex items-center whitespace-nowrap transition-all duration-300 ${
                          activeCategory === category.id
                            ? `bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg`
                            : `text-white/70 hover:text-white bg-transparent hover:bg-white/5`
                        }`}
                      >
                        <span
                          className={`mr-2 ${
                            activeCategory === category.id
                              ? "text-white"
                              : "text-rose-400"
                          }`}
                        >
                          {category.icon}
                        </span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const category = categories.find((c) => c.id === project.category);
            return (
              <div
                key={project.id}
                ref={(el) => (projectCardsRef.current[index] = el)}
                className="project-card group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 opacity-0 translate-y-10"
                style={{
                  boxShadow:
                    hoveredProject === String(project.id)
                      ? `0 0 30px ${project.color}30`
                      : "none",
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => setHoveredProject(String(project.id))}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Thumbnail with Play Button */}
                <div className="thumbnail-container relative h-80 overflow-hidden transition-transform duration-500 group-hover:scale-103">
                  <div
                    className="thumbnail w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => playVideo(project)}
                        className="play-icon opacity-70 scale-80 group-hover:scale-120 group-hover:opacity-100 bg-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-300"
                      >
                        <FiPlay className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="project-tags absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/10"
                        style={{ color: project.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Color Accent */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: project.color }}
                  ></div>
                </div>

                {/* Project Info */}
                <div className="project-info p-6 bg-gradient-to-b from-gray-900/90 to-gray-900/80 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-2.5">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm uppercase tracking-wider font-medium"
                      style={{ color: project.color }}
                    >
                      {category?.name}
                    </span>
                    <button
                      onClick={() =>
                        setShowComparison(
                          project.id === showComparison ? null : project.id
                        )
                      }
                      className="text-xs flex items-center text-white/60 hover:text-white transition-colors"
                    >
                      <FiSliders className="mr-1" />
                      Compare
                    </button>
                  </div>
                </div>

                {/* Before/After Comparison */}
                {showComparison === project.id && (
                  <div className="absolute inset-0 bg-black z-10 p-4">
                    {/* Comparison slider implementation */}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-fade-in">
          <button className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 rounded-full hover:bg-red-500/10 transition-all transform hover:scale-105 flex items-center mx-auto group relative overflow-hidden">
            <span className="relative z-10">View Full Portfolio</span>
            <FiChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && currentVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              ref={(el) => (videoRefs.current[currentVideo.id] = el)}
              className="w-full"
              controls
              autoPlay
              muted={false}
            >
              <source src={currentVideo.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <button
              onClick={closeVideo}
              className="absolute top-4 left-4 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-colors"
            >
              <FiX className="w-4 h-4 text-white" />
            </button>

            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm font-mono z-20">
              {currentVideo.title}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        @keyframes move-x {
          0% {
            transform: translateX(-50%) translateY(-50%);
          }
          50% {
            transform: translateX(50%) translateY(0%);
          }
          100% {
            transform: translateX(-50%) translateY(-50%);
          }
        }
        @keyframes move-y {
          0% {
            transform: translateX(50%) translateY(50%);
          }
          50% {
            transform: translateX(0%) translateY(0%);
          }
          100% {
            transform: translateX(50%) translateY(50%);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-move-x {
          animation: move-x linear infinite;
        }
        .animate-move-y {
          animation: move-y linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Showreel;
