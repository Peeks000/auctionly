"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't run on mobile / touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, [role='button'], input, textarea, select, .card-luxury, [data-cursor]"
        );
        setIsHovered(!!interactive);

        const customText = target.closest("[data-cursor]")?.getAttribute("data-cursor");
        setCursorText(customText || null);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    // 60-120fps smooth RAF lerp for follower ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#D4AF37] pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 ${
          isHovered ? "scale-125 bg-luxury-ivory" : "scale-100"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Trailing Luxury Halo Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center opacity-0 transition-[width,height,margin,border-color,background-color,opacity] duration-300 ease-out ${
          isHovered
            ? "w-14 h-14 -ml-7 -mt-7 border-2 border-luxury-gold bg-luxury-gold/15 shadow-[0_0_20px_rgba(212,175,55,0.35)] backdrop-blur-[1px]"
            : "w-9 h-9 -ml-[18px] -mt-[18px] border border-luxury-gold/50 bg-transparent"
        } ${isClicking ? "scale-75" : "scale-100"}`}
        style={{ willChange: "transform" }}
      >
        {cursorText && (
          <span className="text-[8px] font-sans tracking-[0.2em] uppercase font-bold text-luxury-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] animate-fadeIn">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
