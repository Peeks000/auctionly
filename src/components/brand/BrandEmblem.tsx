import React from "react";
import MonogramA from "./MonogramA";

interface BrandEmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = "",
  size = "md",
}) => {
  const monogramDimensions = {
    sm: 48,
    md: 72,
    lg: 104,
  }[size];

  const textSize = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  }[size];

  const taglineSize = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  }[size];

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <MonogramA size={monogramDimensions} glow />
      
      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-luxury-gold" />
        <h1 className={`font-serif tracking-[0.35em] font-semibold text-luxury-ivory ${textSize}`}>
          AUCTIONLY
        </h1>
        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-luxury-gold" />
      </div>

      <p className={`mt-2 font-sans tracking-[0.35em] uppercase text-luxury-champagne opacity-90 ${taglineSize}`}>
        Own the Extraordinary.
      </p>

      <div className="mt-3 flex items-center gap-1.5 opacity-60">
        <span className="text-[9px] tracking-widest uppercase text-luxury-muted">Est. 2026</span>
        <span className="text-[9px] text-luxury-gold">•</span>
        <span className="text-[9px] tracking-widest uppercase text-luxury-muted">India & Global</span>
      </div>
    </div>
  );
};

export default BrandEmblem;
