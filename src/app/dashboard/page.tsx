"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"bids" | "won" | "watchlist" | "invoices">("bids");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Dashboard User Profile Header */}
      <div className="card-luxury p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-luxury-gold/15 border-2 border-luxury-gold flex items-center justify-center text-luxury-gold font-serif text-2xl font-bold">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl text-luxury-ivory font-medium">Vikramaditya Singhania</h1>
              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                <ShieldCheck size={10} />
                <span>Verified Collector</span>
              </span>
            </div>
            <p className="text-xs text-luxury-muted mt-1">Bidder ID: #AUC-7718 • Primary Currency: INR (₹)</p>
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
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-luxury-champagne/15 gap-8 text-xs uppercase tracking-luxury text-luxury-champagne/70">
        <button
          onClick={() => setActiveTab("bids")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors ${
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
          className={`pb-3 flex items-center gap-2 font-medium transition-colors ${
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
          className={`pb-3 flex items-center gap-2 font-medium transition-colors ${
            activeTab === "watchlist"
              ? "text-luxury-gold border-b-2 border-luxury-gold"
              : "hover:text-luxury-ivory"
          }`}
        >
          <Bookmark size={14} />
          <span>Saved Watchlist (4)</span>
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 flex items-center gap-2 font-medium transition-colors ${
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
                onClick={() => alert("Downloading GST Invoice INV-IN-2026-0042...")}
                className="px-4 py-2 bg-luxury-dark hover:bg-luxury-elevated border border-luxury-subtle text-luxury-ivory text-xs uppercase tracking-luxury flex items-center gap-1.5 transition-colors"
              >
                <Download size={14} />
                <span>Invoice</span>
              </button>
            </div>
          </div>
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
                    onClick={() => alert("Generating GST-compliant PDF invoice...")}
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
