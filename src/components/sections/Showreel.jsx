import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiX,
  FiChevronRight,
  FiFilm,
  FiGrid,
  FiBox,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getVideoReels } from "../../services/api";

const Showreel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [activeLayout, setActiveLayout] = useState("fluid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);
  const videoRefs = useRef({});
  const hoverVideoRefs = useRef({});
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // Categories to exclude
  const excludedCategories = [
    "myFirstEdit",
    "bloopers",
    "behindTheScenes",
    "mySelfIntro",
  ];

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Intersection Observer for smoother entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animation variants with smoother settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
        duration: 0.9,
      },
    },
  };

  const gridCardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.96 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const stackCardVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hover: {
      x: 20,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const fluidCardVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getVideoReels({ isBest: true });

      // Filter out excluded categories and limit to 6 projects
      const videos = response.data.videoReels
        .filter((video) => !excludedCategories.includes(video.category))
        .slice(0, 6)
        .map((video, index) => ({
          id: video._id,
          title: video.title,
          category: video.category,
          video: video.videoUrl,
          thumbnail: video.thumbnailUrl || "/default-thumbnail.jpg",
          color: getRandomColor(),
          tags: video.tags || [],
          year: new Date(video.createdAt).getFullYear().toString(),
          description: video.description || "",
          index: index,
        }));

      setProjects(videos);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVideos();
  }, []);

  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = [
      "#f43f5e", // rose-500
      "#3b82f6", // blue-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle video hover - play video silently
  const handleVideoHover = (project) => {
    setHoveredCard(project.id);

    if (hoverVideoRefs.current[project.id]) {
      hoverVideoRefs.current[project.id].currentTime = 0;
      hoverVideoRefs.current[project.id].play().catch((error) => {
        console.error("Hover video play failed:", error);
      });
    }
  };

  // Handle video hover end - pause video
  const handleVideoHoverEnd = (project) => {
    setHoveredCard(null);

    if (hoverVideoRefs.current[project.id]) {
      hoverVideoRefs.current[project.id].pause();
    }
  };

  // Play video in modal
  const playVideo = (project) => {
    setCurrentVideo(project);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRefs.current[project.id]) {
        videoRefs.current[project.id].currentTime = 0;
        videoRefs.current[project.id]
          .play()
          .catch((error) => console.error("Video play failed:", error));
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

  const handleViewPortfolio = () => {
    navigate("/projects");
  };

  // Calculate parallax effect based on mouse position
  const calculateParallax = (index, intensity = 6) => {
    const x = mousePosition.x * intensity * (index % 2 === 0 ? 1 : -1);
    const y = mousePosition.y * intensity * (index % 2 === 0 ? 1 : -1);
    return { x, y };
  };

  // Render projects based on active layout
  const renderProjects = () => {
    if (activeLayout === "stack") {
      return (
        <motion.div
          className="projects-stack flex flex-col gap-6 max-w-4xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-xl overflow-hidden"
              variants={stackCardVariants}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              onHoverStart={() => handleVideoHover(project)}
              onHoverEnd={() => handleVideoHoverEnd(project)}
              onClick={() => playVideo(project)}
              style={{
                transform: `perspective(1000px) rotateY(${
                  calculateParallax(i, 1.5).x
                }deg) rotateX(${calculateParallax(i, 1.5).y}deg)`,
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="flex h-48 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5 backdrop-blur-sm">
                <div className="thumbnail-container relative w-1/3 overflow-hidden">
                  {/* Thumbnail fallback */}
                  <div
                    className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.thumbnail})`,
                      opacity: hoveredCard === project.id ? 0 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                  />

                  {/* Hover video */}
                  <video
                    ref={(el) => (hoverVideoRefs.current[project.id] = el)}
                    className="w-full h-full object-cover absolute inset-0"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{
                      opacity: hoveredCard === project.id ? 1 : 0,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <FiPlay className="text-3xl text-white" />
                  </div>
                </div>

                <div className="project-info p-5 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <span
                      className="text-xs uppercase tracking-wider font-medium px-2 py-1 rounded-full bg-black/30"
                      style={{ color: project.color }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-mono">
                      {project.year}
                    </span>
                    <div className="flex gap-1.5">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/5"
                          style={{ color: project.color }}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 text-gray-400">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    } else if (activeLayout === "fluid") {
      return (
        <motion.div
          className="projects-fluid grid grid-cols-2 md:grid-cols-3 gap-5"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-xl overflow-hidden cursor-pointer"
              variants={fluidCardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              onHoverStart={() => handleVideoHover(project)}
              onHoverEnd={() => handleVideoHoverEnd(project)}
              onClick={() => playVideo(project)}
              style={{
                transform: `perspective(1000px) translateX(${
                  calculateParallax(i, 3).x
                }px) translateY(${calculateParallax(i, 3).y}px)`,
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm">
                <div className="thumbnail-container relative w-full h-full overflow-hidden">
                  {/* Thumbnail fallback */}
                  <div
                    className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.thumbnail})`,
                      opacity: hoveredCard === project.id ? 0 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                  />

                  {/* Hover video */}
                  <video
                    ref={(el) => (hoverVideoRefs.current[project.id] = el)}
                    className="w-full h-full object-cover absolute inset-0"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{
                      opacity: hoveredCard === project.id ? 1 : 0,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                  <div className="absolute top-3 right-3 bg-red-500 w-9 h-9 rounded-full flex items-center justify-center shadow-lg">
                    <FiPlay className="text-sm text-white ml-0.5" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-sm font-bold text-white truncate">
                      {project.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-xs uppercase tracking-wider"
                        style={{ color: project.color }}
                      >
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    // Default grid layout
    return (
      <motion.div
        className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="project-card group relative rounded-xl overflow-hidden cursor-pointer"
            variants={gridCardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            custom={i}
            onHoverStart={() => handleVideoHover(project)}
            onHoverEnd={() => handleVideoHoverEnd(project)}
            onClick={() => playVideo(project)}
            style={{
              transform: `perspective(1000px) rotateY(${
                calculateParallax(i, 2).x
              }deg) rotateX(${calculateParallax(i, 2).y}deg)`,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <motion.div
              className="relative h-full w-full rounded-xl overflow-hidden border border-white/5 bg-gray-900/30 backdrop-blur-sm"
              initial={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
              whileHover={{
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.25)",
                backgroundColor: "rgba(30, 30, 30, 0.5)",
                transition: { duration: 0.6, ease: "easeOut" },
              }}
            >
              <div className="thumbnail-container relative h-72 overflow-hidden">
                {/* Thumbnail fallback */}
                <div
                  className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                  style={{
                    backgroundImage: `url(${project.thumbnail})`,
                    opacity: hoveredCard === project.id ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                />

                {/* Hover video */}
                <video
                  ref={(el) => (hoverVideoRefs.current[project.id] = el)}
                  className="w-full h-full object-cover absolute inset-0"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                    opacity: hoveredCard === project.id ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <source src={project.video} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

                <motion.div
                  className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-mono border border-white/5"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.06,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  style={{ color: project.color }}
                >
                  {project.year}
                </motion.div>

                <div className="absolute inset-0 m-auto bg-red-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <FiPlay className="text-xl text-white ml-1" />
                </div>
              </div>

              <motion.div
                className="project-info p-5 bg-gradient-to-b from-gray-900/70 to-gray-900/50"
                initial={{ y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex justify-start items-start mb-2">
                  <h3 className="text-lg font-medium text-white">
                    {project.title}
                  </h3>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ color: project.color }}
                  >
                    {project.category}
                  </span>

                  <div className="flex gap-1.5">
                    {project.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/5"
                        style={{ color: project.color }}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.25 + index * 0.1,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {hoveredCard === project.id && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"
                  style={{ color: project.color }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="showreel-section py-24 bg-gray-950 relative overflow-hidden"
      id="showreel"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="particles-container absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.25, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
              style={{ top: `${i * 10}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
              style={{ left: `${i * 10}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.15,
          }}
        >
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-red-500 bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-2">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.25,
                }}
              >
                SHOW<span className="text-white">REEL</span>
              </motion.span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Hover to preview, click to view in full screen
            </p>
          </div>

          <motion.div
            className="flex items-center gap-2 mt-6 md:mt-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setActiveLayout("grid")}
              className={`p-2 rounded-lg ${
                activeLayout === "grid"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FiGrid className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setActiveLayout("stack")}
              className={`p-2 rounded-lg ${
                activeLayout === "stack"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FiBox className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setActiveLayout("fluid")}
              className={`p-2 rounded-lg ${
                activeLayout === "fluid"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FiFilm className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <motion.div
                className="absolute inset-0 m-auto w-8 h-8 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        ) : projects.length > 0 ? (
          renderProjects()
        ) : (
          <div className="text-center py-20 text-white/70">No videos found</div>
        )}

        {/* View all button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.15,
          }}
        >
          <motion.button
            onClick={handleViewPortfolio}
            className="px-8 py-3.5 bg-transparent border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 transition-all flex items-center mx-auto group relative overflow-hidden"
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(239, 68, 68, 0.5)",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              transition: { duration: 0.5 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 font-medium tracking-wider text-sm">
              VIEW FULL PORTFOLIO
            </span>
            <motion.span
              className="relative z-10 ml-3"
              whileHover={{ x: 3 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              <FiChevronRight className="w-4 h-4" />
            </motion.span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && currentVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
              initial={{ scale: 0.97, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 15 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                mass: 0.8,
              }}
            >
              {/* Video container with dynamic sizing */}
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={(el) => (videoRefs.current[currentVideo.id] = el)}
                  className="h-full max-h-[80vh] object-contain"
                  controls
                  autoPlay
                  muted={false}
                  playsInline
                >
                  <source src={currentVideo.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <motion.button
                  onClick={closeVideo}
                  className="absolute top-4 left-4 bg-red-500/90 w-9 h-9 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-all"
                  whileHover={{ rotate: 90, scale: 1.05 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                >
                  <FiX className="w-4 h-4 text-white" />
                </motion.button>

                <motion.div
                  className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 rounded text-sm font-medium z-20 border-l-2 border-red-500"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <div className="text-white">{currentVideo.title}</div>
                  <div className="text-xs text-gray-300">
                    {currentVideo.category}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Showreel;
