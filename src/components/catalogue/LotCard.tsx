"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { formatINR } from "@/lib/currency";
import { Listing, Auction } from "@/types";
import { Clock, Bookmark, Gavel, Sparkles } from "lucide-react";
import { safeImagePath } from "@/lib/images";
import { useCardTilt, useCountdown, useWatchlist } from "@/lib/hooks";

// Dynamically import 3D preview with SSR disabled for optimal client-side WebGL lifecycle
const LotCard3DPreview = dynamic(() => import("@/components/three/LotCard3DPreview"), {
  ssr: false,
});

interface LotCardProps {
  listing: Listing & { auction?: Auction };
  priority?: boolean;
}

export const LotCard: React.FC<LotCardProps> = ({ listing, priority = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const auction = listing.auction;
  const isAuctionActive = auction?.status === "active" || auction?.status === "extended";
  const isLive = auction?.is_live;

  const { handleMouseMove, handleMouseLeave, transformStyle, glareStyle } = useCardTilt(cardRef);
  const { isBookmarked, toggleWatchlist } = useWatchlist(listing.id);
  const { timeLeft } = useCountdown(auction?.end_time);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="VIEW LOT"
      className="relative perspective-1000 h-full"
    >
      <div
        className="card-luxury flex flex-col justify-between h-full group overflow-hidden transition-all duration-300 ease-out will-change-transform relative"
        style={transformStyle}
      >
        {/* Dynamic Specular 3D Glare Highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={glareStyle}
        />

        <div>
          {/* Image Container with Badges */}
          <div className="relative w-full h-72 bg-luxury-dark/90 overflow-hidden">
            {listing.model_3d_url ? (
              <Link href={`/lot/${listing.slug}`} tabIndex={-1} className="block w-full h-full">
                <LotCard3DPreview
                  modelUrl={listing.model_3d_url}
                  fallbackImageUrl={listing.primary_image_url}
                  title={listing.title}
                  slug={listing.slug}
                  priority={priority}
                />
              </Link>
            ) : (
              <Link href={`/lot/${listing.slug}`} tabIndex={-1} className="block w-full h-full">
                <Image
                  src={safeImagePath(listing.primary_image_url)}
                  alt={listing.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-3 select-none drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={priority}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />
              </Link>
            )}

            {/* Top Status Indicators */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              {isLive ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-status-live text-white text-[10px] uppercase tracking-wider font-semibold shadow-md pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Live Gala
                </span>
              ) : isAuctionActive ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-luxury-black/85 backdrop-blur-md border border-luxury-champagne/30 text-[10px] uppercase tracking-luxury text-luxury-ivory font-medium pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Timed Auction
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-luxury-dark/90 text-luxury-champagne text-[10px] uppercase tracking-wider font-medium pointer-events-auto">
                  Upcoming
                </span>
              )}

              <button
                onClick={toggleWatchlist}
                className="p-1.5 bg-luxury-black/70 backdrop-blur-md hover:bg-luxury-gold hover:text-luxury-black text-luxury-champagne border border-luxury-champagne/20 transition-colors pointer-events-auto"
                aria-label="Add lot to watchlist"
              >
                <Bookmark size={14} className={isBookmarked ? "fill-luxury-gold text-luxury-gold" : ""} />
              </button>
            </div>

            {/* 3D Indicator Badge if model exists */}
            {listing.model_3d_url && (
              <div className="absolute bottom-3 left-3 bg-luxury-black/80 backdrop-blur-md px-2 py-0.5 border border-luxury-gold/40 text-[9px] uppercase tracking-wider text-luxury-gold flex items-center gap-1">
                <Sparkles size={10} />
                <span>3D Interactive</span>
              </div>
            )}

            {/* Countdown Clock Strip */}
            {timeLeft && (
              <div className="absolute bottom-3 right-3 bg-luxury-black/80 backdrop-blur-md px-2.5 py-1 border border-luxury-champagne/20 text-[10px] font-mono text-luxury-champagne flex items-center gap-1">
                <Clock size={11} className="text-luxury-gold" />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] text-luxury-champagne/70">
              <span className="uppercase tracking-luxury truncate max-w-[200px]">
                {listing.artist_or_maker || "Heritage Consignment"}
              </span>
              <span>{listing.origin_period}</span>
            </div>

            <Link href={`/lot/${listing.slug}`} className="group-hover:text-luxury-gold transition-colors">
              <h3 className="font-serif text-base text-luxury-ivory font-medium line-clamp-2 leading-snug">
                {listing.title}
              </h3>
            </Link>

            <p className="text-xs text-luxury-muted line-clamp-2 font-sans leading-relaxed">
              {listing.short_description}
            </p>
          </div>
        </div>

        {/* Financial Section & Action Buttons */}
        <div className="px-5 pb-5 pt-3 border-t border-luxury-subtle/30 bg-luxury-black/30 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">
                {isAuctionActive ? "Current Bid" : "Starting Bid"}
              </span>
              <span className="font-mono text-base font-semibold text-luxury-ivory">
                {formatINR(auction?.current_price || listing.starting_price)}
              </span>
            </div>

            {auction?.reserve_met ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/40 font-medium">
                Reserve Met
              </span>
            ) : (
              <span className="text-[10px] text-luxury-muted bg-luxury-dark/60 px-2 py-0.5 border border-luxury-subtle/30">
                Reserve Pending
              </span>
            )}
          </div>

          {/* Bids Counter and Button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-luxury-champagne/70">
              {auction?.bid_count || 0} bids placed
            </span>

            <Link
              href={`/lot/${listing.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-black border border-luxury-gold/40 text-xs uppercase tracking-luxury font-medium transition-all duration-300"
            >
              <Gavel size={12} />
              <span>Place Bid</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotCard;
