"use client";

import React, { useState, useMemo } from "react";
import LotCard from "@/components/catalogue/LotCard";
import { getAllListings, getCategories } from "@/lib/catalogueService";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const categories = useMemo(() => getCategories(), []);
  const allListings = useMemo(() => getAllListings(), []);

  const results = useMemo(() => {
    return allListings.filter((lot) => {
      // Dept filter
      if (selectedDept !== "all" && lot.category_id !== selectedDept) return false;

      // Price filter in paisa
      const price = lot.buy_now_price || lot.auction?.current_price || lot.starting_price;
      if (priceRange === "under_25l" && price > 250000000) return false;
      if (priceRange === "25l_1cr" && (price < 250000000 || price > 1000000000)) return false;
      if (priceRange === "above_1cr" && price < 1000000000) return false;

      // Text query
      if (query.trim() !== "") {
        const q = query.toLowerCase();
        const inTitle = lot.title.toLowerCase().includes(q);
        const inMaker = lot.artist_or_maker?.toLowerCase().includes(q) || false;
        const inDesc = lot.short_description.toLowerCase().includes(q);
        const inPeriod = lot.origin_period?.toLowerCase().includes(q) || false;
        const inMaterials = lot.materials?.some((m) => m.toLowerCase().includes(q)) || false;
        if (!inTitle && !inMaker && !inDesc && !inPeriod && !inMaterials) return false;
      }

      return true;
    });
  }, [query, selectedDept, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Curatorial Discovery</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          Search the Collection
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl">
          Search across artists, historical periods, materials, and categories for rare museum-grade lots.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted" />
          <input
            type="text"
            placeholder="Search by artist (e.g. M.F. Husain), period, material, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-luxury-dark border border-luxury-champagne/30 rounded-sm pl-12 pr-10 py-3.5 text-sm text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-luxury-ivory"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-champagne focus:border-luxury-gold outline-none uppercase tracking-wider"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-champagne focus:border-luxury-gold outline-none uppercase tracking-wider"
          >
            <option value="all">All Price Ranges</option>
            <option value="under_25l">Under ₹25,00,000</option>
            <option value="25l_1cr">₹25,00,000 – ₹1,00,00,000</option>
            <option value="above_1cr">Above ₹1,00,00,000</option>
          </select>

          {(selectedDept !== "all" || priceRange !== "all" || query) && (
            <button
              onClick={() => {
                setSelectedDept("all");
                setPriceRange("all");
                setQuery("");
              }}
              className="text-xs uppercase tracking-wider text-luxury-gold hover:underline ml-2"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <span className="text-xs uppercase tracking-wider text-luxury-muted">
          Showing {results.length} Matching {results.length === 1 ? "Lot" : "Lots"}
        </span>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((lot) => (
              <LotCard key={lot.id} listing={lot} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-luxury-dark/30 border border-luxury-subtle/30 rounded-sm">
            <p className="font-serif text-lg text-luxury-ivory">No matching lots found for &ldquo;{query}&rdquo;.</p>
            <p className="text-xs text-luxury-champagne/70 mt-1">Try refining your search terms or clearing active filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
