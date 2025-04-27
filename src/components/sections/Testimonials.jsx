import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { getReviews } from "../../services/api";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [expandedTextCards, setExpandedTextCards] = useState([]);
  const [expandedScreenshotCards, setExpandedScreenshotCards] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const textContentRefs = useRef([]);
  const screenshotContentRefs = useRef([]);

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

  const toggleTextExpansion = (id, e) => {
    e.stopPropagation();
    if (expandedTextCards.includes(id)) {
      // Collapse text animation
      const index = testimonials.findIndex((t) => t._id === id);
      gsap.to(textContentRefs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setExpandedTextCards(
            expandedTextCards.filter((cardId) => cardId !== id)
          );
        },
      });
    } else {
      setExpandedTextCards([...expandedTextCards, id]);
    }
  };

  const toggleScreenshot = (id, e) => {
    e.stopPropagation();
    if (expandedScreenshotCards.includes(id)) {
      // Collapse screenshot animation
      const index = testimonials.findIndex((t) => t._id === id);
      gsap.to(screenshotContentRefs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setExpandedScreenshotCards(
            expandedScreenshotCards.filter((cardId) => cardId !== id)
          );
        },
      });
    } else {
      setExpandedScreenshotCards([...expandedScreenshotCards, id]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close screenshot if clicked outside
      if (
        expandedScreenshotCards.length > 0 &&
        !event.target.closest(".testimonial-card")
      ) {
        expandedScreenshotCards.forEach((id) => {
          const index = testimonials.findIndex((t) => t._id === id);
          gsap.to(screenshotContentRefs.current[index], {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              setExpandedScreenshotCards(
                expandedScreenshotCards.filter((cardId) => cardId !== id)
              );
            },
          });
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedScreenshotCards, testimonials]);

  // Expand animations when cards are set to expanded
  useEffect(() => {
    expandedTextCards.forEach((id) => {
      const index = testimonials.findIndex((t) => t._id === id);
      if (index !== -1 && textContentRefs.current[index]) {
        gsap.fromTo(
          textContentRefs.current[index],
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    });
  }, [expandedTextCards, testimonials]);

  useEffect(() => {
    expandedScreenshotCards.forEach((id) => {
      const index = testimonials.findIndex((t) => t._id === id);
      if (index !== -1 && screenshotContentRefs.current[index]) {
        gsap.fromTo(
          screenshotContentRefs.current[index],
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    });
  }, [expandedScreenshotCards, testimonials]);

  // Initial animations
  useEffect(() => {
    if (testimonials.length === 0 || loading) return;

    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { opacity: 1, y: 0 });

      if (!isInitialLoad) {
        cardsRef.current.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        });
      }

      setIsInitialLoad(false);
    }, containerRef);

    return () => ctx.revert();
  }, [showAll, isInitialLoad, testimonials, loading]);

  const renderStars = (count) => {
    return Array(count)
      .fill()
      .map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  const truncateContent = (content, id) => {
    if (!content) return "No review content available";

    const maxLength = 200;
    if (content.length <= maxLength || expandedTextCards.includes(id)) {
      return content;
    }

    return `${content.substring(0, maxLength)}...`;
  };

  if (error) {
    return (
      <section className="min-h-screen py-24 bg-[#0a0a0a] text-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center text-red-400">Error: {error}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="min-h-screen py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 2})`,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="container mx-auto px-4 relative z-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 mb-4">
            CLIENT PRAISE
          </h2>
          <div className="font-mono text-red-400/80 text-lg">
            <span>Jayed&gt; _ Voices of satisfaction</span>
            <span className="ml-1 animate-pulse">_</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {(showAll ? testimonials : testimonials.slice(0, 6)).map(
                (testimonial, index) => (
                  <div
                    key={testimonial._id}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="testimonial-card opacity-100"
                  >
                    <div
                      className={`h-full flex flex-col bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] border border-white/5 rounded-xl relative overflow-hidden group transition-all duration-300 ${
                        expandedScreenshotCards.includes(testimonial._id)
                          ? "!border-red-500/50"
                          : ""
                      }`}
                    >
                      {/* Main card content */}
                      <div className="p-8">
                        <div className="flex mb-4">
                          {renderStars(testimonial.rating || 5)}
                        </div>

                        <div className="flex-grow mb-6">
                          <blockquote className="text-white/80 italic text-lg relative">
                            <span className="absolute top-0 left-0 text-red-500/30 text-7xl font-serif -mt-2 -ml-1">
                              "
                            </span>
                            <div className="relative z-10 pl-6">
                              <div>
                                {truncateContent(
                                  testimonial.content,
                                  testimonial._id
                                )}
                              </div>
                              {/* Expanded text content with transition */}
                              <div
                                ref={(el) =>
                                  (textContentRefs.current[index] = el)
                                }
                                className="overflow-hidden"
                                style={{ height: 0, opacity: 0 }}
                              >
                                <div className="pt-2">
                                  {testimonial.content}
                                </div>
                              </div>
                            </div>
                          </blockquote>
                        </div>

                        {/* Read More button (only show if content is truncated) */}
                        {testimonial.content &&
                          testimonial.content.length > 200 && (
                            <div className="mt-4">
                              <button
                                onClick={(e) =>
                                  toggleTextExpansion(testimonial._id, e)
                                }
                                className="text-red-400 hover:text-red-300 text-sm flex items-center"
                              >
                                {expandedTextCards.includes(testimonial._id)
                                  ? "Read less"
                                  : "Read more"}
                                <svg
                                  className={`w-4 h-4 ml-1 transition-transform ${
                                    expandedTextCards.includes(testimonial._id)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                        <div className="mt-auto pt-4 border-t border-white/5">
                          <p className="text-red-400 font-medium">
                            {testimonial.userName ||
                              testimonial.user?.name ||
                              "Anonymous"}
                          </p>
                          <p className="text-white/50 text-sm">
                            {testimonial.createdAt
                              ? new Date(
                                  testimonial.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Expand button - only show if screenshot exists */}
                      {testimonial.screenshot && (
                        <>
                          <button
                            onClick={(e) =>
                              toggleScreenshot(testimonial._id, e)
                            }
                            className="w-full py-3 bg-black/30 border-t border-white/5 text-red-400 hover:bg-black/40 transition-all duration-300 flex items-center justify-center group"
                          >
                            <span>
                              {expandedScreenshotCards.includes(testimonial._id)
                                ? "Hide Actual Review"
                                : "Show Actual Review"}
                            </span>
                            <svg
                              className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                                expandedScreenshotCards.includes(
                                  testimonial._id
                                )
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* Expandable screenshot content with transition */}
                          <div
                            ref={(el) =>
                              (screenshotContentRefs.current[index] = el)
                            }
                            className="overflow-hidden"
                            style={{ height: 0, opacity: 0 }}
                          >
                            <div className="p-4 bg-black/20">
                              <div className="relative aspect-video rounded-md overflow-hidden border border-white/10">
                                <img
                                  src={testimonial.screenshot}
                                  alt={`Review from ${
                                    testimonial.userName ||
                                    testimonial.user?.name ||
                                    "Anonymous"
                                  }`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                                  Actual client review
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-white/60 text-center">
                                Click outside to close
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Show All Button */}
            {!showAll && testimonials.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-white transition-all duration-300 rounded-lg flex items-center mx-auto group"
                >
                  <span>Show All Testimonials</span>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/50 py-16">
            No testimonials available yet.
          </div>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>
    </section>
  );
}
