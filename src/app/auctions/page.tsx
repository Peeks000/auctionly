"use client";

import React, { useState } from "react";
import LotCard from "@/components/catalogue/LotCard";
import { getAllListings, getCategories } from "@/lib/catalogueService";
import { Gavel, Clock, Sparkles, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AuctionsPage() {
  const [selectedDept, setSelectedDept] = useState("all");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "closing_soon">("all");

  const categories = getCategories();
  const timedLots = getAllListings().filter((l) => l.auction && !l.auction.is_live);

  const filteredLots = timedLots.filter((lot) => {
    if (selectedDept !== "all" && lot.category_id !== selectedDept) return false;
    if (filterMode === "active" && lot.auction?.status !== "active") return false;
    if (filterMode === "closing_soon") {
      const hoursLeft =
        (new Date(lot.auction?.end_time || "").getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursLeft > 24) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-gold font-medium">
          <Gavel size={14} />
          <span>Authoritative Timed Auctions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          Current Timed Auctions
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl leading-relaxed">
          Bids are governed strictly by authoritative server clocks with dynamic anti-sniping soft-close protection. Maximum proxy bids remain strictly confidential.
        </p>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-luxury-dark/60 p-4 border border-luxury-champagne/15 rounded-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-luxury-muted uppercase tracking-wider mr-2">Status:</span>
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-colors ${
              filterMode === "all" ? "bg-luxury-gold text-luxury-black font-semibold" : "text-luxury-champagne/70 hover:text-luxury-ivory"
            }`}
          >
            All Timed Lots ({timedLots.length})
          </button>
          <button
            onClick={() => setFilterMode("active")}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-colors ${
              filterMode === "active" ? "bg-luxury-gold text-luxury-black font-semibold" : "text-luxury-champagne/70 hover:text-luxury-ivory"
            }`}
          >
            Active Bidding
          </button>
          <button
            onClick={() => setFilterMode("closing_soon")}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-colors ${
              filterMode === "closing_soon" ? "bg-luxury-gold text-luxury-black font-semibold" : "text-luxury-champagne/70 hover:text-luxury-ivory"
            }`}
          >
            Closing Within 24h
          </button>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-1.5 text-xs text-luxury-champagne focus:border-luxury-gold outline-none uppercase tracking-wider"
        >
          <option value="all">All Departments</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLots.map((listing) => (
            <LotCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-luxury-dark/30 border border-luxury-subtle/30 rounded-sm">
          <p className="font-serif text-lg text-luxury-ivory">No timed lots match the selected filter criteria.</p>
          <button
            onClick={() => {
              setSelectedDept("all");
              setFilterMode("all");
            }}
            className="mt-3 text-xs uppercase tracking-luxury text-luxury-gold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
