"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/currency";
import { getAllListings } from "@/lib/catalogueService";
import { safeImagePath } from "@/lib/images";
import {
  Gavel,
  Radio,
  Users,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  Maximize2,
  Info,
} from "lucide-react";

export default function LiveAuctionRoom() {
  const allListings = getAllListings();
  const lot = allListings[2] || allListings[0]; // Patek Philippe 2499 or Chola Bronze
  const [currentBidPaisa, setCurrentBidPaisa] = useState(3800000000); // ₹3,80,00,000
  const [bidIncrementPaisa, setBidIncrementPaisa] = useState(50000000); // ₹50,00,000
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [auctionState, setAuctionState] = useState<"bidding" | "fair_warning" | "hammer_down">("bidding");
  const [recentBids, setRecentBids] = useState<
    { id: string; bidder: string; amountPaisa: number; time: string; location: string }[]
  >([
    { id: "1", bidder: "Paddle #412", amountPaisa: 3800000000, time: "Just now", location: "Mumbai Saleroom" },
    { id: "2", bidder: "Paddle #809", amountPaisa: 3750000000, time: "1 min ago", location: "London Phone Desk" },
    { id: "3", bidder: "Paddle #102", amountPaisa: 3700000000, time: "2 mins ago", location: "Geneva Online Desk" },
  ]);

  const [auctioneerMessage, setAuctioneerMessage] = useState(
    "The bidding is open at ₹3,80,00,000 with Paddle #412. I am asking ₹3,85,00,000."
  );

  // Bidder placing a one-click live bid
  const handlePlaceLiveBid = () => {
    const nextAmount = currentBidPaisa + bidIncrementPaisa;
    setCurrentBidPaisa(nextAmount);
    setAuctionState("bidding");

    const newBid = {
      id: Date.now().toString(),
      bidder: "You (Paddle #771)",
      amountPaisa: nextAmount,
      time: "Just now",
      location: "Verified Private Desk",
    };

    setRecentBids([newBid, ...recentBids]);
    setAuctioneerMessage(`New bid accepted from online bidder at ${formatINR(nextAmount)}. Do I have another?`);
  };

  // Auctioneer Console: Fair Warning
  const handleFairWarning = () => {
    setAuctionState("fair_warning");
    setAuctioneerMessage(`Fair warning! At ${formatINR(currentBidPaisa)} for ${lot.title}... going once, going twice...`);
  };

  // Auctioneer Console: Hammer Down
  const handleHammerDown = () => {
    setAuctionState("hammer_down");
    setAuctioneerMessage(`HAMMER DOWN! Sold for ${formatINR(currentBidPaisa)} to ${recentBids[0]?.bidder || "High Bidder"}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Simulation Disclosure Notice */}
      <div className="bg-amber-950/60 border border-amber-800/80 p-3.5 rounded-sm text-xs text-amber-200 flex items-start gap-2.5">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold uppercase tracking-wider block">Interactive Demonstration Saleroom</strong>
          <span>
            This interactive stage demonstrates AUCTIONLY’s live gala mechanics, rostra call-outs, fair warning gavel sequences, and real-time proxy increments. No real monetary transactions occur in this demonstration environment.
          </span>
        </div>
      </div>

      {/* Top Banner: Gala Broadcast Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-luxury-dark/90 p-4 border border-luxury-champagne/20 rounded-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-600/90 text-black text-xs uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            <span>Interactive Gala Simulation</span>
          </div>
          <span className="hidden md:inline-block text-xs text-luxury-champagne">
            Imperial Evening Sale • Lot 12 of 34
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-luxury-champagne">
          <div className="flex items-center gap-1.5 text-luxury-muted">
            <Radio size={14} className="text-luxury-gold animate-pulse" />
            <span>Simulated Rostra Feed</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 bg-luxury-black border border-luxury-subtle hover:text-luxury-gold transition-colors"
            title="Toggle Audio Feed"
            aria-label="Toggle audio"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Main Gala Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Video Stream & Lot Focus */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Simulated HD Live Broadcast Feed */}
          <div className="relative w-full h-[460px] bg-luxury-black rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center group shadow-2xl">
            {/* Background Stream Simulation Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(36,36,36,0.9)_0%,rgba(17,17,17,1)_85%)]" />

            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-luxury-gold p-1 mb-4 shadow-[0_0_30px_rgba(198,166,106,0.3)]">
                <Image
                  src={safeImagePath(lot.primary_image_url) || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"}
                  alt="Auctioneer Presentation Lot"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-black/80 border border-luxury-gold/40 text-[10px] uppercase tracking-luxury text-luxury-gold mb-2">
                <Radio size={12} className="animate-pulse" />
                <span>Rostra Video Feed (Low Latency)</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-luxury-ivory font-medium">
                {lot.title}
              </h3>
              <p className="text-xs text-luxury-champagne/80 mt-1 max-w-md line-clamp-2">
                {lot.short_description}
              </p>
            </div>

            {/* Auctioneer Live Status Strip */}
            <div className="absolute bottom-4 left-4 right-4 bg-luxury-black/90 backdrop-blur-md p-4 border border-luxury-champagne/20 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-status-live animate-ping" />
                <span className="font-serif text-sm text-luxury-ivory italic">
                  &ldquo;{auctioneerMessage}&rdquo;
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase text-luxury-gold tracking-widest hidden sm:inline">
                Auctioneer Desk
              </span>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="card-luxury p-5 flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
              Simulation Console (Test Saleroom Mechanics)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handlePlaceLiveBid}
                disabled={auctionState === "hammer_down"}
                className="py-3 bg-luxury-gold hover:bg-luxury-gold-hover disabled:opacity-40 text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Gavel size={14} />
                <span>Bid {formatINR(currentBidPaisa + bidIncrementPaisa)}</span>
              </button>

              <button
                onClick={handleFairWarning}
                disabled={auctionState === "hammer_down"}
                className="py-3 bg-luxury-dark hover:bg-luxury-elevated border border-luxury-champagne/30 text-luxury-ivory text-xs uppercase tracking-luxury transition-all"
              >
                Trigger Fair Warning
              </button>

              <button
                onClick={handleHammerDown}
                className="py-3 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 text-xs uppercase tracking-luxury transition-all"
              >
                Simulate Gavel Drop (Sold)
              </button>
            </div>
          </div>
        </div>

        {/* Right Bidding Feed & Paddle Information */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Current Bid Display */}
          <div className="card-luxury p-6 flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">
                Current Bid on the Floor
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-bold text-luxury-gold block mt-1">
                {formatINR(currentBidPaisa)}
              </span>
            </div>

            <div className="border-t border-luxury-subtle/40 pt-3 flex justify-between text-xs text-luxury-champagne/70">
              <span>Next Asking Bid:</span>
              <span className="font-mono font-medium text-luxury-ivory">
                {formatINR(currentBidPaisa + bidIncrementPaisa)}
              </span>
            </div>
          </div>

          {/* Live Saleroom Bids History */}
          <div className="card-luxury p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-2">
              <span className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium">
                Saleroom Bid Feed
              </span>
              <span className="text-[10px] font-mono text-luxury-muted">Paddle Ledger</span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto">
              {recentBids.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-2.5 bg-luxury-dark/60 border border-luxury-subtle/30 rounded-sm text-xs"
                >
                  <div>
                    <span className="text-luxury-ivory font-medium block">{b.bidder}</span>
                    <span className="text-[10px] text-luxury-muted">{b.location} • {b.time}</span>
                  </div>
                  <span className="font-mono font-semibold text-luxury-gold">
                    {formatINR(b.amountPaisa)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
