"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/currency";
import { mockListings } from "@/lib/data/mockCatalogue";
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
} from "lucide-react";

export default function LiveAuctionRoom() {
  const lot = mockListings[2]; // Patek Philippe 2499 or Chola Bronze
  const [currentBidPaisa, setCurrentBidPaisa] = useState(3800000000); // ₹3,80,00,000
  const [bidIncrementPaisa, setBidIncrementPaisa] = useState(50000000); // ₹50,00,000
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [auctionState, setAuctionState] = useState<"bidding" | "fair_warning" | "hammer_down">("bidding");
  const [recentBids, setRecentBids] = useState<
    { id: string; bidder: string; amountPaisa: number; time: string; location: string }[]
  >([
    { id: "1", bidder: "Paddle #412", amountPaisa: 3800000000, time: "Just now", location: "Mumbai Room" },
    { id: "2", bidder: "Paddle #809", amountPaisa: 3750000000, time: "1 min ago", location: "London Phone" },
    { id: "3", bidder: "Paddle #102", amountPaisa: 3700000000, time: "2 mins ago", location: "Geneva Online" },
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
      location: "Verified Online Bidder",
    };

    setRecentBids([newBid, ...recentBids]);
    setAuctioneerMessage(`New bid accepted from online bidder at ${formatINR(nextAmount)}. Do I have another?`);
  };

  // Auctioneer Console: Fair Warning
  const handleFairWarning = () => {
    setAuctionState("fair_warning");
    setAuctioneerMessage(`Fair warning! At ${formatINR(currentBidPaisa)} for the Patek Philippe 2499... going once, going twice...`);
  };

  // Auctioneer Console: Hammer Down
  const handleHammerDown = () => {
    setAuctionState("hammer_down");
    setAuctioneerMessage(`HAMMER DOWN! Sold for ${formatINR(currentBidPaisa)} to ${recentBids[0]?.bidder || "High Bidder"}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Banner: Gala Broadcast Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-luxury-dark/90 p-4 border border-luxury-champagne/20 rounded-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-status-live text-white text-xs uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Official Live Gala Broadcast</span>
          </div>
          <span className="hidden md:inline-block text-xs text-luxury-champagne">
            The Imperial Heritage Evening Sale • Lot 12 of 34
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-luxury-champagne">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-luxury-gold" />
            <span>428 Attendees Active</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 bg-luxury-black border border-luxury-subtle hover:text-luxury-gold transition-colors"
            title="Toggle Audio Feed"
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
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                  alt="Auctioneer Presentation Lot"
                  fill
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
              <p className="text-xs text-luxury-champagne/80 mt-1 max-w-md">
                Fourth Series in 18K Yellow Gold. Preserved in museum condition with Patek Philippe archives certificate.
              </p>
            </div>

            {/* Auctioneer Speech Bubble Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-luxury-black/90 backdrop-blur-md p-4 border border-luxury-gold/40 flex items-start gap-3">
              <Gavel size={20} className="text-luxury-gold shrink-0 mt-0.5 animate-gavel-strike" />
              <div>
                <span className="text-[10px] tracking-luxury uppercase text-luxury-gold block font-semibold">
                  Auctioneer Podium
                </span>
                <p className="text-xs sm:text-sm font-serif text-luxury-ivory italic">
                  &ldquo;{auctioneerMessage}&rdquo;
                </p>
              </div>
            </div>

            {/* Fair Warning Banner */}
            {auctionState === "fair_warning" && (
              <div className="absolute top-4 left-4 right-4 bg-status-live/90 text-white p-2.5 text-center uppercase tracking-widest text-xs font-bold animate-pulse shadow-lg">
                ⚠️ Fair Warning — The Lot is About to Close!
              </div>
            )}

            {/* Hammer Down Sold Banner */}
            {auctionState === "hammer_down" && (
              <div className="absolute inset-0 bg-luxury-black/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <Gavel size={54} className="text-luxury-gold mb-4 animate-bounce" />
                <h2 className="font-serif text-4xl text-luxury-ivory font-bold tracking-tight">
                  HAMMER DOWN • SOLD
                </h2>
                <p className="font-mono text-2xl text-luxury-gold font-semibold mt-2">
                  {formatINR(currentBidPaisa)}
                </p>
                <p className="text-xs uppercase tracking-luxury text-luxury-champagne mt-2">
                  Proceeding to next sequential lot...
                </p>
              </div>
            )}
          </div>

          {/* Auctioneer Management Bar (Simulated Controls for Demonstration) */}
          <div className="bg-luxury-dark/70 border border-luxury-subtle/50 p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-luxury-champagne">
              <ShieldCheck size={16} className="text-luxury-gold" />
              <span className="uppercase tracking-luxury font-medium text-[11px]">Auctioneer Master Controls</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleFairWarning}
                disabled={auctionState === "hammer_down"}
                className="px-3 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs uppercase tracking-wider font-medium border border-amber-600/50 transition-colors"
              >
                Call Fair Warning
              </button>
              <button
                onClick={handleHammerDown}
                disabled={auctionState === "hammer_down"}
                className="px-3 py-1.5 bg-red-900/70 hover:bg-red-800 text-red-200 text-xs uppercase tracking-wider font-medium border border-red-600/50 transition-colors"
              >
                Hammer Down (Close Lot)
              </button>
            </div>
          </div>
        </div>

        {/* Right Bidding Floor & Real-Time Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="card-luxury p-6 flex flex-col gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">
                Current Floor Price
              </span>
              <span className="font-mono text-3xl font-bold text-luxury-ivory">
                {formatINR(currentBidPaisa)}
              </span>
              <span className="text-[11px] text-luxury-champagne/70 block mt-1">
                Next Ask: {formatINR(currentBidPaisa + bidIncrementPaisa)}
              </span>
            </div>

            {/* One-Click Live Bid Button */}
            <button
              onClick={handlePlaceLiveBid}
              disabled={auctionState === "hammer_down"}
              className="w-full py-4 bg-luxury-gold hover:bg-luxury-goldLight disabled:opacity-40 text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all shadow-[0_10px_25px_rgba(198,166,106,0.3)] flex items-center justify-center gap-2"
            >
              <Gavel size={18} />
              <span>Bid {formatINR(currentBidPaisa + bidIncrementPaisa)}</span>
            </button>

            {/* Live Real-Time Bids Feed */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-luxury text-luxury-champagne/80 border-b border-luxury-champagne/15 pb-2">
                <span>Real-Time Log</span>
                <span>Location</span>
              </div>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {recentBids.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-luxury-black/60 border border-luxury-subtle/30 rounded-sm flex items-center justify-between text-xs animate-fadeIn"
                  >
                    <div>
                      <span className="font-mono font-medium text-luxury-ivory block">
                        {formatINR(b.amountPaisa)}
                      </span>
                      <span className="text-[10px] text-luxury-gold">{b.bidder}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-luxury-muted block">{b.time}</span>
                      <span className="text-[10px] text-luxury-champagne/60">{b.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
