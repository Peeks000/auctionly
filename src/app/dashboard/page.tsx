"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/currency";
import { mockListings } from "@/lib/data/mockCatalogue";
import {
  Gavel,
  Trophy,
  Bookmark,
  FileText,
  Truck,
  ShieldCheck,
  User,
  Clock,
  Download,
  LogOut,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"bids" | "won" | "watchlist" | "invoices">("bids");
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    tier: string;
    isDemo: boolean;
    kycVerified: boolean;
  }>({
    name: "Vikramaditya Singhania",
    email: "vikramaditya@singhania-heritage.in",
    tier: "Grand Collector",
    isDemo: true,
    kycVerified: true,
  });

  const [watchlistCount, setWatchlistCount] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auctionly_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUserProfile({
          name: u.name || "Collector Patron",
          email: u.email || "collector@auctionly.in",
          tier: u.tier || "Active Bidder",
          isDemo: u.role === "vip_collector" && u.id === "usr_vip_001",
          kycVerified: !!u.kycVerified,
        });
      }

      const savedWatchlist = localStorage.getItem("auctionly_watchlist");
      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);
        if (Array.isArray(parsed)) setWatchlistCount(parsed.length);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("auctionly_user");
    setUserProfile({
      name: "Guest Collector",
      email: "guest@auctionly.in",
      tier: "Unauthenticated Guest",
      isDemo: false,
      kycVerified: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Dashboard User Profile Header */}
      <div className="card-luxury p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {userProfile.isDemo && (
          <div className="absolute top-0 right-0 bg-amber-950/80 border-b border-l border-amber-800/80 px-3 py-1 text-[10px] uppercase tracking-wider text-amber-200">
            Demonstration Collector Profile
          </div>
        )}

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-luxury-gold/15 border-2 border-luxury-gold flex items-center justify-center text-luxury-gold font-serif text-2xl font-bold uppercase shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl text-luxury-ivory font-medium">{userProfile.name}</h1>
              {userProfile.kycVerified ? (
                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                  <ShieldCheck size={10} />
                  <span>KYC Verified</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-luxury-dark border border-luxury-subtle text-luxury-muted text-[10px] uppercase tracking-wider">
                  Pending KYC
                </span>
              )}
            </div>
            <p className="text-xs text-luxury-muted mt-1">
              {userProfile.email} • {userProfile.tier} • INR (₹) Authoritative Settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="px-4 py-2 bg-luxury-black/60 border border-luxury-subtle/40 rounded-sm">
            <span className="text-lg font-mono font-semibold text-luxury-ivory block">2</span>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Active Bids</span>
          </div>
          <div className="px-4 py-2 bg-luxury-black/60 border border-luxury-subtle/40 rounded-sm">
            <span className="text-lg font-mono font-semibold text-luxury-gold block">1</span>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Won Lots</span>
          </div>
          <Link
            href="/auth/login"
            className="p-2 border border-luxury-champagne/20 hover:border-luxury-gold text-luxury-champagne hover:text-luxury-gold transition-colors"
            title="Switch or Sign In to Account"
          >
            <User size={16} />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-luxury-champagne/15 gap-8 text-xs uppercase tracking-luxury text-luxury-champagne/70 overflow-x-auto">
        <button
          onClick={() => setActiveTab("bids")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors shrink-0 ${
            activeTab === "bids"
              ? "text-luxury-gold border-b-2 border-luxury-gold"
              : "hover:text-luxury-ivory"
          }`}
        >
          <Gavel size={14} />
          <span>Active Bids (2)</span>
        </button>
        <button
          onClick={() => setActiveTab("won")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors shrink-0 ${
            activeTab === "won"
              ? "text-luxury-gold border-b-2 border-luxury-gold"
              : "hover:text-luxury-ivory"
          }`}
        >
          <Trophy size={14} />
          <span>Won Auctions (1)</span>
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors shrink-0 ${
            activeTab === "watchlist"
              ? "text-luxury-gold border-b-2 border-luxury-gold"
              : "hover:text-luxury-ivory"
          }`}
        >
          <Bookmark size={14} />
          <span>Saved Watchlist ({watchlistCount})</span>
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors shrink-0 ${
            activeTab === "invoices"
              ? "text-luxury-gold border-b-2 border-luxury-gold"
              : "hover:text-luxury-ivory"
          }`}
        >
          <FileText size={14} />
          <span>GST Invoices & Orders</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "bids" && (
        <div className="flex flex-col gap-4">
          <div className="card-luxury p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-luxury-dark rounded-sm relative overflow-hidden shrink-0">
                <img
                  src={mockListings[0].primary_image_url}
                  alt={mockListings[0].title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold">Lot #104 • Timed Auction</span>
                <h3 className="font-serif text-base text-luxury-ivory font-medium mt-0.5">
                  {mockListings[0].title}
                </h3>
                <span className="text-xs text-luxury-champagne/80 font-mono mt-1 block">
                  Your High Bid: {formatINR(480000000)} (Winning Lead)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-medium">
                High Bidder
              </span>
              <Link
                href={`/lot/${mockListings[0].slug}`}
                className="px-4 py-2 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black text-xs uppercase tracking-luxury transition-colors"
              >
                View Lot
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === "won" && (
        <div className="flex flex-col gap-4">
          <div className="card-luxury p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-luxury-dark rounded-sm relative overflow-hidden shrink-0">
                <img
                  src={mockListings[4].primary_image_url}
                  alt={mockListings[4].title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-emerald-400">Hammer Fall Winner</span>
                <h3 className="font-serif text-base text-luxury-ivory font-medium mt-0.5">
                  {mockListings[4].title}
                </h3>
                <span className="text-xs text-luxury-champagne/80 font-mono mt-1 block">
                  Final Hammer: {formatINR(115000000)} • Payment Settled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-luxury-champagne flex items-center gap-1.5">
                <Truck size={14} className="text-luxury-gold" />
                <span>In Armored Transit</span>
              </span>
              <button
                onClick={() => alert("Downloading official tax invoice INV-IN-2026-0042...")}
                className="px-4 py-2 bg-luxury-dark hover:bg-luxury-elevated border border-luxury-subtle text-luxury-ivory text-xs uppercase tracking-luxury flex items-center gap-1.5 transition-colors"
              >
                <Download size={14} />
                <span>Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "watchlist" && (
        <div className="card-luxury p-8 text-center flex flex-col items-center gap-4">
          <Bookmark size={32} className="text-luxury-gold" />
          <h3 className="font-serif text-xl text-luxury-ivory">Saved Masterpieces</h3>
          <p className="text-xs text-luxury-champagne/70 max-w-md">
            You have {watchlistCount} lots saved in your collector watchlist.
          </p>
          <Link
            href="/dashboard/watchlist"
            className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all flex items-center gap-2"
          >
            <span>Open Dedicated Watchlist View</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="card-luxury p-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-luxury-champagne/15 text-luxury-champagne uppercase tracking-wider">
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Lot Title</th>
                <th className="pb-3">Taxable Value</th>
                <th className="pb-3">GST (18%)</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-subtle/30 text-luxury-champagne/80">
              <tr>
                <td className="py-3 font-mono font-medium text-luxury-ivory">INV-IN-2026-0042</td>
                <td className="py-3">12 Nov 2026</td>
                <td className="py-3 font-serif text-luxury-ivory max-w-[200px] truncate">{mockListings[4].title}</td>
                <td className="py-3 font-mono">{formatINR(115000000)}</td>
                <td className="py-3 font-mono">{formatINR(2484000)}</td>
                <td className="py-3 font-mono font-semibold text-luxury-gold">{formatINR(131324000)}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => alert("Downloading GST Tax Invoice for INV-IN-2026-0042...")}
                    className="p-1.5 text-luxury-gold hover:text-luxury-ivory transition-colors"
                    title="Download GST Invoice"
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
