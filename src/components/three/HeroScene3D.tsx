"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import CanvasFallback from "./CanvasFallback";
import { Compass, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Sparkles } from "lucide-react";

// Dynamically import the WebGL Canvas without SSR to prevent server reconciler evaluation
const HeroSceneR3F = dynamic(() => import("./HeroSceneR3F"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-luxury-gold text-xs uppercase tracking-luxury flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
        <span>Initializing 3D WebGL Engine...</span>
      </div>
    </div>
  ),
});

interface HeroScene3DProps {
  fallbackImage?: string;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  fallbackImage = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Check reduced motion
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMediaQuery.matches) {
      setPrefersReducedMotion(true);
      setIsRotating(false);
    }

    // Check WebGL availability safely
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  // Fallback for browsers without WebGL
  if (hasWebGL === false) {
    return (
      <CanvasFallback
        primaryImage={fallbackImage}
        title="Royal Heritage Rare Pendant"
        altText="Curated 3D Heritage Collectible"
      />
    );
  }

  return (
    <div
      className="relative w-full h-[540px] bg-luxury-black rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center select-none shadow-2xl"
      aria-label="3D Interactive Collectible Stage"
    >
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(198,166,106,0.12)_0%,rgba(36,36,36,0.4)_45%,rgba(17,17,17,0.98)_90%)] pointer-events-none" />

      {/* Real Three.js R3F Canvas dynamically loaded on client */}
      <HeroSceneR3F isRotating={isRotating} controlsRef={controlsRef} />

      {/* Top Curatorial Badge */}
      <div className="absolute top-4 left-4 z-20 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
        <span className="text-[10px] uppercase tracking-luxury text-luxury-ivory font-medium flex items-center gap-1.5">
          <Sparkles size={11} className="text-luxury-gold" />
          <span>Interactive 3D Stage (R3F)</span>
        </span>
      </div>

      {/* Interactive Controls Overlay Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-luxury-black/85 backdrop-blur-md p-1 border border-luxury-champagne/20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          aria-label={isRotating ? "Pause rotation" : "Play rotation"}
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title={isRotating ? "Pause auto-orbit" : "Resume auto-orbit"}
        >
          {isRotating ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={() => handleZoom(-0.8)}
          aria-label="Zoom in"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={() => handleZoom(0.8)}
          aria-label="Zoom out"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={handleResetCamera}
          aria-label="Reset 3D camera"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Bottom Stage Details & Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-luxury-black/85 backdrop-blur-md px-3.5 py-2 border border-luxury-champagne/25 pointer-events-auto">
          <p className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">Curatorial Centerpiece</p>
          <p className="text-xs font-serif text-luxury-ivory font-normal">Mughal Imperial Emerald & Kundan Gold Medallion</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-luxury-black/85 backdrop-blur-md px-3 py-2 border border-luxury-champagne/25 text-luxury-champagne pointer-events-auto">
          <Compass size={14} className="text-luxury-gold" />
          <span className="text-[10px] tracking-luxury uppercase">Drag to Rotate • Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};

export default HeroScene3D;
