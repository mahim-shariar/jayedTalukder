import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiX,
  FiChevronRight,
  FiFilm,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaHeart,
  FaMoneyBillWave,
  FaGlobeAmericas,
  FaAward,
  FaMosque,
  FaPodcast,
} from "react-icons/fa";
import { getVideoReels, getVideoReelsByCategory } from "../../services/api";

const Showreel = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const videoRefs = useRef({});

  // Categories with React Icons
  const categories = [
    {
      id: "all",
      name: "All Projects",
      icon: <FiFilm className="inline mr-2" />,
    },
    {
      id: "wedding",
      name: "Wedding Films",
      icon: <FaHeart className="inline mr-2" />,
    },
    {
      id: "commercial",
      name: "Commercial",
      icon: <FaMoneyBillWave className="inline mr-2" />,
    },
    {
      id: "travel",
      name: "Travel",
      icon: <FaGlobeAmericas className="inline mr-2" />,
    },
    {
      id: "shortfilm",
      name: "Short Films",
      icon: <FaAward className="inline mr-2" />,
    },
    {
      id: "islamic",
      name: "Islamic",
      icon: <FaMosque className="inline mr-2" />,
    },
    {
      id: "podcast",
      name: "Podcast",
      icon: <FaPodcast className="inline mr-2" />,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const cardVariants = {
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

  const thumbnailVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.8,
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

      const videos = response.data.videoReels.map((video) => ({
        id: video._id,
        title: video.title,
        category: video.category,
        video: video.videoUrl,
        thumbnail: video.thumbnailUrl || "/default-thumbnail.jpg",
        color: getRandomColor(),
        tags: video.tags || [],
        year: new Date(video.createdAt).getFullYear().toString(),
        description: video.description || "",
      }));

      setProjects(videos);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and category change handler
  useEffect(() => {
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

  return (
    <section
      className="showreel-section py-24 bg-gray-950 relative overflow-hidden"
      id="showreel"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6 md:mb-0">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              SHOW<span className="text-white">REEL</span>
            </motion.span>
          </h2>

          <motion.div
            className="w-20 h-20 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100,
              mass: 0.5,
              delay: 0.4,
            }}
            whileHover={{ rotate: 15, scale: 1.05 }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500/20"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <FiFilm className="absolute inset-0 m-auto w-6 h-6 text-red-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="categories-container flex overflow-x-auto pb-10 mb-14 scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex space-x-3 mx-auto">
            {categories.map((category, i) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-tab px-5 py-2.5 rounded-full flex items-center whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-red-500/90 to-red-600/90 text-white shadow-lg shadow-red-500/20"
                    : "bg-gray-800/20 text-white/80 hover:bg-gray-700/30 backdrop-blur-sm border border-white/5 hover:border-red-500/20"
                }`}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.1,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length > 0 ? (
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
                className="project-card group relative rounded-xl overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                onHoverStart={() => setHoveredCard(project.id)}
                onHoverEnd={() => setHoveredCard(null)}
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
                  <motion.div
                    className="thumbnail-container relative h-72 overflow-hidden"
                    variants={thumbnailVariants}
                    whileHover="hover"
                  >
                    <div
                      className="thumbnail w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${project.thumbnail})`,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-80"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.8 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    <motion.div
                      className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-mono border border-white/5"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.2 + i * 0.05,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ color: project.color }}
                    >
                      {project.year}
                    </motion.div>

                    <motion.button
                      onClick={() => playVideo(project)}
                      className="absolute inset-0 m-auto bg-red-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 0 8px rgba(239, 68, 68, 0.2)",
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      }}
                      whileInView={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                          delay: 0.3 + i * 0.1,
                          duration: 0.6,
                        },
                      }}
                    >
                      <FiPlay className="text-xl text-white ml-1" />
                    </motion.button>
                  </motion.div>

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
                      <span
                        className="text-xs uppercase tracking-wider font-medium"
                        style={{ color: project.color }}
                      >
                        {
                          categories.find((c) => c.id === project.category)
                            ?.name
                        }
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
                              delay: 0.3 + index * 0.1,
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
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
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-white/70">
            No videos found in this category
          </div>
        )}

        {/* View all button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
        >
          <motion.button
            className="px-8 py-3.5 bg-transparent border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 transition-all flex items-center mx-auto group relative overflow-hidden"
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(239, 68, 68, 0.5)",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              transition: { duration: 0.6 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 font-medium tracking-wider text-sm">
              VIEW FULL PORTFOLIO
            </span>
            <motion.span
              className="relative z-10 ml-3"
              whileHover={{ x: 4 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <FiChevronRight className="w-4 h-4" />
            </motion.span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              className="relative w-full max-w-5xl rounded-lg overflow-hidden border border-white/10 bg-gray-900/80 backdrop-blur-md"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                mass: 0.5,
              }}
            >
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

              <motion.button
                onClick={closeVideo}
                className="absolute top-4 left-4 bg-red-500/90 w-9 h-9 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-all"
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <FiX className="w-4 h-4 text-white" />
              </motion.button>

              <motion.div
                className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 rounded text-sm font-medium z-20 border-l-2 border-red-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="text-white">{currentVideo.title}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Showreel;
