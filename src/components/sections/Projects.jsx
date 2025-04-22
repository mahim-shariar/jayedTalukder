import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Music Video Edit",
    client: "Independent Artist",
    image: "/assets/projects/music-edit.jpg",
    tools: ["Premiere Pro", "After Effects", "Red Giant"],
    challenges: "Syncing complex cuts with fast-paced music",
    outcome: "Viral video with 2M+ views, artist's most popular release",
    testimonial:
      "Jayed took my rough footage and turned it into something magical. His sense of rhythm in editing is unmatched.",
    bts: "/assets/bts/music-edit-bts.mp4",
  },
  {
    id: 2,
    title: "Corporate Promo",
    client: "Tech Startup",
    image: "/assets/projects/corporate-edit.jpg",
    tools: ["DaVinci Resolve", "Motion Graphics", "Color Grading"],
    challenges: "Making technical content visually engaging",
    outcome: "Used as flagship marketing material for investor pitches",
    testimonial:
      "We gave Jayed boring screen recordings and he returned a Hollywood-style trailer. Investors loved it.",
    bts: "/assets/bts/corporate-bts.mp4",
  },
  {
    id: 3,
    title: "Social Media Series",
    client: "Fashion Brand",
    image: "/assets/projects/social-series.jpg",
    tools: ["After Effects", "Dynamic Link", "Auto Reframe"],
    challenges: "Creating 9:16 vertical edits from horizontal footage",
    outcome: "300% increase in engagement across platforms",
    testimonial:
      "Jayed understands the algorithm better than our social team. His edits consistently outperform others.",
    bts: "/assets/bts/social-bts.mp4",
  },
  {
    id: 4,
    title: "Documentary Edit",
    client: "Nonprofit Organization",
    image: "/assets/projects/doc-edit.jpg",
    tools: ["Premiere Pro", "Audition", "Lumetri Color"],
    challenges: "Weaving 40+ hours of footage into cohesive narrative",
    outcome: "Screened at 5 film festivals, won Best Editing award",
    testimonial:
      "The way Jayed found the heart of our story in all that footage was nothing short of genius.",
    bts: "/assets/bts/doc-edit-bts.mp4",
  },
  {
    id: 5,
    title: "Motion Graphics Reel",
    client: "Design Studio",
    image: "/assets/projects/motion-reel.jpg",
    tools: ["After Effects", "Element 3D", "Trapcode Suite"],
    challenges: "Creating seamless transitions between diverse projects",
    outcome: "Client reported 50% increase in project inquiries",
    testimonial:
      "Jayed's motion work makes our designs come alive in ways we never imagined.",
    bts: "/assets/bts/motion-bts.mp4",
  },
  {
    id: 6,
    title: "Trailer Edit",
    client: "Film Festival",
    image: "/assets/projects/trailer-edit.jpg",
    tools: ["Premiere Pro", "Speed Ramping", "Sound Design"],
    challenges: "Condensing 10 films into 90-second highlight reel",
    outcome: "Most shared content in festival history",
    testimonial:
      "Jayed captured the essence of our entire festival in under two minutes. Masterful editing.",
    bts: "/assets/bts/trailer-bts.mp4",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const modalRef = useRef(null);
  const gridRef = useRef(null);

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setSelectedProject(null);
        document.body.style.overflow = "auto";
      },
    });
  };

  return (
    <section className="projects-section min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Dark gradient background matching About page */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Enhanced grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

      {/* Cinematic grain overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-10 pointer-events-none z-10"></div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0,
              scale: 0.5 + Math.random(),
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.1, 0],
              transition: {
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-24 relative z-20">
        {/* Terminal-style header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-4">
            PROJECTS ARCHIVE
          </h2>
          <div className="font-mono text-red-400/80 text-lg">
            <span>Jayed&gt; _ Select a project to explore</span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </div>

        {/* Projects grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="relative overflow-hidden rounded-lg border border-white/10 group cursor-pointer"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
              onClick={() => openModal(project)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Project image with hover effect */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Project info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm">{project.client}</p>
                </div>

                {/* Tools badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.tools.slice(0, 2).join(" + ")}
                  {project.tools.length > 2 && "..."}
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 via-transparent to-blue-500/10 blur-lg rounded-lg"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Film strip borders */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#1a1a1a] border-b border-white/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a1a1a] border-t border-white/10"></div>

          {/* Modal content */}
          <motion.div
            ref={modalRef}
            className="relative z-10 max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0f0f0f] to-black border border-white/10 rounded-lg shadow-2xl shadow-red-900/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-colors z-30"
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

            {/* Modal content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left column - Media */}
              <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
                {/* BTS Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={selectedProject.bts} type="video/mp4" />
                </video>

                {/* Film grain overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>

                {/* Project title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="text-red-400 font-mono">EDIT_BREAKDOWN.MP4</p>
                </div>
              </div>

              {/* Right column - Details */}
              <div className="p-8 lg:p-10 space-y-8">
                {/* Client info */}
                <div>
                  <h3 className="text-sm font-mono text-red-400 mb-2">
                    CLIENT
                  </h3>
                  <p className="text-2xl font-medium">
                    {selectedProject.client}
                  </p>
                </div>

                {/* Tools used */}
                <div>
                  <h3 className="text-sm font-mono text-red-400 mb-2">
                    SOFTWARE_USED
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black/30 border border-white/10 rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Editing Challenges */}
                <div>
                  <h3 className="text-sm font-mono text-red-400 mb-2">
                    EDITING_CHALLENGES
                  </h3>
                  <p className="text-white/90">{selectedProject.challenges}</p>
                </div>

                {/* Final Result */}
                <div>
                  <h3 className="text-sm font-mono text-red-400 mb-2">
                    FINAL_RESULT
                  </h3>
                  <p className="text-white/90">{selectedProject.outcome}</p>
                </div>

                {/* Testimonial (if exists) */}
                {selectedProject.testimonial && (
                  <div className="p-6 bg-black/20 border border-white/10 rounded-lg relative">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="italic text-white/80">
                      "{selectedProject.testimonial}"
                    </p>
                  </div>
                )}

                {/* View project button */}
                <button className="mt-6 px-6 py-3 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 flex items-center group w-full justify-center">
                  <span>VIEW FINAL EDIT</span>
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

            {/* Film reel corner decorations */}
            <div className="absolute top-8 left-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/10 rounded-full opacity-30"></div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .projects-section {
          scrollbar-width: thin;
          scrollbar-color: #f43f5e #0f0f0f;
        }
        .projects-section::-webkit-scrollbar {
          width: 8px;
        }
        .projects-section::-webkit-scrollbar-track {
          background: #0f0f0f;
          border-left: 1px solid #ffffff10;
        }
        .projects-section::-webkit-scrollbar-thumb {
          background-color: #f43f5e;
          border-radius: 4px;
          border: 1px solid #ffffff20;
          background-clip: padding-box;
        }
        .projects-section::-webkit-scrollbar-thumb:hover {
          background-color: #e11d48;
        }
      `}</style>
    </section>
  );
}
