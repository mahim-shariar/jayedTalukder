import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 2,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 3,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 4,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 5,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 6,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 7,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 8,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  {
    id: 9,
    name: "Sarah & James",
    role: "Wedding Clients",
    quote:
      "Jayed captured our day better than we remembered it. The editing of our first dance gives me chills every time.",
    rating: 5,
    reviewImage: "/review-wedding.jpg",
    reviewAlt: "Screenshot of wedding client review",
  },
  // ... other testimonials
];

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const contentRefs = useRef([]);

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    if (expandedCard === id) {
      // Collapse animation
      const index = testimonials.findIndex((t) => t.id === id);
      gsap.to(contentRefs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setExpandedCard(null),
      });
    } else {
      setExpandedCard(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedCard && !event.target.closest(".testimonial-card")) {
        const index = testimonials.findIndex((t) => t.id === expandedCard);
        gsap.to(contentRefs.current[index], {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setExpandedCard(null),
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedCard]);

  // Expand animation when card is set to expanded
  useEffect(() => {
    if (expandedCard) {
      const index = testimonials.findIndex((t) => t.id === expandedCard);
      if (index !== -1 && contentRefs.current[index]) {
        gsap.fromTo(
          contentRefs.current[index],
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    }
  }, [expandedCard]);

  // Initial animations
  useEffect(() => {
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
  }, [showAll, isInitialLoad]);

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

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="testimonials-section py-24 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10" />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {(showAll ? testimonials : testimonials.slice(0, 6)).map(
            (testimonial, index) => (
              <div
                key={testimonial.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="testimonial-card opacity-100"
              >
                <div
                  className={`h-full flex flex-col bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] border border-white/5 rounded-xl relative overflow-hidden group transition-all duration-300 ${
                    expandedCard === testimonial.id ? "!border-red-500/50" : ""
                  }`}
                >
                  {/* Main card content */}
                  <div className="p-8">
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <div className="flex-grow mb-6">
                      <blockquote className="text-white/80 italic text-lg relative">
                        <span className="absolute top-0 left-0 text-red-500/30 text-7xl font-serif -mt-2 -ml-1">
                          "
                        </span>
                        <span className="relative z-10 pl-6">
                          {testimonial.quote}
                        </span>
                      </blockquote>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <p className="text-red-400 font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-white/50 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={(e) => toggleExpand(testimonial.id, e)}
                    className="w-full py-3 bg-black/30 border-t border-white/5 text-red-400 hover:bg-black/40 transition-all duration-300 flex items-center justify-center group"
                  >
                    <span>
                      {expandedCard === testimonial.id
                        ? "Hide Review"
                        : "Show Actual Review"}
                    </span>
                    <svg
                      className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                        expandedCard === testimonial.id ? "rotate-180" : ""
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

                  {/* Expandable content with transition */}
                  <div
                    ref={(el) => (contentRefs.current[index] = el)}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                  >
                    <div className="p-4 bg-black/20">
                      <div className="relative aspect-video rounded-md overflow-hidden border border-white/10">
                        <img
                          src={testimonial.reviewImage}
                          alt={testimonial.reviewAlt}
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
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>
    </section>
  );
}
