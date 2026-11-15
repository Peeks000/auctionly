import React from "react";
import Link from "next/link";
import MonogramA from "./MonogramA";

interface LogoWordmarkProps {
  showTagline?: boolean;
  monogramSize?: number;
  className?: string;
  href?: string;
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  showTagline = false,
  monogramSize = 34,
  className = "",
  href = "/",
}) => {
  const content = (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <MonogramA
        size={monogramSize}
        className="transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="flex flex-col">
        <span className="font-serif tracking-[0.28em] text-lg font-semibold text-luxury-ivory group-hover:text-gold-gradient transition-colors">
          AUCTIONLY
        </span>
        {showTagline && (
          <span className="text-[9px] tracking-[0.3em] uppercase text-luxury-champagne opacity-80 -mt-0.5">
            Own the Extraordinary.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} aria-label="AUCTIONLY Homepage">{content}</Link>;
  }

  return content;
};

export default LogoWordmark;
