import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { getReviews } from "../services/api";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("text");
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid", "timeline", "carousel", "masonry"
  const [imageOnlyMode, setImageOnlyMode] = useState(false);

  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const itemsRef = useRef([]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getReviews();
        setTestimonials(response.data.reviews || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load testimonials");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // GSAP animations for marquee
  useEffect(() => {
    if (testimonials.length === 0 || loading) return;

    const ctx = gsap.context(() => {
      // Marquee animation
      const marqueeElements = marqueeRef.current?.children;
      if (!marqueeElements) return;

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" },
      });

      // Calculate total width
      let totalWidth = 0;
      Array.from(marqueeElements).forEach((el) => {
        totalWidth += el.offsetWidth + 40; // 40px for gap
      });

      // Animate marquee
      tl.to(marqueeElements, {
        x: -totalWidth,
        duration: totalWidth / 30,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      // Animate items on load
      gsap.fromTo(
        itemsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonials, loading]);

  const renderStars = (count) => {
    return Array(count)
      .fill()
      .map((_, i) => (
        <motion.svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ));
  };

  // Grid View Component
  const GridView = () => {
    if (imageOnlyMode) {
      // Image-only grid view
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl p-6"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {testimonial.screenshot ? (
                <>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-4">
                    <img
                      src={testimonial.screenshot}
                      alt="Review screenshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-red-400 text-sm font-medium">
                      {testimonial.userName ||
                        testimonial.user?.name ||
                        "Anonymous"}
                    </p>
                    <span className="text-white/30 text-xs">
                      {testimonial.createdAt
                        ? new Date(testimonial.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-white/40">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">No screenshot available</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    // Standard grid view with text and conditional image
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial._id}
            className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex mb-3">
              {renderStars(testimonial.rating || 5)}
            </div>

            {/* Show image if it exists */}
            {testimonial.screenshot && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-4">
                <img
                  src={testimonial.screenshot}
                  alt="Review screenshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              </div>
            )}

            <p className="text-white/80 text-sm mb-4">{testimonial.content}</p>

            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm font-medium">
                {testimonial.userName || testimonial.user?.name || "Anonymous"}
              </p>
              <span className="text-white/30 text-xs">
                {testimonial.createdAt
                  ? new Date(testimonial.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="min-h-screen py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Binary rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500/30 font-mono text-lg"
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 mb-4">
            CLIENT PRAISE
          </h2>
          <div className="font-mono text-red-400/80 text-lg">
            <span>Jayed&gt; _ Voices of satisfaction</span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </motion.div>

        {/* Marquee Testimonials */}
        {error ? (
          <div className="text-center text-gray-400">
            No testimonials available yet.
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-72">
            <motion.div
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : testimonials.length > 0 ? (
          <>
            {/* Marquee Banner */}
            <div className="relative mb-16 overflow-hidden border-y border-red-500/30 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent z-10"></div>
              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20"></div>
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20"></div>

              <motion.div ref={marqueeRef} className="flex whitespace-nowrap">
                {[...testimonials, ...testimonials].map(
                  (testimonial, index) => (
                    <div
                      key={`${testimonial._id}-${index}`}
                      className="inline-flex items-center mx-5"
                    >
                      <div className="flex mr-2">
                        {renderStars(testimonial.rating || 5)}
                      </div>
                      <span className="text-red-400 font-medium mr-2">
                        {testimonial.userName ||
                          testimonial.user?.name ||
                          "Anonymous"}
                        :
                      </span>
                      <span className="text-white/80 text-sm max-w-xs truncate">
                        {testimonial.content || "No review content available"}
                      </span>
                      <div className="mx-2 text-red-500/40">◆</div>
                    </div>
                  )
                )}
              </motion.div>
            </div>

            {/* View Mode Toggle and Image Only Button */}
            <div className="flex flex-col md:flex-row justify-start items-center gap-4 mb-8">
              <button
                onClick={() => setImageOnlyMode(!imageOnlyMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  imageOnlyMode
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {imageOnlyMode ? (
                  <>
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Show Text
                  </>
                ) : (
                  <>
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Show Images Only
                  </>
                )}
              </button>
            </div>

            {/* Render the selected view */}
            {viewMode === "grid" && <GridView />}
          </>
        ) : (
          <div className="text-center text-white/50 py-16">
            No testimonials available yet.
          </div>
        )}
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
      </div>
    </section>
  );
}
