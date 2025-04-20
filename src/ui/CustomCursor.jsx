import React, { useEffect, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Smooth movement using requestAnimationFrame
    let requestId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const smoothingFactor = 0.2;

    const animate = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * smoothingFactor;
      currentY += dy * smoothingFactor;

      setCursorPosition({ x: currentX, y: currentY });
      requestId = requestAnimationFrame(animate);
    };

    requestId = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detect interactive elements
    const handleMouseOver = (e) => {
      const interactiveElements = [
        "button",
        "a",
        "input",
        "textarea",
        "select",
        '[role="button"]',
      ];
      if (interactiveElements.some((selector) => e.target.closest(selector))) {
        setIsHoveringInteractive(true);
      }
    };

    const handleMouseOut = () => setIsHoveringInteractive(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      <div
        className={`custom-cursor ${isVisible ? "visible" : ""} ${
          isHoveringInteractive ? "interactive" : ""
        } ${isClicking ? "clicking" : ""}`}
        style={{
          transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
        }}
      >
        <div className="cursor-inner">
          <div className="play-icon"></div>
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
