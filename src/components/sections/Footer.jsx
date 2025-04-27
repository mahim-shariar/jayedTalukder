import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 border-t border-gray-800 overflow-hidden">
      {/* Gradient background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0f0f0f]/90 to-[#1a1a1a]/90 z-0"></div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=")`,
          opacity: 0.1,
        }}
      ></div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Copyright section */}
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              JAYED
            </h2>
            <p className="text-sm mt-2 font-mono">
              © {new Date().getFullYear()} All Rights Reserved by{" "}
              <a
                href="https://trilance.tech"
                target="_blank"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Trilance
              </a>
            </p>
          </div>

          {/* Navigation links */}
          <nav className="grid grid-cols-2 md:flex gap-6 md:gap-8 mb-8 md:mb-0">
            {["About", "Contact", "Showreel"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-white/80 hover:text-red-400 transition-colors font-medium text-sm uppercase tracking-wider"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/in/jayedbinkibria/"
              className="text-white/60 hover:text-red-400 transition-colors"
              aria-label="Email"
              target="_blank"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:jayedbinkibria@gmail.com"
              className="text-white/60 hover:text-red-400 transition-colors"
              aria-label="Email"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-xs font-mono mb-4 md:mb-0">
            CRAFTED WITH <span className="text-red-500">♥</span> IN DHAKA
          </p>
        </div>
      </div>

      {/* Glow effects */}
      <div
        className="absolute top-0 left-0 w-64 h-64 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, rgba(0,0,0,0) 70%)",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-64 h-64 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)",
          transform: "translate(50%, 50%)",
        }}
      ></div>
    </footer>
  );
}
