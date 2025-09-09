import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jayed_Profile from "/image/jayed-2.JPG";
import macbookImage from "/image/jayed-9.jpg";
import { Link } from "react-router-dom";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const About = () => {
  const textContainerRef = useRef(null);
  const grainRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const aboutSectionRef = useRef(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    const sections = [
      { text: "Jayed> _ Passionate visual storyteller", delay: 0.3 },
      { text: "Jayed> _ Cinematic eye since 2024", delay: 1.2 },
      { text: "Jayed> _ Specializing in emotional narratives", delay: 1.8 },
    ];

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    sections.forEach((section) => {
      tl.to(textContainerRef.current, {
        duration: 1.5,
        text: section.text,
        ease: "none",
        delay: section.delay,
      });
    });

    // Cursor blink effect
    gsap.to("#terminal-cursor", {
      opacity: 0,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });

    // Grain effect
    gsap.from(grainRef.current, {
      opacity: 0,
      duration: 2,
      ease: "expo.out",
    });

    // Animate content sections on scroll
    contentRefs.current.forEach((ref, i) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  return (
    <section
      ref={aboutSectionRef}
      id="about"
      className="about-section min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>

      {/* Cinematic grain overlay */}
      <div
        ref={grainRef}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZTV1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"
      />

      <div className="container mx-auto px-4 py-20 relative z-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-8 font-mono text-red-400 text-lg">
            <span ref={textContainerRef}></span>
            <span id="terminal-cursor" className="ml-1">
              |
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-6">
            Visual Storyteller
          </h1>

          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Crafting emotional narratives through motion and light. Specializing
            in cinematic wedding films and brand stories that resonate deeply
            with audiences.
          </p>
        </div>

        {/* Profile Section */}
        <div
          ref={addToRefs}
          className="flex flex-col lg:flex-row items-center gap-12 mb-20"
        >
          <div className="w-full lg:w-1/3 relative">
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="w-full h-96 bg-gray-800 rounded-lg animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-50 rounded-lg"></div>
              </div>
            )}

            {/* Profile Image */}
            <div
              className={`relative rounded-lg overflow-hidden border-2 border-white/20 transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={jayed_Profile}
                alt="Jayed - Video Editor"
                className="w-full h-96 object-cover"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-mono">
                EDITOR'S CUT
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              My Journey
            </h2>

            <div className="space-y-4 text-white/80">
              <p>
                My journey began in the vibrant streets of Dhaka, where I
                discovered my passion for visual storytelling. Armed with
                nothing but a handheld camcorder and relentless curiosity, I
                started capturing moments that would eventually shape my career.
              </p>

              <p>
                In 2024, I took a leap of faith and dedicated myself fully to
                the art of video editing. What started as a hobby quickly
                evolved into a profession as I began working with brands and
                couples to create visual narratives that resonate on an
                emotional level.
              </p>

              <p>
                My big break came when I joined the Digital Dropout Skool
                program, where I honed my skills and earned recognition for my
                work. The MacBook I received as a performance reward became my
                most trusted tool, enabling me to bring my creative visions to
                life.
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div
          ref={addToRefs}
          className="bg-black/30 p-8 rounded-lg border border-white/10 mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            My Philosophy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-black/20 rounded-lg hover:bg-black/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Emotional Storytelling
              </h3>
              <p className="text-white/80">
                Every frame should evoke emotion and connect with the viewer on
                a deeper level.
              </p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-lg hover:bg-black/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Technical Excellence
              </h3>
              <p className="text-white/80">
                Precision in editing, color grading, and sound design to create
                seamless experiences.
              </p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-lg hover:bg-black/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Client Collaboration
              </h3>
              <p className="text-white/80">
                Working closely with clients to ensure their vision is realized
                beyond expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Tools & Specialties Section */}
        <div ref={addToRefs} className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Tools & Specialties
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-black/20 p-4 rounded-lg text-center border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-red-400 font-mono text-sm mb-2">EDITING</div>
              <div className="text-white">Premiere Pro</div>
              <div className="text-white">Final Cut Pro</div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg text-center border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-red-400 font-mono text-sm mb-2">
                COLOR GRADING
              </div>
              <div className="text-white">DaVinci Resolve</div>
              <div className="text-white">Color Theory</div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg text-center border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-red-400 font-mono text-sm mb-2">MOTION</div>
              <div className="text-white">After Effects</div>
              <div className="text-white">Motion Graphics</div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg text-center border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-red-400 font-mono text-sm mb-2">
                SPECIALTIES
              </div>
              <div className="text-white">Wedding Films</div>
              <div className="text-white">Brand Stories</div>
            </div>
          </div>
        </div>

        {/* Milestone Section */}
        <div
          ref={addToRefs}
          className="bg-black/20 p-8 rounded-lg border border-white/10 mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Career Milestones
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-500/20"></div>

            <div className="space-y-12">
              {/* Milestone 1 */}
              <div className="flex flex-col md:flex-row items-center md:items-start relative">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-white">
                    2024: The Beginning
                  </h3>
                  <p className="text-white/80">
                    Started my journey in video editing while studying at
                    university
                  </p>
                </div>

                <div className="w-4 h-4 bg-red-500 rounded-full z-10 mx-4"></div>

                <div className="md:w-1/2 md:pl-12">
                  {/* Spacer for alignment */}
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex flex-col md:flex-row items-center md:items-start relative">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  {/* Spacer for alignment */}
                </div>

                <div className="w-4 h-4 bg-red-500 rounded-full z-10 mx-4"></div>

                <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-white">
                    Joined Digital Dropout Skool
                  </h3>
                  <p className="text-white/80">
                    Enhanced my skills through specialized training and
                    mentorship
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex flex-col md:flex-row items-center md:items-start relative">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-white">
                    MacBook Achievement
                  </h3>
                  <p className="text-white/80">
                    Awarded for exceptional performance in the program
                  </p>
                </div>

                <div className="w-4 h-4 bg-red-500 rounded-full z-10 mx-4"></div>

                <div className="md:w-1/2 md:pl-12">
                  {/* Spacer for alignment */}
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="flex flex-col md:flex-row items-center md:items-start relative">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  {/* Spacer for alignment */}
                </div>

                <div className="w-4 h-4 bg-red-500 rounded-full z-10 mx-4"></div>

                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-xl font-semibold text-white">
                    Present: Professional Editor
                  </h3>
                  <p className="text-white/80">
                    Creating compelling visual stories for clients worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why I Do What I Do
          </h2>

          <p className="text-xl text-white/80 mb-8">
            "I believe that every moment has a story worth telling. My mission
            is to find those stories and tell them in the most compelling way
            possible through the art of video editing."
          </p>

          <Link
            to="/contact"
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium"
          >
            Let's Work Together
          </Link>
        </div>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>
    </section>
  );
};

export default About;
