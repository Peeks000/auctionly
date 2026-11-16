"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LotCard } from "@/components/catalogue/LotCard";
import { getAllListings } from "@/lib/catalogueService";
import { Listing, Auction } from "@/types";
import {
  Bookmark,
  ArrowLeft,
  Search,
  Sparkles,
  Gavel,
  ShieldCheck,
  Compass,
} from "lucide-react";

export default function WatchlistPage() {
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [savedLots, setSavedLots] = useState<(Listing & { auction?: Auction })[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with localStorage
  const loadWatchlist = () => {
    try {
      const saved = localStorage.getItem("auctionly_watchlist");
      const ids: string[] = saved ? JSON.parse(saved) : [];
      setWatchlistIds(ids);

      const matched = getAllListings().filter((l) => ids.includes(l.id));
      setSavedLots(matched);
    } catch {
      setSavedLots([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadWatchlist();

    const handleStorageChange = () => {
      loadWatchlist();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClearWatchlist = () => {
    if (confirm("Remove all saved lots from your watchlist?")) {
      localStorage.setItem("auctionly_watchlist", JSON.stringify([]));
      loadWatchlist();
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-luxury-champagne/15">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-gold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Collector Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-luxury-muted">
            <ShieldCheck size={14} className="text-luxury-gold" />
            <span>Private Bidder Watchlist</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-sm bg-luxury-dark border border-luxury-gold/40 text-luxury-gold">
                <Bookmark size={16} />
              </span>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
                Saved Masterpieces
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-light">
              Collector Watchlist
            </h1>
            <p className="text-xs text-luxury-champagne/70 mt-1 max-w-xl">
              Track active bids, timed hammer closures, and reserve statuses for your shortlisted museum lots.
            </p>
          </div>

          {savedLots.length > 0 && (
            <button
              onClick={handleClearWatchlist}
              className="text-xs uppercase tracking-luxury text-luxury-muted hover:text-red-400 border border-luxury-subtle px-3 py-1.5 hover:border-red-900 transition-colors"
            >
              Clear Watchlist ({savedLots.length})
            </button>
          )}
        </div>

        {/* Content View */}
        {!isLoaded ? (
          <div className="py-24 text-center text-luxury-muted text-xs">
            Loading your collector watchlist...
          </div>
        ) : savedLots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedLots.map((lot) => (
              <LotCard key={lot.id} listing={lot} />
            ))}
          </div>
        ) : (
          <div className="bg-luxury-dark/40 border border-luxury-champagne/15 rounded-sm p-12 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-black border border-luxury-gold/30 flex items-center justify-center text-luxury-gold">
              <Compass size={28} />
            </div>
            <h2 className="font-serif text-xl text-luxury-ivory font-normal mb-2">
              Your Watchlist is Currently Empty
            </h2>
            <p className="text-xs text-luxury-champagne/70 max-w-md mx-auto mb-8 leading-relaxed">
              Bookmark lots from our curated sales to receive closing alerts, monitor competing proxy bids, and request provenance dossiers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalogue"
                className="py-3 px-6 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs uppercase tracking-luxury font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Search size={14} />
                <span>Explore Curated Catalogue</span>
              </Link>
              <Link
                href="/auctions"
                className="py-3 px-6 bg-luxury-black hover:bg-luxury-dark border border-luxury-champagne/30 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-luxury font-medium transition-all flex items-center justify-center gap-2"
              >
                <Gavel size={14} />
                <span>Browse Timed Auctions</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
