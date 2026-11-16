"use client";

import React, { useState, useMemo } from "react";
import LotCard from "@/components/catalogue/LotCard";
import { queryListings, getCategories, getTotalListingsCount } from "@/lib/catalogueService";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from "lucide-react";

export default function CataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"ending" | "price_desc" | "price_asc">("ending");

  const categories = useMemo(() => getCategories(), []);

  // Filter & Sort using centralized catalogue service
  const sortedListings = useMemo(() => {
    return queryListings({
      categoryId: selectedCategory,
      saleFormat: selectedFormat,
      searchQuery,
      sortBy,
    });
  }, [selectedCategory, selectedFormat, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "all" || selectedFormat !== "all" || searchQuery.trim() !== "" || sortBy !== "ending";

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedFormat("all");
    setSearchQuery("");
    setSortBy("ending");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
          <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Curatorial Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          Curated Lots & Masterpieces
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl leading-relaxed">
          Explore exceptional fine art, antiquities, royal timepieces, and rare numismatics currently open for timed bidding or immediate acquisition.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 bg-luxury-dark/70 p-5 border border-luxury-champagne/20 rounded-sm shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-muted" />
            <input
              type="text"
              placeholder="Search by artist, title, provenance or period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-luxury-black border border-luxury-subtle/50 rounded-sm pl-10 pr-4 py-2.5 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-luxury-ivory"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-luxury-black border border-luxury-subtle/60 rounded-sm px-3.5 py-2.5 text-xs text-luxury-champagne focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
              aria-label="Filter by department"
            >
              <option value="all">All Departments (7)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sale Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-luxury-black border border-luxury-subtle/60 rounded-sm px-3.5 py-2.5 text-xs text-luxury-champagne focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
              aria-label="Filter by sale format"
            >
              <option value="all">All Formats</option>
              <option value="timed_auction">Timed Auction</option>
              <option value="live_auction">Live Auction Gala</option>
              <option value="hybrid_auction_buynow">Buy Now Available</option>
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-luxury-black border border-luxury-gold/50 rounded-sm px-3.5 py-2.5 text-xs text-luxury-gold focus:border-luxury-gold focus:outline-none uppercase tracking-wider font-medium"
                aria-label="Sort listings"
              >
                <option value="ending">Sort: Closing Soonest</option>
                <option value="price_desc">Price: Highest First</option>
                <option value="price_asc">Price: Lowest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata & Clear Action */}
        <div className="flex items-center justify-between text-[11px] text-luxury-muted border-t border-luxury-subtle/30 pt-3">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-luxury-ivory">{sortedListings.length}</strong> of {getTotalListingsCount()} curated lots</span>
            {hasActiveFilters && (
              <span className="text-luxury-gold font-medium">• Filters Applied</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-luxury-gold hover:text-luxury-ivory underline uppercase tracking-wider text-[10px] transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedListings.map((listing) => (
            <LotCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-luxury-dark/40 border border-luxury-subtle/40 rounded-sm flex flex-col items-center gap-4">
          <p className="font-serif text-xl text-luxury-ivory">No lots found matching your filter criteria.</p>
          <p className="text-xs text-luxury-champagne/70 max-w-sm">
            Try adjusting your department filter, clearing the search query, or selecting another auction format.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-5 py-2.5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs uppercase tracking-luxury font-semibold transition-all shadow-md"
          >
            Clear All Filters & Show Full Catalogue
          </button>
        </div>
      )}
    </div>
  );
}
