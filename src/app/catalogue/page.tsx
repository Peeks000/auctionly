"use client";

import React, { useState } from "react";
import LotCard from "@/components/catalogue/LotCard";
import { mockListings, mockCategories } from "@/lib/data/mockCatalogue";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function CataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"ending" | "price_desc" | "price_asc">("ending");

  // Filtering
  const filteredListings = mockListings.filter((listing) => {
    if (selectedCategory !== "all" && listing.category_id !== selectedCategory) {
      return false;
    }
    if (selectedFormat !== "all" && listing.sale_format !== selectedFormat) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDesc = listing.short_description.toLowerCase().includes(q);
      const matchMaker = listing.artist_or_maker?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchMaker) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Curatorial Collection</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          Curated Lots & Masterpieces
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl leading-relaxed">
          Explore exceptional paintings, antique numismatics, rare chronographs, and decorative arts currently available for timed bidding or immediate acquisition.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-luxury-dark/60 p-4 border border-luxury-champagne/15 rounded-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-muted" />
          <input
            type="text"
            placeholder="Search by artist, title, or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-luxury-black border border-luxury-subtle/50 rounded-sm pl-10 pr-4 py-2 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-champagne focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
          >
            <option value="all">All Departments (7)</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sale Format Filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-champagne focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
          >
            <option value="all">All Formats</option>
            <option value="timed_auction">Timed Auction</option>
            <option value="live_auction">Live Auction Gala</option>
            <option value="hybrid_auction_buynow">Buy Now Available</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-champagne focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
          >
            <option value="ending">Sort: Closing Soon</option>
            <option value="price_desc">Price: Highest First</option>
            <option value="price_asc">Price: Lowest First</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <LotCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-luxury-dark/30 border border-luxury-subtle/30 rounded-sm flex flex-col items-center gap-3">
          <p className="font-serif text-lg text-luxury-ivory">No lots found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedFormat("all");
              setSearchQuery("");
            }}
            className="text-xs uppercase tracking-luxury text-luxury-gold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
