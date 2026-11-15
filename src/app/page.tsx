import React from "react";
import Link from "next/link";
import Image from "next/image";
import LotCard from "@/components/catalogue/LotCard";
import MonogramA from "@/components/brand/MonogramA";
import { mockListings, mockCategories } from "@/lib/data/mockCatalogue";
import {
  Gavel,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Award,
  ChevronRight,
  Lock,
  Layers,
  Gem,
  Landmark,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const featuredLots = mockListings.filter((l) => l.is_featured);
  const endingSoonLots = mockListings.filter((l) => l.auction?.status === "active");
  const liveLots = mockListings.filter((l) => l.auction?.is_live);
  const buyNowLots = mockListings.filter((l) => l.buy_now_price !== null);

  return (
    <div className="flex flex-col gap-24 pb-20 bg-[#000000]">
      {/* ====================================================================
          SECTION 1: THE GRAND GALLERY HERO (EXACT REFERENCE RECREATION)
         ==================================================================== */}
      <section className="relative w-full h-[100svh] min-h-[680px] max-h-[1200px] bg-[#000000] flex flex-col justify-between items-center overflow-hidden border-b border-luxury-champagne/15 select-none">
        {/* Layer 1: Base Museum Gallery Backdrop Plate (Exact reference asset from public/images/) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/auctionly-hero-gallery.png"
            alt="AUCTIONLY Classical Museum Gallery with Greco-Roman Bust"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-center animate-fadeIn duration-1000 transform scale-100"
          />
        </div>

        {/* Layer 2: Atmospheric Lighting & Volumetric Rays (Entering from top-right across bust) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(225deg,rgba(255,225,160,0.14)_0%,rgba(212,175,55,0.05)_26%,transparent_60%)] mix-blend-screen" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

        {/* Layer 3: Edge Vignettes (Subtle gradient overlays for pristine readability while preserving lighting) */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#000000]/85 via-[#000000]/45 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#000000]/60 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#000000]/60 to-transparent pointer-events-none z-10" />

        {/* Top Content: Main Headline & Tagline */}
        <div className="relative z-20 text-center pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] tracking-[0.22em] sm:tracking-[0.28em] text-[#F7F3EB] uppercase font-normal leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            AUCTIONLY
          </h1>
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3 sm:gap-6 w-full max-w-md sm:max-w-lg">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-luxury-gold/70" />
            <span className="font-serif text-[11px] sm:text-xs md:text-sm tracking-[0.35em] sm:tracking-[0.42em] uppercase text-luxury-champagne/95 whitespace-nowrap font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              A Curated Auction House
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-luxury-gold/70" />
          </div>
        </div>

        {/* Center: Interactive Call-To-Action Buttons (Positioned directly beneath the sculpture on plinth) */}
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 my-auto pt-48 sm:pt-60 md:pt-72 lg:pt-80">
          <Link
            href="/catalogue"
            className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-[#C6A66A] hover:bg-[#D4AF37] text-[#0A0907] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(198,166,106,0.35)] hover:shadow-[0_12px_32px_rgba(198,166,106,0.5)] flex items-center gap-2.5 active:scale-[0.98]"
          >
            <Gavel size={15} className="text-[#0A0907]" />
            <span>Explore Lots</span>
            <ArrowRight size={14} className="text-[#0A0907] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/live"
            className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-black/60 hover:bg-black/85 border border-luxury-gold/70 hover:border-luxury-gold text-luxury-ivory font-medium text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2.5 active:scale-[0.98]"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Live Auctions</span>
            <ArrowRight size={14} className="text-luxury-gold transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bottom Content: Trust Indicators & Scroll Indicator */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-5 sm:pb-7 flex flex-col items-center gap-4 sm:gap-5">
          {/* Trust Indicators Row with Subtle Vertical Gold Dividers */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center justify-center divide-y lg:divide-y-0 lg:divide-x divide-luxury-gold/25 py-3 border-y border-luxury-gold/25 bg-black/40 backdrop-blur-[2px]">
            <div className="flex items-center justify-center gap-2.5 py-2 sm:py-1.5 px-3 text-center">
              <ShieldCheck size={16} className="text-luxury-gold shrink-0" />
              <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.18em] uppercase text-luxury-ivory/90 font-medium">
                Verified Provenance
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-2 sm:py-1.5 px-3 text-center">
              <Gem size={16} className="text-luxury-gold shrink-0" />
              <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.18em] uppercase text-luxury-ivory/90 font-medium">
                Curated Collections
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-2 sm:py-1.5 px-3 text-center">
              <Landmark size={16} className="text-luxury-gold shrink-0" />
              <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.18em] uppercase text-luxury-ivory/90 font-medium">
                Specialist Departments
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 py-2 sm:py-1.5 px-3 text-center">
              <Globe size={16} className="text-luxury-gold shrink-0" />
              <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.18em] uppercase text-luxury-ivory/90 font-medium">
                India&apos;s Private Auction House
              </span>
            </div>
          </div>

          {/* Scroll to Discover linked to #featured-auctions */}
          <Link
            href="#featured-auctions"
            className="flex flex-col items-center gap-1.5 pt-1 group cursor-pointer focus:outline-none"
            aria-label="Scroll to Discover Featured Auctions"
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-luxury-champagne/75 group-hover:text-luxury-gold transition-colors font-light">
              Scroll to Discover
            </span>
            <div className="w-[1px] h-7 sm:h-9 bg-gradient-to-b from-luxury-gold via-luxury-gold/50 to-transparent animate-pulse group-hover:h-11 transition-all" />
          </Link>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: FEATURED TIMED AUCTIONS (AUTHORITATIVE ENGINE)
         ==================================================================== */}
      <section id="featured-auctions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 pb-4 border-b border-luxury-champagne/15 gap-4">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-luxury mb-1">
              <Sparkles size={14} />
              <span>Marquee Offerings</span>
            </div>
            <h2 className="font-serif text-3xl text-luxury-ivory font-medium">
              Featured Auctions
            </h2>
          </div>
          <Link
            href="/auctions"
            className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-gold flex items-center gap-1.5 transition-colors"
          >
            <span>View All Active Lots</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredLots.map((listing, index) => (
            <LotCard key={listing.id} listing={listing} priority={index === 0} />
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: LIVE GALA ROOM PREVIEW
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-sm bg-gradient-to-r from-luxury-dark via-luxury-charcoal to-luxury-dark border border-luxury-gold/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-status-live/20 border border-status-live text-status-live text-[10px] uppercase tracking-wider font-semibold w-fit">
                <span className="w-2 h-2 rounded-full bg-status-live animate-ping" />
                <span>Next Scheduled Live Gala</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium leading-tight">
                The Imperial Heritage Evening Sale
              </h2>

              <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans leading-relaxed max-w-xl">
                Experience real-time interactive hammer bidding with our certified Professional Auctioneer.
                Featuring royal Rajputana jewels, Mughal numismatic rarities, and Chola bronzes.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-luxury-champagne">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-luxury-gold" />
                  <span>Sunday Gala, 7:00 PM IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gavel size={16} className="text-luxury-gold" />
                  <span>34 Sequential Lots</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/live"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold hover:bg-luxury-goldLight text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all"
                >
                  <Gavel size={14} />
                  <span>Enter Live Auction Room</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 rounded-sm overflow-hidden border border-luxury-champagne/20">
              <Image
                src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80"
                alt="Marquee Lot Somaskanda Bronze"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] tracking-widest uppercase text-luxury-champagne/80 block">Lot 14 Marquee</span>
                <span className="font-serif text-sm text-luxury-ivory font-medium">Chola Dynasty Somaskanda Bronze (11th Century)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: THE 7 SPECIALIST DEPARTMENTS
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-luxury text-luxury-gold">Curatorial Taxonomy</span>
          <h2 className="font-serif text-3xl text-luxury-ivory font-medium mt-1">
            The 7 Specialist Departments
          </h2>
          <p className="text-xs text-luxury-champagne/70 mt-2">
            Each category is governed by independent authenticity standards, certified provenance requirements, and vetted condition ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/departments/${cat.slug}`}
              className="card-luxury p-6 flex flex-col justify-between group hover:border-luxury-gold/50 transition-all duration-300"
            >
              <div>
                <span className="text-[10px] font-mono text-luxury-gold/80 block mb-2">0{cat.display_order}</span>
                <h3 className="font-serif text-lg text-luxury-ivory group-hover:text-luxury-gold transition-colors font-medium">
                  {cat.name}
                </h3>
                <p className="text-xs text-luxury-muted mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-[11px] text-luxury-champagne/70 border-t border-luxury-subtle/30 pt-3">
                <span>Buyer&apos;s Premium: {cat.buyer_premium_pct}%</span>
                <ChevronRight size={14} className="text-luxury-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: BUY NOW & EXCEPTIONAL OBJECTS (DUAL-SALE SAFE)
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 pb-4 border-b border-luxury-champagne/15 gap-4">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-luxury mb-1">
              <Lock size={14} />
              <span>Immediate Acquisition</span>
            </div>
            <h2 className="font-serif text-3xl text-luxury-ivory font-medium">
              Fixed-Price Curated Lots
            </h2>
          </div>
          <p className="text-xs text-luxury-champagne/70 max-w-md">
            Acquire immediately without waiting for auction closure. Inventory is locked atomically against concurrent bidding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buyNowLots.map((listing) => (
            <LotCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: CONSIGNMENT STUDIO & SELLER HIGHLIGHTS
         ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-luxury-dark/90 border border-luxury-champagne/20 rounded-sm p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">
              Seller Consignment Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
              Consign with Confidence. Reach Discerning Global Collectors.
            </h2>
            <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans leading-relaxed max-w-2xl">
              We provide independent collectors, galleries, and estates with 3D model processing, AI description enrichment, transparent reserve pricing, and automated GST-compliant settlement ledgers.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/studio"
                className="px-6 py-3 bg-luxury-gold hover:bg-luxury-goldLight text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all"
              >
                Launch Seller Studio
              </Link>
              <Link
                href="/studio/valuation"
                className="px-6 py-3 border border-luxury-champagne/30 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-luxury transition-all"
              >
                Request Free Specialist Appraisal
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 bg-luxury-black p-6 border border-luxury-subtle/40 rounded-sm flex flex-col gap-4">
            <h4 className="font-serif text-base text-luxury-ivory font-medium">Consignment Guarantees</h4>
            <ul className="flex flex-col gap-3 text-xs text-luxury-champagne/80">
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>Protected private reserve amounts. Lots never sell below your floor.</span>
              </li>
              <li className="flex items-start gap-2">
                <Award size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>Competitive 8% commission on realized hammer prices.</span>
              </li>
              <li className="flex items-start gap-2">
                <Layers size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>Comprehensive white-glove logistics & transit insurance assistance.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
