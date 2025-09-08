import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { getReviews } from "../../services/api";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("text"); // "text" or "screenshot"
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const itemsRef = useRef([]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getReviews({ isBest: true });
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
        duration: totalWidth / 30, // Adjust speed based on content length
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

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Testimonials List */}
              <div className="w-full lg:w-2/5">
                <h3 className="text-xl font-semibold text-red-400 mb-6">
                  All Testimonials
                </h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial._id}
                      ref={(el) => (itemsRef.current[index] = el)}
                      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedTestimonial === index
                          ? "bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border-red-500/50 shadow-lg"
                          : "bg-[#0f0f0f] border-white/10 hover:border-red-400/30"
                      }`}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedTestimonial(index)}
                    >
                      <div className="flex mb-3">
                        {renderStars(testimonial.rating || 5)}
                      </div>
                      <p className="text-white/80 text-sm line-clamp-3 mb-4">
                        {testimonial.content || "No review content available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red-400 text-sm font-medium">
                          {testimonial.userName ||
                            testimonial.user?.name ||
                            "Anonymous"}
                        </p>
                        <span className="text-white/30 text-xs">
                          {testimonial.createdAt
                            ? new Date(
                                testimonial.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Testimonial Detail View */}
              <div className="w-full lg:w-3/5">
                <h3 className="text-xl font-semibold text-red-400 mb-6">
                  Review Details
                </h3>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-6">
                  <button
                    className={`py-2 px-4 font-medium text-sm transition-colors ${
                      activeTab === "text"
                        ? "text-red-400 border-b-2 border-red-500"
                        : "text-white/60 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("text")}
                  >
                    Review Text
                  </button>
                  {testimonials[selectedTestimonial]?.screenshot && (
                    <button
                      className={`py-2 px-4 font-medium text-sm transition-colors ${
                        activeTab === "screenshot"
                          ? "text-red-400 border-b-2 border-red-500"
                          : "text-white/60 hover:text-white"
                      }`}
                      onClick={() => setActiveTab("screenshot")}
                    >
                      Actual Screenshot
                    </button>
                  )}
                </div>

                {/* Content based on active tab */}
                <AnimatePresence mode="wait">
                  {activeTab === "text" ? (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl p-8"
                    >
                      <div className="flex mb-6">
                        {renderStars(
                          testimonials[selectedTestimonial]?.rating || 5
                        )}
                      </div>

                      <div className="mb-8">
                        <blockquote className="text-white/90 text-lg md:text-xl italic leading-relaxed">
                          {testimonials[selectedTestimonial]?.content ||
                            "No review content available"}
                        </blockquote>
                      </div>

                      <div className="flex items-center pt-6 border-t border-white/10">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg mr-4">
                          {testimonials[selectedTestimonial]?.userName?.charAt(
                            0
                          ) ||
                            testimonials[
                              selectedTestimonial
                            ]?.user?.name?.charAt(0) ||
                            "A"}
                        </div>
                        <div>
                          <p className="text-red-400 font-medium">
                            {testimonials[selectedTestimonial]?.userName ||
                              testimonials[selectedTestimonial]?.user?.name ||
                              "Anonymous"}
                          </p>
                          <p className="text-white/50 text-sm">
                            {testimonials[selectedTestimonial]?.createdAt
                              ? new Date(
                                  testimonials[selectedTestimonial]?.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="screenshot"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl p-6"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={testimonials[selectedTestimonial]?.screenshot}
                          alt={`Review from ${
                            testimonials[selectedTestimonial]?.userName ||
                            testimonials[selectedTestimonial]?.user?.name ||
                            "Anonymous"
                          }`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 text-sm bg-black/70 px-3 py-1.5 rounded">
                          Actual client review
                        </div>
                      </div>

                      <div className="flex items-center mt-6 pt-6 border-t border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg mr-4">
                          {testimonials[selectedTestimonial]?.userName?.charAt(
                            0
                          ) ||
                            testimonials[
                              selectedTestimonial
                            ]?.user?.name?.charAt(0) ||
                            "A"}
                        </div>
                        <div>
                          <p className="text-red-400 font-medium">
                            {testimonials[selectedTestimonial]?.userName ||
                              testimonials[selectedTestimonial]?.user?.name ||
                              "Anonymous"}
                          </p>
                          <p className="text-white/50 text-sm">
                            {testimonials[selectedTestimonial]?.createdAt
                              ? new Date(
                                  testimonials[selectedTestimonial]?.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
