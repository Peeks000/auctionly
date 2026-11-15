"use client";

import React, { useState } from "react";
import Link from "next/link";
import LogoWordmark from "../brand/LogoWordmark";
import { Search, Gavel, User, Bookmark, Menu, X, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-luxury-black/90 backdrop-blur-md border-b border-luxury-champagne/15 transition-all">
      {/* Top Advisory Bar */}
      <div className="bg-luxury-dark border-b border-luxury-subtle/50 px-4 py-1.5 text-center text-[10px] tracking-wider uppercase text-luxury-champagne flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>India-First Private Beta</span>
          <span className="text-luxury-subtle">•</span>
          <span className="text-luxury-muted">Authoritative INR (₹) Settlement</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/authenticity" className="hover:text-luxury-gold transition-colors flex items-center gap-1">
            <ShieldCheck size={12} className="text-luxury-gold" />
            <span>Guaranteed Provenance</span>
          </Link>
          <span className="text-luxury-subtle">•</span>
          <Link href="/studio" className="hover:text-luxury-gold transition-colors">
            Consign with Us
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <LogoWordmark showTagline monogramSize={36} />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/catalogue"
            className="text-xs uppercase tracking-luxury text-luxury-ivory/80 hover:text-luxury-gold transition-colors"
          >
            Curated Lots
          </Link>
          <Link
            href="/auctions"
            className="text-xs uppercase tracking-luxury text-luxury-ivory/80 hover:text-luxury-gold transition-colors flex items-center gap-1.5"
          >
            <span>Timed Auctions</span>
          </Link>
          <Link
            href="/live"
            className="text-xs uppercase tracking-luxury text-luxury-ivory/90 hover:text-luxury-gold transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-status-live animate-ping" />
            <span className="text-luxury-ivory font-medium">Live Gala</span>
          </Link>
          <Link
            href="/departments"
            className="text-xs uppercase tracking-luxury text-luxury-ivory/80 hover:text-luxury-gold transition-colors"
          >
            7 Departments
          </Link>
          <Link
            href="/journal"
            className="text-xs uppercase tracking-luxury text-luxury-ivory/80 hover:text-luxury-gold transition-colors"
          >
            The Journal
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            aria-label="Search Collection"
            className="p-2 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/60 rounded-sm transition-colors"
          >
            <Search size={18} />
          </Link>

          <Link
            href="/dashboard/watchlist"
            aria-label="View Watchlist"
            className="p-2 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/60 rounded-sm transition-colors"
          >
            <Bookmark size={18} />
          </Link>

          <Link
            href="/dashboard"
            aria-label="User Account"
            className="p-2 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/60 rounded-sm transition-colors"
          >
            <User size={18} />
          </Link>

          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-luxury-gold/50 text-luxury-ivory hover:bg-luxury-gold hover:text-luxury-black text-xs uppercase tracking-luxury transition-all duration-300 font-medium"
          >
            <Gavel size={14} />
            <span>Bidder Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-luxury-champagne hover:text-luxury-gold"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-luxury-dark border-t border-luxury-champagne/20 px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <Link
            href="/catalogue"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-luxury text-luxury-ivory hover:text-luxury-gold py-2 border-b border-luxury-subtle/30"
          >
            Curated Lots
          </Link>
          <Link
            href="/auctions"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-luxury text-luxury-ivory hover:text-luxury-gold py-2 border-b border-luxury-subtle/30"
          >
            Timed Auctions
          </Link>
          <Link
            href="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-luxury text-luxury-gold flex items-center justify-between py-2 border-b border-luxury-subtle/30"
          >
            <span>Live Gala Rooms</span>
            <span className="w-2 h-2 rounded-full bg-status-live animate-ping" />
          </Link>
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-luxury text-luxury-ivory hover:text-luxury-gold py-2 border-b border-luxury-subtle/30"
          >
            Seller Studio & Consignment
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm uppercase tracking-luxury text-luxury-ivory hover:text-luxury-gold py-2 border-b border-luxury-subtle/30"
          >
            Buyer Dashboard
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 text-center py-2.5 bg-luxury-gold text-luxury-black font-medium uppercase tracking-luxury text-xs"
          >
            Enter / Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
