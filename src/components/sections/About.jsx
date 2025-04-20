import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import aboutVideo from "../../assets/videos/about-reel.mp4";

export default function About() {
  const sectionRef = useRef();
  const textRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    // Typewriter effect
    const text =
      "I'm a passionate video editor with 7 years of experience turning raw footage into compelling visual stories. My journey began with making skateboarding videos for friends, and has evolved into crafting narratives for global brands and artists.";
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        textRef.current.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 20);
      }
    };

    // Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeWriter();
            gsap.from(videoRef.current, {
              x: -100,
              opacity: 0,
              duration: 1.5,
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="about-section cinematic-grain">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div
          ref={videoRef}
          className="w-full md:w-1/2 relative overflow-hidden rounded-lg shadow-2xl"
        >
          <video autoPlay muted loop playsInline className="w-full h-auto">
            <source src={aboutVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-4xl mb-8 text-red-500">The Storyteller</h2>
          <div
            ref={textRef}
            className="text-lg leading-relaxed font-light"
            style={{ fontFamily: "'Courier New', monospace" }}
          ></div>

          <div className="mt-8 flex gap-4">
            <button className="px-6 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-all">
              My Process
            </button>
            <button className="px-6 py-2 bg-transparent border border-white/30 text-white rounded-full text-sm hover:bg-white/10 transition-all">
              Tools I Use
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
