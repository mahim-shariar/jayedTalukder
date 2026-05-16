import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiX,
  FiFilm,
  FiGrid,
  FiBox,
  FiArrowLeft,
  FiShare2,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  getVideoReels,
  getVideoReelsByCategory,
  getVisibleCategories,
} from "../services/api";
import { shareVideo } from "../utils/shareVideo";

const AllProjects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeLayout, setActiveLayout] = useState("fluid");
  const [copiedId, setCopiedId] = useState(null);
  const videoRefs = useRef({});
  const hoverVideoRefs = useRef({});
  const navigate = useNavigate();

  // Categories to exclude
  const excludedCategories = [
    "myFirstEdit",
    "bloopers",
    "behindTheScenes",
    "mySelfIntro",
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const gridCardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
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
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    hover: {
      x: 20,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const fluidCardVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Fetch videos from API
  const fetchVideos = async (category = "all") => {
    try {
      setLoading(true);
      let response;

      if (category === "all") {
        response = await getVideoReels();
      } else {
        response = await getVideoReelsByCategory(category);
      }

      // Filter out excluded categories
      const videos = response.data.videoReels
        .filter((video) => !excludedCategories.includes(video.category))
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

  // Fetch visible categories from API
  const fetchVisibleCategories = async () => {
    try {
      const response = await getVisibleCategories();
      // Add "All Projects" as the first category
      const visibleCategories = [
        {
          id: "all",
          name: "All Projects",
          icon: <FiFilm className="inline mr-2" />,
        },
        ...response.data.categories.map((category) => ({
          id: category.slug,
          name: category.name,
          icon: <FiFilm className="inline mr-2" />,
        })),
      ];
      setCategories(visibleCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to just "All Projects" if API fails
      setCategories([
        {
          id: "all",
          name: "All Projects",
          icon: <FiFilm className="inline mr-2" />,
        },
      ]);
    }
  };

  // Initial load and category change handler
  useEffect(() => {
    fetchVisibleCategories();
    fetchVideos(activeCategory);
  }, [activeCategory]);

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

  // Format category name for display
  const formatCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category
      ? category.name
      : categoryId
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShareClick = async (e, project) => {
    e.stopPropagation();
    const result = await shareVideo(project.id, project.title);
    if (result.ok) {
      setCopiedId(project.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Render projects based on active layout
  const renderProjects = () => {
    if (activeLayout === "stack") {
      return (
        <motion.div
          className="projects-stack flex flex-col gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-xl overflow-hidden cursor-pointer"
              variants={stackCardVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              onHoverStart={() => handleVideoHover(project)}
              onHoverEnd={() => handleVideoHoverEnd(project)}
              onClick={() => playVideo(project)}
            >
              <div className="flex h-48 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5 backdrop-blur-sm">
                <div className="thumbnail-container relative w-1/3 overflow-hidden">
                  {/* Thumbnail fallback */}
                  <div
                    className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.thumbnail})`,
                      opacity: hoveredCard === project.id ? 0 : 1,
                      transition: "opacity 0.3s ease",
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
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FiPlay className="text-3xl text-white" />
                  </div>
                </div>

                <div className="project-info p-5 flex-1 flex flex-col justify-center relative">
                  <button
                    onClick={(e) => handleShareClick(e, project)}
                    className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-sm border border-white/10 text-[11px] text-white transition"
                    title="Copy share link"
                  >
                    {copiedId === project.id ? (
                      <>
                        <FiCheck className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FiShare2 className="w-3 h-3" />
                        Share
                      </>
                    )}
                  </button>
                  <div className="flex justify-between items-start mb-3 pr-20">
                    <h3 className="text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <span
                      className="text-xs uppercase tracking-wider font-medium px-2 py-1 rounded-full bg-black/30 border border-white/10"
                      style={{
                        color: project.color,
                        backgroundColor: `${project.color}20`, // Add slight tint of the color
                      }}
                    >
                      {formatCategoryName(project.category)}
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
          className="projects-fluid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-xl overflow-hidden cursor-pointer"
              variants={fluidCardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              onHoverStart={() => handleVideoHover(project)}
              onHoverEnd={() => handleVideoHoverEnd(project)}
              onClick={() => playVideo(project)}
            >
              <div className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm">
                <div className="thumbnail-container relative w-full h-full overflow-hidden">
                  {/* Thumbnail fallback */}
                  <div
                    className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.thumbnail})`,
                      opacity: hoveredCard === project.id ? 0 : 1,
                      transition: "opacity 0.3s ease",
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
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                  {/* Category badge - positioned at top left */}
                  <div
                    className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/10"
                    style={{
                      color: project.color,
                      backgroundColor: `${project.color}20`,
                    }}
                  >
                    {formatCategoryName(project.category)}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                    <button
                      onClick={(e) => handleShareClick(e, project)}
                      className="bg-black/60 hover:bg-red-500/80 backdrop-blur-sm border border-white/10 w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-white transition"
                      title="Copy share link"
                    >
                      {copiedId === project.id ? (
                        <FiCheck className="text-sm" />
                      ) : (
                        <FiShare2 className="text-sm" />
                      )}
                    </button>
                    <div className="bg-red-500 w-9 h-9 rounded-full flex items-center justify-center shadow-lg">
                      <FiPlay className="text-sm text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-sm font-bold text-white truncate">
                      {project.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
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
        className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="project-card group relative rounded-xl overflow-hidden cursor-pointer"
            variants={gridCardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-50px" }}
            custom={i}
            onHoverStart={() => handleVideoHover(project)}
            onHoverEnd={() => handleVideoHoverEnd(project)}
            onClick={() => playVideo(project)}
          >
            <motion.div
              className="relative h-full w-full rounded-xl overflow-hidden border border-white/5 bg-gray-900/30 backdrop-blur-sm"
              initial={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
              whileHover={{
                boxShadow: "0 8px 32px rgba(239, 68, 68, 0.2)",
                backgroundColor: "rgba(30, 30, 30, 0.5)",
                transition: { duration: 0.6 },
              }}
            >
              <div className="thumbnail-container relative h-72 overflow-hidden">
                {/* Thumbnail fallback */}
                <div
                  className="thumbnail w-full h-full bg-cover bg-center absolute inset-0"
                  style={{
                    backgroundImage: `url(${project.thumbnail})`,
                    opacity: hoveredCard === project.id ? 0 : 1,
                    transition: "opacity 0.3s ease",
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
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <source src={project.video} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Category badge - positioned at top left */}
                <div
                  className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 z-10"
                  style={{
                    color: project.color,
                    backgroundColor: `${project.color}20`,
                  }}
                >
                  {formatCategoryName(project.category)}
                </div>

                <div
                  className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-mono border border-white/5"
                  style={{ color: project.color }}
                >
                  {project.year}
                </div>

                <button
                  onClick={(e) => handleShareClick(e, project)}
                  className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-red-500/80 backdrop-blur-sm border border-white/10 text-xs text-white transition"
                  title="Copy share link"
                >
                  {copiedId === project.id ? (
                    <>
                      <FiCheck className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FiShare2 className="w-3 h-3" />
                      Share
                    </>
                  )}
                </button>

                <div className="absolute inset-0 m-auto bg-red-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiPlay className="text-xl text-white ml-1" />
                </div>
              </div>

              <motion.div
                className="project-info p-5 bg-gradient-to-b from-gray-900/70 to-gray-900/50"
                initial={{ y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex justify-start items-start mb-2">
                  <h3 className="text-lg font-medium text-white">
                    {project.title}
                  </h3>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{project.year}</span>

                  <div className="flex gap-1.5">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/5"
                        style={{ color: project.color }}
                      >
                        {tag}
                      </span>
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
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
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
    <section className="all-projects-section py-28  bg-gray-950 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with back button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-full bg-gray-800/50 text-white/80 hover:bg-gray-700/30 backdrop-blur-sm border border-white/5 hover:border-red-500/20 transition-all"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              ALL <span className="text-white">PROJECTS</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <button
              onClick={() => setActiveLayout("grid")}
              className={`p-2 rounded-lg ${
                activeLayout === "grid"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveLayout("stack")}
              className={`p-2 rounded-lg ${
                activeLayout === "stack"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
            >
              <FiBox className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveLayout("fluid")}
              className={`p-2 rounded-lg ${
                activeLayout === "fluid"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-800/50 text-gray-400"
              }`}
            >
              <FiFilm className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category tabs - Enhanced with better styling */}
        <div className="categories-container mb-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white/90 mb-3">
              Browse by Category
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our collection of video projects organized by category
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-tab px-5 py-3 rounded-xl flex items-center transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-red-500/90 to-red-600/90 text-white shadow-lg shadow-red-500/30 border border-red-400/30"
                    : "bg-gray-800/30 text-white/80 hover:bg-gray-700/40 backdrop-blur-sm border border-white/10 hover:border-red-500/30 hover:shadow-md hover:shadow-red-500/10"
                }`}
              >
                <span className="mr-2 text-sm">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length > 0 ? (
          renderProjects()
        ) : (
          <div className="text-center py-20 text-white/70">
            No videos found in this category
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && currentVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
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

                <button
                  onClick={closeVideo}
                  className="absolute top-4 left-4 bg-red-500/90 w-9 h-9 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-all"
                >
                  <FiX className="w-4 h-4 text-white" />
                </button>

                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 rounded text-sm font-medium z-20 border-l-2 border-red-500">
                  <div className="text-white">{currentVideo.title}</div>
                  <div
                    className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block border border-white/10"
                    style={{
                      color: currentVideo.color,
                      backgroundColor: `${currentVideo.color}20`,
                    }}
                  >
                    {formatCategoryName(currentVideo.category)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AllProjects;
