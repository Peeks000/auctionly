"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import LogoWordmark from "../brand/LogoWordmark";
import {
  ShieldCheck,
  Award,
  Lock,
  Landmark,
  Mail,
  ArrowRight,
  ArrowUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Globe,
  Compass,
} from "lucide-react";

// Dynamically import 3D Mascot viewer with SSR disabled for optimal WebGL performance
const MascotViewer3D = dynamic(
  () => import("@/components/three/MascotViewer3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] sm:h-[460px] md:h-[480px] rounded-lg border border-luxury-gold/30 bg-[#0A0907] flex flex-col items-center justify-center p-6 text-center shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
        <div className="relative w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border border-luxury-gold/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-luxury-gold animate-spin" />
        </div>
        <span className="text-xs font-serif tracking-[0.25em] text-luxury-gold uppercase font-medium">
          Loading 3D Mascot Stage
        </span>
        <span className="text-[10px] text-luxury-champagne/60 mt-1 tracking-wider">
          Initializing museum WebGL environment...
        </span>
      </div>
    ),
  }
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
    }, 600);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scrollToFooter = () => {
        if (window.location.hash === "#footer") {
          const el = document.getElementById("footer");
          if (el) {
            el.scrollIntoView({ behavior: "auto" });
          }
        }
      };
      scrollToFooter();
      const timer = setTimeout(scrollToFooter, 350);
      window.addEventListener("hashchange", scrollToFooter);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("hashchange", scrollToFooter);
      };
    }
  }, []);

  return (
    <footer
      id="footer"
      data-testid="auctionly-footer"
      className="relative bg-[#070605] border-t border-luxury-gold/30 text-luxury-muted mt-24 overflow-hidden"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(198,166,106,0.12)_0%,transparent_75%)] pointer-events-none" />

      {/* =====================================================================
          SECTION 1: THE 4 PILLARS OF CURATORIAL INTEGRITY (REIMAGINED)
         ===================================================================== */}
      <div
        data-testid="curatorial-pillars"
        className="relative border-b border-luxury-gold/20 bg-gradient-to-b from-[#0D0B08]/90 via-[#0A0907]/95 to-[#070605] py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2.5">
              <Sparkles size={12} className="text-luxury-gold animate-pulse" />
              <span>The AUCTIONLY Curatorial Standard</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-luxury-ivory font-light tracking-[0.08em] uppercase">
              Institutional Integrity &amp; Sovereign Protection
            </h3>
          </div>

          {/* 4 Elevated Luxury Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1: Curatorial Authenticity */}
            <div
              data-testid="pillar-authenticity"
              className="group relative bg-[#0D0B08]/80 hover:bg-[#120F0B] border border-luxury-gold/20 hover:border-luxury-gold/60 p-5 rounded-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(198,166,106,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-serif tracking-[0.25em] text-luxury-gold/70 font-semibold">
                    I &bull; AUTHENTICITY
                  </span>
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <h4 className="font-serif text-sm text-luxury-ivory font-medium tracking-wide mb-1.5 group-hover:text-luxury-gold transition-colors">
                  Curatorial Authenticity
                </h4>
                <p className="text-[11px] text-luxury-champagne/70 leading-relaxed">
                  Every lot physically examined, vetted, and provenance-verified by certified department specialists and conservators.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-gold/15 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-luxury-gold/80 font-medium">
                <CheckCircle2 size={11} className="text-luxury-gold" />
                <span>100% Provenance Guaranteed</span>
              </div>
            </div>

            {/* Pillar 2: Authoritative Escrow */}
            <div
              data-testid="pillar-escrow"
              className="group relative bg-[#0D0B08]/80 hover:bg-[#120F0B] border border-luxury-gold/20 hover:border-luxury-gold/60 p-5 rounded-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(198,166,106,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-serif tracking-[0.25em] text-luxury-gold/70 font-semibold">
                    II &bull; ESCROW
                  </span>
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                    <Lock size={18} />
                  </div>
                </div>
                <h4 className="font-serif text-sm text-luxury-ivory font-medium tracking-wide mb-1.5 group-hover:text-luxury-gold transition-colors">
                  Authoritative Escrow
                </h4>
                <p className="text-[11px] text-luxury-champagne/70 leading-relaxed">
                  Razorpay institutional settlement safeguards with held escrow reserve release until buyer physical delivery sign-off.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-gold/15 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-luxury-gold/80 font-medium">
                <CheckCircle2 size={11} className="text-luxury-gold" />
                <span>Sovereign Settlement Security</span>
              </div>
            </div>

            {/* Pillar 3: White-Glove Shipping */}
            <div
              data-testid="pillar-shipping"
              className="group relative bg-[#0D0B08]/80 hover:bg-[#120F0B] border border-luxury-gold/20 hover:border-luxury-gold/60 p-5 rounded-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(198,166,106,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-serif tracking-[0.25em] text-luxury-gold/70 font-semibold">
                    III &bull; LOGISTICS
                  </span>
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                    <Award size={18} />
                  </div>
                </div>
                <h4 className="font-serif text-sm text-luxury-ivory font-medium tracking-wide mb-1.5 group-hover:text-luxury-gold transition-colors">
                  White-Glove Shipping
                </h4>
                <p className="text-[11px] text-luxury-champagne/70 leading-relaxed">
                  Museum-grade bespoke crating, bonded domestic courier network, GPS transit tracking, and full fine-art insurance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-gold/15 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-luxury-gold/80 font-medium">
                <CheckCircle2 size={11} className="text-luxury-gold" />
                <span>Tracked &amp; Insured Transit</span>
              </div>
            </div>

            {/* Pillar 4: GST Invoicing */}
            <div
              data-testid="pillar-gst"
              className="group relative bg-[#0D0B08]/80 hover:bg-[#120F0B] border border-luxury-gold/20 hover:border-luxury-gold/60 p-5 rounded-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(198,166,106,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-serif tracking-[0.25em] text-luxury-gold/70 font-semibold">
                    IV &bull; GOVERNANCE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                    <Landmark size={18} />
                  </div>
                </div>
                <h4 className="font-serif text-sm text-luxury-ivory font-medium tracking-wide mb-1.5 group-hover:text-luxury-gold transition-colors">
                  GST Invoicing &amp; Audit
                </h4>
                <p className="text-[11px] text-luxury-champagne/70 leading-relaxed">
                  Compliant Indian tax reporting, valid GST e-invoices, and permanent institutional provenance certificates under ASI Act 1972.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-luxury-gold/15 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-luxury-gold/80 font-medium">
                <CheckCircle2 size={11} className="text-luxury-gold" />
                <span>Statutory Tax &amp; ASI Adherent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: GRAND MAISON SHOWCASE WITH 3D MASCOT INTEGRATION
         ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* -----------------------------------------------------------------
              LEFT COLUMN (4 Cols): Brand Heritage, Live Beacon & VIP Circle
             ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LogoWordmark showTagline monogramSize={42} />

            <p className="text-xs text-luxury-champagne/85 leading-relaxed font-light">
              AUCTIONLY is India’s premier digital auction house, uniting museum-grade fine art, monumental bronzes, rare horology, and high-value collectibles through authoritative INR settlement and guaranteed curatorial provenance.
            </p>

            {/* Live Curatorial Status Beacon */}
            <div className="p-3.5 rounded-md bg-[#0D0B08] border border-luxury-gold/25 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-luxury-ivory">
                  Live Curatorial Desks Active
                </span>
              </div>
              <div className="text-[10px] text-luxury-champagne/70 flex items-center gap-2">
                <Globe size={11} className="text-luxury-gold shrink-0" />
                <span>Authoritative Currency: <span className="text-luxury-gold font-medium">INR (₹)</span> &bull; Mumbai / New Delhi</span>
              </div>
            </div>

            {/* VIP Collector Circle Newsletter */}
            <div className="p-4 rounded-md bg-[#0D0B08]/90 border border-luxury-gold/30 shadow-md">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={13} className="text-luxury-gold" />
                <h5 className="text-[11px] uppercase tracking-[0.2em] font-serif text-luxury-gold font-medium">
                  Private Curatorial Circle
                </h5>
              </div>
              <p className="text-[10px] text-luxury-champagne/70 leading-relaxed mb-3">
                Receive confidential marquee lot notifications, private treaty previews, and specialist condition reports.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 p-2 bg-luxury-gold/15 border border-luxury-gold/40 rounded text-luxury-gold text-xs">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Your curatorial request has been recorded.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter confidential email..."
                    required
                    className="flex-1 bg-[#050504] border border-luxury-gold/30 focus:border-luxury-gold rounded px-3 py-2 text-xs text-luxury-ivory focus:outline-none placeholder-luxury-champagne/40"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    data-cursor="JOIN"
                    className="px-3.5 py-2 bg-luxury-gold hover:bg-luxury-goldLight text-[#0A0907] font-semibold text-xs tracking-wider uppercase rounded transition-all duration-200 shrink-0 flex items-center gap-1 active:scale-95"
                    aria-label="Join Collector Circle"
                  >
                    <span>{submitting ? "..." : "Join"}</span>
                    <ArrowRight size={12} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              CENTER COLUMN (4 Cols): 3D MASCOT INTERACTIVE EXHIBITION STAGE
             ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full">
              <div className="text-center mb-3">
                <span className="text-[10px] tracking-[0.25em] uppercase text-luxury-gold font-serif font-medium">
                  Official 3D Mascot Showcase
                </span>
                <p className="text-[11px] text-luxury-champagne/70 mt-0.5">
                  Interactive real-time 3D model with continuous levitation &amp; cursor tracking
                </p>
              </div>

              {/* The 3D Canvas Stage */}
              <MascotViewer3D modelUrl="/3D-element/auctionly-mascot.glb" />
            </div>
          </div>

          {/* -----------------------------------------------------------------
              RIGHT COLUMN (4 Cols): Curated Department & Client Directory
             ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* Sub-col 1: Departments */}
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-serif text-luxury-ivory font-medium mb-3.5 pb-1 border-b border-luxury-gold/25">
                Departments
              </h5>
              <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/75 font-light">
                <li>
                  <Link href="/departments/fine-art" className="hover:text-luxury-gold transition-colors">
                    Fine Art
                  </Link>
                </li>
                <li>
                  <Link href="/departments/sculptures" className="hover:text-luxury-gold transition-colors">
                    Sculptures
                  </Link>
                </li>
                <li>
                  <Link href="/departments/antiques" className="hover:text-luxury-gold transition-colors">
                    Antiques
                  </Link>
                </li>
                <li>
                  <Link href="/departments/numismatics" className="hover:text-luxury-gold transition-colors">
                    Coins &amp; Notes
                  </Link>
                </li>
                <li>
                  <Link href="/departments/watches-jewellery" className="hover:text-luxury-gold transition-colors">
                    Watches
                  </Link>
                </li>
                <li>
                  <Link href="/departments/rare-books" className="hover:text-luxury-gold transition-colors">
                    Rare Books
                  </Link>
                </li>
                <li>
                  <Link href="/departments/vintage-design" className="hover:text-luxury-gold transition-colors">
                    Vintage Design
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sub-col 2: Services */}
            <div>
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-serif text-luxury-ivory font-medium mb-3.5 pb-1 border-b border-luxury-gold/25">
                Services
              </h5>
              <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/75 font-light">
                <li>
                  <Link href="/studio" className="hover:text-luxury-gold transition-colors">
                    Consign with Us
                  </Link>
                </li>
                <li>
                  <Link href="/studio/valuation" className="hover:text-luxury-gold transition-colors">
                    Valuations
                  </Link>
                </li>
                <li>
                  <Link href="/live" className="hover:text-luxury-gold transition-colors">
                    Live Gala
                  </Link>
                </li>
                <li>
                  <Link href="/authenticity" className="hover:text-luxury-gold transition-colors">
                    Provenance
                  </Link>
                </li>
                <li>
                  <Link href="/private-sales" className="hover:text-luxury-gold transition-colors">
                    Advisory
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-luxury-gold transition-colors">
                    White-Glove
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sub-col 3: Governance */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-1">
              <h5 className="text-[11px] uppercase tracking-[0.2em] font-serif text-luxury-ivory font-medium mb-3.5 pb-1 border-b border-luxury-gold/25">
                Governance
              </h5>
              <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/75 font-light">
                <li>
                  <Link href="/policies/terms" className="hover:text-luxury-gold transition-colors">
                    Terms of Sale
                  </Link>
                </li>
                <li>
                  <Link href="/policies/buyer-agreement" className="hover:text-luxury-gold transition-colors">
                    Buyer Premium
                  </Link>
                </li>
                <li>
                  <Link href="/policies/seller-agreement" className="hover:text-luxury-gold transition-colors">
                    Consignment
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy" className="hover:text-luxury-gold transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/authenticity" className="hover:text-luxury-gold transition-colors">
                    Authenticity
                  </Link>
                </li>
                <li>
                  <Link href="/policies/restricted" className="hover:text-luxury-gold transition-colors">
                    ASI Act 1972
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: BOTTOM STATUTORY NOTICE & BACK TO SUMMIT
         ===================================================================== */}
      <div className="border-t border-luxury-gold/20 bg-[#050504] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[10px] tracking-wider text-luxury-muted font-light">
            &copy; 2026 AUCTIONLY Curatorial House. All rights reserved. Private Beta Edition.
            <span className="block sm:inline sm:ml-2 text-luxury-champagne/50">
              Operating under standard Indian commercial laws and Reserve Bank of India (RBI) escrow guidelines.
            </span>
          </p>

          <button
            onClick={scrollToTop}
            data-cursor="TOP"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-luxury-gold/30 hover:border-luxury-gold bg-[#0A0907] text-luxury-champagne hover:text-luxury-gold text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
            aria-label="Scroll back to top"
          >
            <span>Back to Summit</span>
            <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;