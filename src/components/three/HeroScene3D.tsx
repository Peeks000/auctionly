"use client";

import React, { useState, useEffect, useRef } from "react";
import CanvasFallback from "./CanvasFallback";
import { Eye, Compass } from "lucide-react";

interface HeroScene3DProps {
  fallbackImage?: string;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  fallbackImage = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionMediaQuery.matches);

    // Check WebGL availability safely
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // If WebGL is not supported or user prefers reduced motion, render high-fidelity fallback
  if (hasWebGL === false || prefersReducedMotion) {
    return (
      <CanvasFallback
        primaryImage={fallbackImage}
        title="Royal Heritage Rare Watch"
        altText="Curated 3D Heritage Collectible"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] bg-luxury-black rounded-sm border border-luxury-champagne/15 overflow-hidden flex items-center justify-center"
      aria-label="3D Interactive Collectible Stage"
    >
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(198,166,106,0.18)_0%,rgba(36,36,36,0.5)_40%,rgba(17,17,17,0.98)_85%)] pointer-events-none" />

      {/* CSS-driven 3D Isometric Luxury Polyhedron Sculpture with Gold Lighting */}
      <div className="relative w-72 h-72 [perspective:1000px] flex items-center justify-center">
        <div className="relative w-48 h-48 [transform-style:preserve-3d] animate-shimmer-gold transition-transform duration-1000 ease-out hover:scale-105">
          {/* Layer 1: Outer Architectural Gold Frame */}
          <div className="absolute inset-0 border border-luxury-gold/60 [transform:rotateX(45deg)_rotateY(45deg)] shadow-[0_0_50px_rgba(198,166,106,0.3)] bg-gradient-to-tr from-luxury-dark/90 via-luxury-gold/10 to-luxury-champagne/30 backdrop-blur-md" />

          {/* Layer 2: Inner Diamond Facet */}
          <div className="absolute inset-4 border border-luxury-champagne/40 [transform:rotateX(-30deg)_rotateY(60deg)] bg-luxury-black/70" />

          {/* Layer 3: Central Golden Core Gem */}
          <div className="absolute inset-10 border-2 border-luxury-gold [transform:rotateX(60deg)_rotateZ(30deg)] bg-gradient-to-b from-luxury-goldLight via-luxury-gold to-luxury-goldDark opacity-90 shadow-[0_0_40px_rgba(198,166,106,0.8)]" />

          {/* Core Spotlight Beam */}
          <div className="absolute -inset-16 rounded-full bg-gradient-to-t from-transparent via-luxury-gold/15 to-transparent blur-xl pointer-events-none animate-pulse-subtle" />
        </div>
      </div>

      {/* Curatorial Stage Info Overlay */}
      <div className="absolute top-4 left-4 bg-luxury-black/80 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/20 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
        <span className="text-[10px] uppercase tracking-luxury text-luxury-ivory font-medium">
          Interactive 3D Stage
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-luxury-black/80 backdrop-blur-md px-3.5 py-2 border border-luxury-champagne/20 pointer-events-auto">
          <p className="text-[9px] tracking-luxury uppercase text-luxury-champagne/70">Featured Marquee Lot</p>
          <p className="text-xs font-serif text-luxury-ivory font-medium">Mughal Emerald & Basra Pearl Pendant, c. 1820</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-luxury-black/80 backdrop-blur-md px-3 py-2 border border-luxury-champagne/20 text-luxury-champagne pointer-events-auto">
          <Compass size={14} className="text-luxury-gold" />
          <span className="text-[10px] tracking-luxury uppercase">360° Rotatable</span>
        </div>
      </div>
    </div>
  );
};

export default HeroScene3D;
