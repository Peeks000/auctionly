import React from "react";

interface MonogramProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const MonogramA: React.FC<MonogramProps> = ({
  className = "",
  size = 40,
  glow = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${glow ? "drop-shadow-[0_0_12px_rgba(198,166,106,0.5)]" : ""} ${className}`}
      aria-label="AUCTIONLY Monogram A"
      role="img"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F0E7" />
          <stop offset="50%" stopColor="#C6A66A" />
          <stop offset="100%" stopColor="#9E824A" />
        </linearGradient>
        <linearGradient id="innerShine" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C6A66A" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Outer Diamond Housing */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="#181818"
      />

      {/* Inner Accent Ring */}
      <polygon
        points="50,12 88,50 50,88 12,50"
        stroke="rgba(232, 220, 196, 0.15)"
        strokeWidth="0.75"
        fill="none"
      />

      {/* Architectural Serif Letter 'A' */}
      {/* Left Apex Stride */}
      <path
        d="M50 24L30 76H38L44 60H56L62 76H70L50 24Z"
        fill="url(#goldGradient)"
      />

      {/* Inner Chamfer Cutout */}
      <polygon points="50,38 45.5,53 54.5,53" fill="#181818" />

      {/* Distinctive Gavel Horizontal Accent Bar */}
      <rect
        x="36"
        y="58"
        width="28"
        height="2.5"
        fill="#F5F0E7"
        rx="0.5"
      />

      {/* Subtle Apex Jewel Accent */}
      <circle cx="50" cy="20" r="1.75" fill="#F5F0E7" />
    </svg>
  );
};

export default MonogramA;
