"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RotateCw, ZoomIn, Eye } from "lucide-react";

interface CanvasFallbackProps {
  primaryImage: string;
  title: string;
  altText?: string;
}

export const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  primaryImage,
  title,
  altText = "Luxury Lot Photography",
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.4 : 1));
  };

  const rotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  return (
    <div className="relative w-full h-[450px] bg-luxury-dark/60 rounded-sm border border-luxury-champagne/15 overflow-hidden flex items-center justify-center group">
      {/* Background radial gradient to give museum gallery depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,106,0.12)_0%,rgba(17,17,17,0.95)_75%)] pointer-events-none" />

      {/* Main High-Res Image with Zoom/Rotate Controls */}
      <div
        className="relative w-full h-full flex items-center justify-center p-8 transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
        style={{
          transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
        }}
      >
        <Image
          src={primaryImage}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] select-none"
          priority
        />
      </div>

      {/* Museum Plaque Badge */}
      <div className="absolute bottom-4 left-4 bg-luxury-black/80 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/20 flex items-center gap-2">
        <Eye size={12} className="text-luxury-gold" />
        <span className="text-[10px] uppercase tracking-luxury text-luxury-champagne font-medium">
          Curatorial 2D View
        </span>
      </div>

      {/* Interactive Floating Control Pill */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-luxury-black/80 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/20">
        <button
          onClick={toggleZoom}
          className="p-1 text-luxury-champagne hover:text-luxury-gold transition-colors"
          title="Zoom View"
          aria-label="Toggle Image Zoom"
        >
          <ZoomIn size={14} />
        </button>
        <div className="w-[1px] h-3 bg-luxury-subtle" />
        <button
          onClick={rotate}
          className="p-1 text-luxury-champagne hover:text-luxury-gold transition-colors"
          title="Rotate Angle"
          aria-label="Rotate View 90 Degrees"
        >
          <RotateCw size={14} />
        </button>
      </div>
    </div>
  );
};

export default CanvasFallback;
