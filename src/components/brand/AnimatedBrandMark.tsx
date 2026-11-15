"use client";

import React, { useState } from "react";
import MonogramA from "./MonogramA";

interface AnimatedBrandMarkProps {
  onComplete?: () => void;
  allowSkip?: boolean;
}

export const AnimatedBrandMark: React.FC<AnimatedBrandMarkProps> = ({
  onComplete,
  allowSkip = true,
}) => {
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    setSkipped(true);
    if (onComplete) onComplete();
  };

  if (skipped) return null;

  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-luxury-black/90 rounded-sm border border-luxury-champagne/20 backdrop-blur-xl">
      {/* Animated Light Shimmer Ring */}
      <div className="relative animate-pulse-subtle">
        <MonogramA size={84} glow className="transition-transform duration-700 hover:scale-110" />
      </div>

      <div className="mt-5 text-center">
        <h2 className="font-serif text-2xl tracking-[0.3em] font-medium text-luxury-ivory animate-shimmer-gold">
          AUCTIONLY
        </h2>
        <p className="mt-1 text-[10px] tracking-[0.35em] uppercase text-luxury-champagne opacity-80">
          Own the Extraordinary.
        </p>
      </div>

      {allowSkip && (
        <button
          onClick={handleSkip}
          className="mt-6 px-4 py-1 text-[10px] tracking-[0.2em] uppercase text-luxury-muted hover:text-luxury-ivory border border-luxury-subtle hover:border-luxury-gold transition-colors duration-300"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
};

export default AnimatedBrandMark;
