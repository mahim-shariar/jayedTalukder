import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
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
  ];

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Mountain Elopement",
      category: "wedding",
      video: "/reels/wedding-1.mp4",
      thumbnail: "/thumbnails/wedding-1.jpg",
      before: "/before/wedding-1.jpg",
      after: "/after/wedding-1.jpg",
      color: "#f43f5e",
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
      color: "#3b82f6",
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
      color: "#10b981",
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
      color: "#8b5cf6",
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

    setTimeout(() => {
      if (videoRefs.current[project.id]) {
        videoRefs.current[project.id].currentTime = 0;
        const playPromise = videoRefs.current[project.id].play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Video play failed:", error);
          });
        }
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

  const handleComparisonSliderChange = (e, projectId) => {
    const value = e.target.value;
    const afterElement = document.querySelector(
      `.comparison-after[data-project-id="${projectId}"]`
    );
    if (afterElement) {
      afterElement.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 },
    },
  };

  const filmReelVariants = {
    hidden: { rotate: -360, opacity: 0 },
    visible: {
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        mass: 1.5,
      },
    },
  };

  const playButtonVariants = {
    initial: { scale: 0.8, opacity: 0.7 },
    hover: { scale: 1.1, opacity: 1, transition: { duration: 0.3 } },
  };

  const infoVariants = {
    initial: { y: 0 },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  const tagsVariants = {
    initial: { opacity: 0, y: 10 },
    hover: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      className="showreel-section py-20 bg-gray-950 relative overflow-hidden"
      id="showreel"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a]"></div>
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-repeat opacity-10"></div>

        {/* Moving gradient lights */}
        <motion.div
          className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-red-500/10 blur-[100px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px]"
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              scale: `${0.5 + Math.random() * 3}`,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [
                0,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
              ],
              opacity: [0.2, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 15,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with film reel animation */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-6 md:mb-0"
            variants={itemVariants}
          >
            <FiFilm className="inline mr-3 -mt-2" />
            SHOW<span className="text-white">REEL</span>
          </motion.h2>

          <motion.div
            className="w-24 h-24 flex items-center justify-center"
            variants={filmReelVariants}
            whileHover={{ rotate: 45 }}
          >
            <svg
              className="w-full h-full text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="24" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <line x1="12" y1="22" x2="12" y2="19" />
              <line x1="12" y1="5" x2="12" y2="2" />
              <line x1="22" y1="12" x2="19" y2="12" />
              <line x1="5" y1="12" x2="2" y2="12" />
              <line x1="19.07" y1="19.07" x2="16.95" y2="16.95" />
              <line x1="7.05" y1="7.05" x2="4.93" y2="4.93" />
              <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" />
              <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="categories-container flex overflow-x-auto pb-6 mb-12 scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex space-x-2 mx-auto">
            {categories.map((category, i) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-tab px-6 py-3 rounded-full flex items-center whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-gray-800/50 text-white/80 hover:bg-gray-700/50 backdrop-blur-sm border border-white/10 hover:border-red-500/30"
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                custom={i}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 bg-gray-900/30 backdrop-blur-sm"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
            >
              {/* Thumbnail */}
              <div className="thumbnail-container relative h-80 overflow-hidden">
                <div
                  className="thumbnail w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${project.thumbnail})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      onClick={() => playVideo(project)}
                      className=" bg-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                      variants={playButtonVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <FiPlay className="text-2xl text-white ml-1" />
                    </motion.button>
                  </div>
                </div>

                {/* Project tags */}
                <motion.div
                  className="project-tags absolute top-4 left-4 flex flex-wrap gap-2"
                  variants={tagsVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/10"
                      style={{ color: project.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Project color accent */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: project.color }}
                />
              </div>

              {/* Project info */}
              <motion.div
                className="project-info p-6 bg-gradient-to-b from-gray-900/90 to-gray-900/80 backdrop-blur-sm"
                variants={infoVariants}
                initial="initial"
                whileHover="hover"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm uppercase tracking-wider font-medium"
                    style={{ color: project.color }}
                  >
                    {categories.find((c) => c.id === project.category)?.name}
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
              </motion.div>

              {/* Before/After comparison */}
              <AnimatePresence>
                {showComparison === project.id && (
                  <motion.div
                    className="absolute inset-0 bg-black z-10 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-full h-full">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${project.before})` }}
                      />
                      <div
                        className="absolute inset-0 bg-cover bg-center comparison-after"
                        data-project-id={project.id}
                        style={{
                          backgroundImage: `url(${project.after})`,
                          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                        onChange={(e) =>
                          handleComparisonSliderChange(e, project.id)
                        }
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-sm flex items-center">
                        <FiChevronLeft className="mr-1" />
                        <span>Slide</span>
                        <FiChevronRight className="ml-1" />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowComparison(null)}
                      className="absolute top-4 right-4 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 rounded-full hover:bg-red-500/10 transition-all flex items-center mx-auto group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View Full Portfolio</span>
            <motion.span
              className="relative z-10"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <FiChevronRight className="w-5 h-5 ml-2" />
            </motion.span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && currentVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
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

              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-900/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-900/50" />
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-900/50" />
              </div>

              <button
                onClick={closeVideo}
                className="absolute top-4 left-4 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center z-30 hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4 text-white" />
              </button>

              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-sm font-mono z-20">
                {currentVideo.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Showreel;
