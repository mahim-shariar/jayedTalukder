import React, { useMemo, memo } from "react";

// Memoized static components
const FilmGrainOverlay = memo(() => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="5"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.02 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
));

FilmGrainOverlay.displayName = "FilmGrainOverlay";

// Optimized gradient definitions - single source of truth
const GradientDefs = memo(() => (
  <defs>
    <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f43f5e" stopOpacity="1" />
      <stop offset="25%" stopColor="#fb7185" stopOpacity="0.9" />
      <stop offset="50%" stopColor="#e11d48" stopOpacity="0.7" />
      <stop offset="75%" stopColor="#be123c" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.15" />
    </linearGradient>
    <filter id="premiumBlur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
));

GradientDefs.displayName = "GradientDefs";

// Optimized ambient elements
const AmbientGlow = memo(() => (
  <>
    <div
      className="absolute inset-0 opacity-30 pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#f43f5e]/20 to-transparent blur-sm" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#e11d48]/15 to-transparent blur-sm" />
    </div>
    <div
      className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-[#f43f5e]/8 via-[#e11d48]/4 to-transparent rounded-full blur-[120px] -translate-x-1/2 translate-y-1/3 pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-bl from-[#f43f5e]/8 via-[#e11d48]/4 to-transparent rounded-full blur-[120px] translate-x-1/2 -translate-y-1/3 pointer-events-none"
      aria-hidden="true"
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#f43f5e]/6 to-[#e11d48]/4 rounded-full blur-[100px] pointer-events-none will-change-transform"
      style={{ animation: "centerPulse 4s ease-in-out infinite" }}
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 opacity-[0.015] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(rgba(244,63,94,0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(244,63,94,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
      aria-hidden="true"
    />
  </>
));

AmbientGlow.displayName = "AmbientGlow";

// Optimized spinner component
const PremiumSpinner = memo(() => {
  const glowStyles = useMemo(
    () => ({
      outer: {
        background:
          "radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(225,29,72,0.12) 40%, transparent 70%)",
        transform: "scale(2.5)",
      },
      inner: {
        background:
          "radial-gradient(circle, rgba(244,63,94,0.35) 0%, transparent 60%)",
        transform: "scale(1.8)",
      },
    }),
    []
  );

  return (
    <div className="relative mb-16">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60 pointer-events-none will-change-transform"
        style={glowStyles.outer}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none will-change-transform"
        style={glowStyles.inner}
        aria-hidden="true"
      />

      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/[0.08]" />
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0a0a0a]/40 to-transparent backdrop-blur-xl border border-white/[0.05]" />

        <svg
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{
            animation: "spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
          aria-label="Loading spinner"
        >
          <GradientDefs />

          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="4"
            opacity="0.15"
            filter="url(#premiumBlur)"
          />

          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="url(#premiumGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="80 180"
            filter="url(#softGlow)"
          />

          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="url(#premiumGradient)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="20 240"
            opacity="0.6"
            transform="rotate(-90 40 40)"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full bg-gradient-to-br from-[#f43f5e] to-[#e11d48] will-change-transform"
            style={{
              boxShadow: "0 0 20px #f43f5e, 0 0 40px rgba(244,63,94,0.3)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
});

PremiumSpinner.displayName = "PremiumSpinner";

// Optimized progress bar
const PremiumProgress = memo(() => {
  const progressStyle = useMemo(
    () => ({
      boxShadow: "0 0 30px rgba(244,63,94,0.5), 0 0 15px rgba(244,63,94,0.3)",
    }),
    []
  );

  const dotStyle = useMemo(
    () => ({
      boxShadow: "0 0 20px #f43f5e",
      animation: "progressDot 2.5s ease-in-out infinite",
    }),
    []
  );

  return (
    <div className="relative w-72 mb-8">
      <div className="relative h-0.5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.04] to-white/[0.02] backdrop-blur-xl rounded-full border border-white/[0.05]" />

        <div
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden will-change-[width]"
          style={{
            animation:
              "loadingBarPremium 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#f43f5e] via-[#fb7185] to-[#e11d48] rounded-full"
            style={progressStyle}
          />
          <div
            className="absolute inset-0 will-change-transform"
            style={{ animation: "premiumShimmer 2s infinite" }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{ transform: "skewX(-20deg)" }}
            />
          </div>
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm" />
        </div>
      </div>

      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white blur-[0.5px] will-change-[left]"
        style={dotStyle}
        aria-hidden="true"
      />

      <div
        className="absolute -inset-1 bg-gradient-to-r from-[#f43f5e]/10 via-transparent to-[#f43f5e]/10 rounded-full blur-xl opacity-50 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
});

PremiumProgress.displayName = "PremiumProgress";

// Optimized typography section
const PremiumTypography = memo(() => (
  <div className="relative">
    <div className="absolute -inset-3 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-2xl rounded-2xl border border-white/[0.06]" />

    <div className="relative flex items-center gap-3 px-2">
      <div className="relative">
        <div
          className="w-1.5 h-1.5 rounded-full bg-[#4ade80] will-change-transform"
          style={{
            boxShadow: "0 0 15px #4ade80, 0 0 5px #4ade80",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#4ade80]/30 blur-sm" />
      </div>

      <span className="text-xs font-medium tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fb7185] via-[#f43f5e] to-[#fb7185]">
        Loading System
      </span>

      <div className="flex gap-1 ml-0.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-[#f43f5e]/60 will-change-transform"
            style={{
              animation: "premiumPulse 1.2s ease-in-out infinite",
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
));

PremiumTypography.displayName = "PremiumTypography";

// Optimized film strip
const PremiumFilmStrip = memo(() => (
  <div className="relative mt-12">
    <div className="relative w-44 h-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl rounded-lg border border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f43f5e]/5 via-transparent to-[#f43f5e]/5" />

        <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center gap-2 px-2.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="relative group">
              <div className="relative w-3.5 h-3.5 rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.04] rounded-md" />
                <div
                  className="absolute inset-0 rounded-md will-change-transform"
                  style={{
                    animation: "frameGlow 2s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                    background:
                      "radial-gradient(circle at center, rgba(244,63,94,0.15) 0%, transparent 70%)",
                  }}
                />
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#f43f5e]/20 rounded-tl-md" />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[#f43f5e]/20 rounded-br-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

PremiumFilmStrip.displayName = "PremiumFilmStrip";

// Main component - optimized with CSS containment and hardware acceleration
const LoadingSpinner = () => {
  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes loadingBarPremium {
          0% { width: 0%; }
          30% { width: 35%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes progressDot {
          0%, 100% { left: 0%; opacity: 0.5; }
          30% { left: 35%; opacity: 1; }
          60% { left: 70%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        
        @keyframes premiumShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes premiumPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes frameGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes centerPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        /* Performance optimizations */
        .will-change-transform {
          will-change: transform;
        }
        
        .will-change-opacity {
          will-change: opacity;
        }
        
        .will-change-width {
          will-change: width;
        }
        
        .will-change-left {
          will-change: left;
        }
        
        /* GPU acceleration */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#080808] via-[#0c0c0c] to-[#121212] overflow-hidden gpu-accelerated"
        style={{ contain: "layout style paint" }}
      >
        <FilmGrainOverlay />
        <AmbientGlow />

        <div
          className="relative z-10 flex flex-col items-center gpu-accelerated"
          style={{ contain: "layout style" }}
        >
          <PremiumSpinner />
          <PremiumProgress />
          <PremiumTypography />
          <PremiumFilmStrip />
        </div>
      </div>
    </>
  );
};

export default memo(LoadingSpinner);
