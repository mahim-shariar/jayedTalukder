import React from "react";

const FilmGrainOverlay = () => (
  <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
    <svg className="absolute inset-0 w-full h-full">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.03 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

const LoadingSpinner = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] overflow-hidden">
      <FilmGrainOverlay />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated red progress bar with glow */}
        <div className="w-64 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] rounded-full animate-loadingBar shadow-[0_0_15px_0_rgba(244,63,94,0.5)]" />
        </div>

        {/* Terminal-style loading indicator */}
        <div className="font-mono text-sm text-[#fb7185] flex items-center gap-2">
          <span className="text-[#4ade80]">$</span>
          <span className="animate-pulse">loading_reel.exe</span>
          <div className="flex gap-1">
            <span className="animate-bounce delay-75">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        </div>

        {/* Film strip effect */}
        <div className="relative w-40 h-6 mt-4">
          <div className="absolute inset-0 bg-[#1a1a1a] rounded-sm" />
          <div className="absolute inset-y-0 left-0 w-full flex gap-1.5 px-1.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-full w-4 bg-[#0f0f0f] rounded-sm animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle red glow in corners */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export default LoadingSpinner;
