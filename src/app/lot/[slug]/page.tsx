"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import ModelViewer3D from "@/components/three/ModelViewer3D";
import RazorpayCheckoutModal from "@/components/payment/RazorpayCheckoutModal";
import { mockListings } from "@/lib/data/mockCatalogue";
import { formatINR, calculateAuctionBreakdown } from "@/lib/currency";
import {
  ShieldCheck,
  Clock,
  Gavel,
  Lock,
  Bookmark,
  Share2,
  FileText,
  Truck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";

export default function LotDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Retrieve lot from catalogue; 404 if not found
  const listing = mockListings.find((l) => l.slug === slug);
  if (!listing) {
    notFound();
  }

  const auction = listing.auction;

  const [currentPrice, setCurrentPrice] = useState(auction?.current_price || listing.starting_price);
  const [bidCount, setBidCount] = useState(auction?.bid_count || 0);
  const [highBidder, setHighBidder] = useState("Heritage Patron");
  const [auctionEndTime, setAuctionEndTime] = useState<string>(
    auction?.end_time || new Date(Date.now() + 86400000).toISOString()
  );
  const [bidInput, setBidInput] = useState<string>("");
  const [biddingError, setBiddingError] = useState<string | null>(null);
  const [biddingSuccess, setBiddingSuccess] = useState<string | null>(null);
  const [antiSnipingAlert, setAntiSnipingAlert] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOrderType, setCheckoutOrderType] = useState<"buy_now" | "auction_win">("buy_now");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"provenance" | "condition" | "shipping">("provenance");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const minNextBidPaisa = currentPrice + (auction?.min_increment || 50000);

  // Sync Watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auctionly_watchlist");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(listing.id)) {
          setIsBookmarked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [listing.id]);

  const toggleWatchlist = () => {
    try {
      const saved = localStorage.getItem("auctionly_watchlist");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      let nextState = false;
      if (list.includes(listing.id)) {
        list = list.filter((id) => id !== listing.id);
        nextState = false;
      } else {
        list.push(listing.id);
        nextState = true;
      }
      localStorage.setItem("auctionly_watchlist", JSON.stringify(list));
      setIsBookmarked(nextState);
      window.dispatchEvent(new Event("storage"));
    } catch {
      setIsBookmarked(!isBookmarked);
    }
  };

  // Countdown timer based on authoritative server auctionEndTime
  useEffect(() => {
    if (!auctionEndTime) return;

    const timer = setInterval(() => {
      const diff = new Date(auctionEndTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Auction Closed");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d > 0 ? `${d}d ` : ""}${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  // Handle Authoritative Server Bidding Submission
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBiddingError(null);
    setBiddingSuccess(null);
    setAntiSnipingAlert(false);

    const enteredPaisa = Math.round(parseFloat(bidInput.replace(/,/g, "")) * 100);

    if (isNaN(enteredPaisa) || enteredPaisa < minNextBidPaisa) {
      setBiddingError(`Minimum eligible bid is ${formatINR(minNextBidPaisa)}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch current logged in user name if available
      let bidderName = "Verified Collector";
      try {
        const u = localStorage.getItem("auctionly_user");
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed?.name) bidderName = parsed.name;
        }
      } catch {
        // ignore
      }

      const res = await fetch("/api/auctions/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          slug: listing.slug,
          bidAmountPaisa: enteredPaisa,
          bidderName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place bid on server.");
      }

      setCurrentPrice(data.currentPricePaisa);
      setBidCount(data.bidCount);
      setHighBidder(data.highBidder);
      if (data.endTime) {
        setAuctionEndTime(data.endTime);
      }
      if (data.antiSnipingExtended) {
        setAntiSnipingAlert(true);
      }

      setBiddingSuccess(data.message);
      setBidInput("");
    } catch (err: any) {
      setBiddingError(err.message || "Bidding submission error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breakdown = calculateAuctionBreakdown({
    hammerPricePaisa: currentPrice,
    buyerPremiumPct: 12.0,
    gstRatePct: 18.0,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-luxury-champagne/60 uppercase tracking-luxury">
        <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/catalogue" className="hover:text-luxury-gold transition-colors">Catalogue</Link>
        <ChevronRight size={12} />
        <span className="text-luxury-gold truncate max-w-[280px]">{listing.title}</span>
      </nav>

      {/* Main Lot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: 3D Model & High-Res Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ModelViewer3D
            modelUrl={listing.model_3d_url}
            primaryImageUrl={listing.primary_image_url}
            galleryUrls={listing.gallery_image_urls}
            title={listing.title}
          />

          {/* Department Curatorial Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-luxury-dark/60 border border-luxury-champagne/15 rounded-sm text-center">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">Authenticity</span>
              <span className="text-xs text-luxury-gold font-medium flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck size={12} />
                <span>Vetted Genuine</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">Period / Date</span>
              <span className="text-xs text-luxury-ivory font-medium mt-0.5 block">{listing.origin_period}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">Condition</span>
              <span className="text-xs text-luxury-ivory font-medium mt-0.5 block">{listing.condition_grade}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">Inspection</span>
              <span className="text-xs text-luxury-champagne font-medium mt-0.5 block">Report Available</span>
            </div>
          </div>

          {/* Informational Tabs: Provenance, Condition, Shipping */}
          <div className="border border-luxury-champagne/15 rounded-sm bg-luxury-dark/40 overflow-hidden">
            <div className="flex border-b border-luxury-champagne/15">
              <button
                onClick={() => setActiveTab("provenance")}
                className={`flex-1 py-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                  activeTab === "provenance"
                    ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold"
                    : "text-luxury-champagne/70 hover:text-luxury-ivory"
                }`}
              >
                Provenance Trail
              </button>
              <button
                onClick={() => setActiveTab("condition")}
                className={`flex-1 py-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                  activeTab === "condition"
                    ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold"
                    : "text-luxury-champagne/70 hover:text-luxury-ivory"
                }`}
              >
                Condition Report
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 py-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                  activeTab === "shipping"
                    ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold"
                    : "text-luxury-champagne/70 hover:text-luxury-ivory"
                }`}
              >
                White-Glove Shipping
              </button>
            </div>

            <div className="p-6 text-xs text-luxury-champagne/90 leading-relaxed">
              {activeTab === "provenance" && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-serif text-sm text-luxury-ivory font-medium">Chain of Ownership</h4>
                  <p>{listing.provenance_history}</p>
                  <div className="mt-3 p-3 bg-luxury-black/60 border border-luxury-subtle flex items-center gap-2 text-emerald-400">
                    <ShieldCheck size={16} />
                    <span>Certified documentation inspected and held in physical escrow archive.</span>
                  </div>
                </div>
              )}

              {activeTab === "condition" && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-serif text-sm text-luxury-ivory font-medium">Specialist Examination</h4>
                  <p>{listing.condition_report}</p>
                  <div className="mt-2 text-luxury-muted">
                    Materials: {listing.materials.join(", ")}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-serif text-sm text-luxury-ivory font-medium">Delivery & Transit Security</h4>
                  <p>
                    Specialist museum packaging with climate-controlled armored courier transit across India.
                    International shipping available subject to ASI Antiquities export clearance certificates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Authoritative Bidding Engine & Purchase Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="card-luxury p-8 flex flex-col gap-6 sticky top-28">
            {/* Header: Title & Maker */}
            <div className="flex flex-col gap-2 border-b border-luxury-champagne/15 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-luxury text-luxury-gold font-medium">
                  {listing.artist_or_maker || "Rare Consignment"}
                </span>
                <button
                  onClick={toggleWatchlist}
                  aria-label="Save lot to watchlist"
                  className="p-1.5 border border-luxury-champagne/30 hover:border-luxury-gold rounded-sm transition-colors flex items-center gap-1.5 text-xs text-luxury-champagne"
                >
                  <Bookmark
                    size={14}
                    className={isBookmarked ? "fill-luxury-gold text-luxury-gold" : "text-luxury-champagne"}
                  />
                  <span className="text-[10px] uppercase tracking-wider">
                    {isBookmarked ? "Saved" : "Save Lot"}
                  </span>
                </button>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-luxury-ivory font-medium leading-snug">
                {listing.title}
              </h1>

              <div className="flex items-center justify-between text-xs text-luxury-champagne/70 pt-2">
                <span>Lot #{listing.id.replace("list-", "10")}</span>
                <span className="text-luxury-muted">•</span>
                <span>Estimate: {formatINR(listing.estimate_low || listing.starting_price)} – {formatINR(listing.estimate_high || listing.starting_price * 1.5)}</span>
              </div>
            </div>

            {/* Anti-Sniping Dynamic Extension Notice */}
            {antiSnipingAlert && (
              <div className="p-3 bg-amber-950/70 border border-amber-600 text-amber-200 text-xs flex items-center gap-2 rounded-sm animate-pulse">
                <Clock size={15} className="text-amber-400 shrink-0" />
                <span>
                  <strong>Soft-Close Extension Activated:</strong> Dynamic anti-sniping extended this auction by 3 minutes due to competitive bidding.
                </span>
              </div>
            )}

            {/* Auction Status & Current Bid */}
            <div className="bg-luxury-black/70 p-5 rounded-sm border border-luxury-subtle/50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">
                    Current Highest Bid
                  </span>
                  <span className="font-mono text-3xl font-bold text-luxury-ivory">
                    {formatINR(currentPrice)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-luxury text-luxury-muted block">Time Remaining</span>
                  <span className="font-mono text-sm font-semibold text-luxury-gold flex items-center justify-end gap-1">
                    <Clock size={13} />
                    <span>{timeLeft}</span>
                  </span>
                </div>
              </div>

              {/* Reserve Status Indicator */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-luxury-subtle/40">
                <span className="text-luxury-champagne/70">{bidCount} bids placed</span>
                {auction?.reserve_met ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Reserve Price Met</span>
                  </span>
                ) : (
                  <span className="text-luxury-muted">Reserve Price Not Yet Met</span>
                )}
              </div>

              {/* Anti-Sniping Soft-Close Advisory */}
              <div className="text-[10px] text-luxury-muted flex items-center gap-1.5 bg-luxury-dark/60 p-2 rounded-sm border border-luxury-subtle/20">
                <Info size={12} className="text-luxury-gold shrink-0" />
                <span>Anti-sniping active: Bids placed in the final 3 minutes extend the auction by 2 minutes.</span>
              </div>
            </div>

            {/* Bidding Form */}
            <form onSubmit={handlePlaceBid} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne font-medium flex justify-between">
                  <span>Your Maximum Proxy Bid</span>
                  <span className="text-luxury-muted">Min: {formatINR(minNextBidPaisa)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-champagne font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="500"
                    placeholder={`e.g. ${(minNextBidPaisa / 100).toLocaleString("en-IN")}`}
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    className="w-full bg-luxury-dark border border-luxury-champagne/30 rounded-sm pl-8 pr-4 py-3 text-luxury-ivory font-mono text-sm focus:border-luxury-gold focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-luxury-muted">
                  Your maximum proxy bid remains strictly private. The engine bids only the minimum increment necessary to maintain your lead.
                </p>
              </div>

              {biddingError && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{biddingError}</span>
                </div>
              )}

              {biddingSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>{biddingSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-goldLight disabled:opacity-50 text-luxury-black font-semibold uppercase tracking-luxury text-xs transition-all shadow-[0_8px_20px_rgba(198,166,106,0.25)] flex items-center justify-center gap-2"
              >
                <Gavel size={16} />
                <span>{isSubmitting ? "Validating Server Clocks..." : "Place Authoritative Bid"}</span>
              </button>
            </form>

            {/* Buy Now Option if lot supports fixed price */}
            {listing.buy_now_price ? (
              <div className="pt-4 border-t border-luxury-champagne/15 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-luxury-champagne uppercase tracking-luxury">Acquire Immediately</span>
                  <span className="font-mono text-base font-semibold text-luxury-ivory">{formatINR(listing.buy_now_price)}</span>
                </div>
                <button
                  onClick={() => {
                    setCheckoutOrderType("buy_now");
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-luxury-dark hover:bg-luxury-elevated border border-luxury-gold/50 text-luxury-ivory hover:text-luxury-gold font-medium uppercase tracking-luxury text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  <span>Buy Now via Razorpay (Dual-Sale Protected)</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-luxury-champagne/15 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCheckoutOrderType("auction_win");
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-2.5 bg-luxury-black hover:bg-luxury-dark border border-luxury-subtle hover:border-luxury-gold/40 text-luxury-champagne hover:text-luxury-ivory text-xs uppercase tracking-luxury transition-all flex items-center justify-center gap-2"
                >
                  <span>Instant Settle / Test Razorpay Checkout</span>
                </button>
              </div>
            )}

            {/* Transparent Financial Fee Breakdown */}
            <div className="p-4 bg-luxury-black/40 border border-luxury-subtle/30 rounded-sm text-xs text-luxury-champagne/80 flex flex-col gap-2">
              <span className="font-serif text-xs text-luxury-ivory font-medium">Estimated Purchase Breakdown</span>
              <div className="flex justify-between">
                <span>Winning Hammer:</span>
                <span className="font-mono">{formatINR(breakdown.hammerPricePaisa)}</span>
              </div>
              <div className="flex justify-between">
                <span>Buyer&apos;s Premium (12%):</span>
                <span className="font-mono">{formatINR(breakdown.buyerPremiumPaisa)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% on Premium):</span>
                <span className="font-mono">{formatINR(breakdown.totalTaxPaisa)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-luxury-subtle/30 font-semibold text-luxury-ivory">
                <span>Estimated Total (INR):</span>
                <span className="font-mono text-luxury-gold">{formatINR(breakdown.grandTotalPaisa)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Test Mode Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        listing={listing}
        orderType={checkoutOrderType}
        onSuccess={(result) => {
          setBiddingSuccess(`Payment confirmed via Razorpay (${result.paymentId}). Invoice ${result.invoiceNumber} generated.`);
        }}
      />
    </div>
  );
}
