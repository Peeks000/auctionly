"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mockCategories, mockListings } from "@/lib/data/mockCatalogue";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Layers,
  Award,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Department curation data mapped accurately to AUCTIONLY's actual categories
interface DepartmentItem {
  id: string;
  order: string;
  name: string;
  slug: string;
  description: string;
  curatorialSubtitle: string;
  buyerPremium: number;
  sellerCommission: number;
  imageUrl: string;
  featuredTitle?: string;
  featuredPeriod?: string;
}

// Curated 7 Specialist Departments
const DEPARTMENTS_DATA: DepartmentItem[] = [
  {
    id: "cat-1",
    order: "01",
    name: "Fine Art & Paintings",
    slug: "fine-art",
    description: "Masterpiece oils, traditional miniatures, contemporary Indian canvases, and signed lithographs.",
    curatorialSubtitle: "OIL ON CANVAS & CONTEMPORARY MASTERWORKS",
    buyerPremium: 12.0,
    sellerCommission: 8.0,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "M.F. Husain — 'The Sun Chariot Horses'",
    featuredPeriod: "1972 • Oil on Canvas",
  },
  {
    id: "cat-2",
    order: "02",
    name: "Sculptures & Decorative Art",
    slug: "sculptures",
    description: "Classical bronzes, carved marble, temple stone, ceramics, and architectural artifacts.",
    curatorialSubtitle: "LOST-WAX BRONZES & TEMPLE STATUARY",
    buyerPremium: 12.0,
    sellerCommission: 8.0,
    imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "Chola Dynasty Bronze Somaskanda",
    featuredPeriod: "11th Century CE • Thanjavur",
  },
  {
    id: "cat-3",
    order: "03",
    name: "Antiques & Historical Objects",
    slug: "antiques",
    description: "Royal heirloom artifacts, Mughal weaponry, colonial silverware, and rare antiquities.",
    curatorialSubtitle: "ROYAL PROVENANCE & IMPERIAL RELICS",
    buyerPremium: 15.0,
    sellerCommission: 10.0,
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "18th c. Mughal Damascened Steel Peshkabz",
    featuredPeriod: "c. 1760 • Jade & Gold Koftgari",
  },
  {
    id: "cat-4",
    order: "04",
    name: "Coins, Stamps & Numismatics",
    slug: "numismatics",
    description: "Ancient Indian punch-marked coins, Mughal gold mohurs, British India rarities, and philatelic gems.",
    curatorialSubtitle: "DYNASTIC NUMISMATICS & HISTORIC PHILATELY",
    buyerPremium: 10.0,
    sellerCommission: 6.0,
    imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "Emperor Akbar Gold Mohur (AH 981)",
    featuredPeriod: "1573 CE • Minted at Agra",
  },
  {
    id: "cat-5",
    order: "05",
    name: "Watches & Jewellery",
    slug: "watches-jewellery",
    description: "Haute horlogerie, vintage chronographs, royal polki, natural Basra pearls, and certified gemstones.",
    curatorialSubtitle: "HAUTE HORLOGERIE & ROYAL BASRA PEARLS",
    buyerPremium: 12.0,
    sellerCommission: 8.0,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "Patek Philippe Ref. 2499 Perpetual Calendar",
    featuredPeriod: "1978 • 18k Yellow Gold",
  },
  {
    id: "cat-6",
    order: "06",
    name: "Rare Books & Manuscripts",
    slug: "rare-books",
    description: "First editions, illuminated folios, royal farmans, cartography, and ancient palm-leaf texts.",
    curatorialSubtitle: "ILLUMINATED FOLIOS & IMPERIAL EDITIONS",
    buyerPremium: 10.0,
    sellerCommission: 7.0,
    imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "Imperial Mughal Illuminated Farman with Tughra",
    featuredPeriod: "Shah Jahan Era • Gold Leaf on Paper",
  },
  {
    id: "cat-7",
    order: "07",
    name: "Vintage Design & Furniture",
    slug: "vintage-design",
    description: "Mid-century modernist furniture, Pierre Jeanneret Chandigarh originals, and Art Deco masterworks.",
    curatorialSubtitle: "MID-CENTURY MODERN & CHANDIGARH ORIGINALS",
    buyerPremium: 14.0,
    sellerCommission: 9.0,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    featuredTitle: "Pierre Jeanneret — Pair of Kangaroo Lounge Chairs",
    featuredPeriod: "c. 1955 • Solid Teak & Cane",
  },
];

export const DepartmentsCarousel3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardDomRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchCurrentXRef = useRef<number>(0);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  // Check screen width
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Ambient 3D Gold Dust Particles Canvas
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Particle pool
    const PARTICLE_COUNT = 65;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2, // Depth factor
      radius: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.pulse += dt * 1.5;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        // Draw soft glowing gold dust mote
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha.toFixed(3)})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
        ctx.shadowBlur = 6 * p.z;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Continuous 3D Spatial Card Placement Engine (60-120fps direct DOM transforms)
  const updateCardTransforms = useCallback((continuousIndex: number) => {
    const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
    const isMedium = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1200;

    // Spatial parameters
    const xSpacing = isSmall ? 290 : isMedium ? 360 : 430;
    const zStep = isSmall ? 130 : 190;
    const rotStep = isSmall ? 18 : 25;

    DEPARTMENTS_DATA.forEach((_, idx) => {
      const el = cardDomRefs.current[idx];
      if (!el) return;

      const delta = idx - continuousIndex;
      const absDelta = Math.abs(delta);

      // Card is in viewport range
      if (absDelta > 3.2) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.display = "none";
        return;
      }

      el.style.display = "block";

      // Non-linear horizontal position curve: cards fan out smoothly
      const sign = delta < 0 ? -1 : 1;
      const x = sign * Math.pow(absDelta, 0.92) * xSpacing;
      
      // Z-depth push back
      const z = -Math.pow(absDelta, 1.1) * zStep;

      // Rotation around Y axis facing inwards toward the center stage
      const rotY = -sign * Math.min(absDelta * rotStep, 45);

      // Controlled perspective scale & atmospheric depth blur
      const scale = Math.max(0.65, 1.05 - absDelta * 0.16);
      const opacity = Math.max(0, 1.0 - absDelta * 0.32);
      const blur = Math.max(0, (absDelta - 0.25) * 4.2);

      // Direct hardware-accelerated 3D transform
      el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.zIndex = Math.round(100 - absDelta * 20).toString();

      // Active interactive card
      const isCardActive = absDelta < 0.45;
      el.style.pointerEvents = isCardActive ? "auto" : "none";
      
      // Highlight border & gold aura on active card
      if (isCardActive) {
        el.classList.add("border-luxury-gold", "shadow-[0_20px_60px_rgba(212,175,55,0.18)]");
        el.classList.remove("border-luxury-champagne/20");
      } else {
        el.classList.remove("border-luxury-gold", "shadow-[0_20px_60px_rgba(212,175,55,0.18)]");
        el.classList.add("border-luxury-champagne/20");
      }
    });

    // Update active index state for counter/HUD
    const nearestIndex = Math.min(
      DEPARTMENTS_DATA.length - 1,
      Math.max(0, Math.round(continuousIndex))
    );
    if (activeIndexRef.current !== nearestIndex) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }
  }, []);

  // GSAP ScrollTrigger Setup (Dedicated Desktop Pinned Stage)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Initial positioning at index 0
    updateCardTransforms(0);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.08,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Continuous progress between 0 and 6 (7 departments)
          const continuousIdx = self.progress * (DEPARTMENTS_DATA.length - 1);
          updateCardTransforms(continuousIdx);
        },
      });

      scrollTriggerInstanceRef.current = st;
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isMobile, updateCardTransforms]);

  // Navigate to specific department
  const navigateToDepartment = (index: number) => {
    const targetIdx = Math.min(DEPARTMENTS_DATA.length - 1, Math.max(0, index));

    if (isMobile) {
      // Touch/mobile smooth transition
      updateCardTransforms(targetIdx);
      return;
    }

    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const progressFraction = targetIdx / (DEPARTMENTS_DATA.length - 1);
    const targetScrollY = containerTop + scrollableDistance * progressFraction;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchCurrentXRef.current = e.touches[0].clientX;
    setIsTouchDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDragging) return;
    touchCurrentXRef.current = e.touches[0].clientX;
    const diff = touchStartXRef.current - touchCurrentXRef.current;
    // Normalized swipe delta
    const normalizedDelta = diff / 250;
    const targetContinuous = Math.min(
      DEPARTMENTS_DATA.length - 1,
      Math.max(0, activeIndexRef.current + normalizedDelta)
    );
    updateCardTransforms(targetContinuous);
  };

  const handleTouchEnd = () => {
    if (!isTouchDragging) return;
    setIsTouchDragging(false);
    const diff = touchStartXRef.current - touchCurrentXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activeIndexRef.current < DEPARTMENTS_DATA.length - 1) {
        navigateToDepartment(activeIndexRef.current + 1);
      } else if (diff < 0 && activeIndexRef.current > 0) {
        navigateToDepartment(activeIndexRef.current - 1);
      } else {
        navigateToDepartment(activeIndexRef.current);
      }
    } else {
      navigateToDepartment(activeIndexRef.current);
    }
  };

  return (
    <section
      ref={containerRef}
      id="specialist-departments"
      className="relative w-full bg-[#050505] text-luxury-ivory overflow-visible select-none"
      style={{
        height: isMobile ? "auto" : "440vh",
      }}
    >
      {/* ====================================================================
          PINNED CAROUSEL STAGE (Pure CSS Sticky on Desktop, Static on Mobile)
         ==================================================================== */}
      <div
        ref={stageRef}
        className={`${
          isMobile
            ? "relative min-h-[720px] py-16"
            : "sticky top-0 h-[100svh] min-h-[700px] max-h-[1200px]"
        } w-full overflow-hidden flex flex-col justify-between items-center bg-[#050505] z-20`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Layer 1: Ambient 3D Gold Dust Particles Background */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />

        {/* Layer 2: Atmospheric Lighting & Deep Architectural Vignette */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,rgba(212,175,55,0.06)_0%,transparent_65%)]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" />
        
        {/* Layer 3: Abstract Architectural Sculpture Lines (Inspired by reference monoliths) */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-15 overflow-hidden">
          <div className="w-[1px] h-[140%] bg-gradient-to-b from-transparent via-luxury-gold to-transparent -translate-x-72" />
          <div className="w-[1px] h-[120%] bg-gradient-to-b from-transparent via-luxury-gold/60 to-transparent translate-x-72" />
          <div className="w-[500px] h-[500px] rounded-full border border-luxury-gold/15 -translate-y-12" />
        </div>

        {/* ====================================================================
            TOP HUD: Editorial Department Title & Taxonomy Framing
           ==================================================================== */}
        <div className="relative z-20 pt-8 sm:pt-10 md:pt-12 px-4 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-luxury-gold font-medium">
              AUCTIONLY — SPECIALIST COLLECTIONS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-luxury-ivory font-light uppercase tracking-[0.14em] leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            <span>SEVEN DEPARTMENTS.</span>
            <br />
            <span className="text-luxury-champagne/95 font-normal">
              ONE EXTRAORDINARY WORLD.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-luxury-champagne/70 mt-2 sm:mt-3 font-light leading-relaxed max-w-xl hidden sm:block">
            Discover seven specialist disciplines dedicated to exceptional art, rare antiquities, historical treasures and remarkable craftsmanship.
          </p>
        </div>

        {/* ====================================================================
            CENTER: 3D Spatial Carousel Panels Viewport
           ==================================================================== */}
        <div
          className="relative z-20 w-full flex-1 flex items-center justify-center my-auto overflow-visible"
          style={{
            perspective: isMobile ? "900px" : "1300px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            ref={cardsContainerRef}
            className="relative w-[310px] sm:w-[360px] md:w-[410px] h-[440px] sm:h-[490px] md:h-[530px] flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {DEPARTMENTS_DATA.map((dept, idx) => {
              const isCurrent = activeIndex === idx;

              return (
                <div
                  key={dept.id}
                  ref={(el) => {
                    cardDomRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    if (activeIndex !== idx) {
                      navigateToDepartment(idx);
                    }
                  }}
                  className={`absolute inset-0 rounded-sm bg-[#0C0B09]/90 border backdrop-blur-xl transition-[border-color,box-shadow] duration-500 overflow-hidden flex flex-col justify-between group cursor-pointer ${
                    isCurrent
                      ? "border-luxury-gold shadow-[0_20px_60px_rgba(212,175,55,0.18)]"
                      : "border-luxury-champagne/20 hover:border-luxury-gold/50"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {/* Card Subtle Gradient Glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/95 via-transparent to-luxury-gold/10 pointer-events-none z-10" />

                  {/* Top: Card Header Metadata */}
                  <div className="relative z-20 p-5 sm:p-6 pb-2 flex items-center justify-between border-b border-luxury-champagne/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-luxury-gold">
                        0{dept.order}
                      </span>
                      <span className="text-luxury-champagne/40">/</span>
                      <span className="text-[10px] tracking-widest text-luxury-champagne/60 uppercase">
                        07
                      </span>
                    </div>

                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] font-medium bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/25 rounded-xs">
                      Specialist Department
                    </span>
                  </div>

                  {/* Center: Curated Visual Presentation with Depth Parallax */}
                  <div className="relative z-20 flex-1 px-5 sm:px-6 py-4 flex flex-col justify-between">
                    {/* Image Frame */}
                    <div className="relative w-full h-36 sm:h-44 md:h-48 rounded-xs overflow-hidden border border-luxury-champagne/15 bg-black/40 group-hover:border-luxury-gold/40 transition-colors shadow-inner">
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        sizes="(max-width: 768px) 310px, 410px"
                        quality={85}
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Subtle Edge Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B09] via-transparent to-transparent opacity-80" />

                      {/* Accent Tag */}
                      <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[9px] tracking-wider uppercase text-luxury-ivory/90 bg-black/60 backdrop-blur-md px-2.5 py-1 border border-luxury-gold/20 rounded-xs">
                        <span className="truncate">{dept.curatorialSubtitle}</span>
                      </div>
                    </div>

                    {/* Department Title & Short Curatorial Description */}
                    <div className="pt-3">
                      <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-luxury-ivory font-medium group-hover:text-luxury-gold transition-colors leading-tight">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-luxury-champagne/75 mt-1.5 line-clamp-2 leading-relaxed font-light">
                        {dept.description}
                      </p>
                    </div>

                    {/* Featured Marquee Work (If active) */}
                    {dept.featuredTitle && (
                      <div className="pt-2 border-t border-luxury-champagne/10 flex items-center justify-between text-[10px] text-luxury-muted">
                        <span className="truncate max-w-[210px] text-luxury-champagne/90">
                          {dept.featuredTitle}
                        </span>
                        <span className="font-mono text-luxury-gold/80">
                          {dept.buyerPremium}% BP
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action: Explore Department Button */}
                  <div className="relative z-20 p-5 sm:p-6 pt-3 border-t border-luxury-champagne/10 bg-black/40 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-champagne/60 font-light">
                      Curatorial Archive
                    </span>

                    <Link
                      href={`/departments/${dept.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/15 hover:bg-luxury-gold text-luxury-gold hover:text-black border border-luxury-gold/50 hover:border-luxury-gold font-semibold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 rounded-xs shadow-[0_4px_15px_rgba(212,175,55,0.15)] group/btn"
                    >
                      <span>Explore</span>
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            BOTTOM HUD: Interactive Controls, Department Counter & Progress
           ==================================================================== */}
        <div className="relative z-30 pb-7 sm:pb-9 px-4 w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
          {/* Main Controls Row */}
          <div className="w-full flex items-center justify-between px-2 sm:px-6">
            {/* Previous Arrow Button */}
            <button
              onClick={() => navigateToDepartment(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous Department"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-luxury-champagne/20 bg-black/60 backdrop-blur-md text-xs uppercase tracking-widest transition-all ${
                activeIndex === 0
                  ? "opacity-30 cursor-not-allowed text-luxury-muted"
                  : "hover:border-luxury-gold hover:text-luxury-gold text-luxury-ivory cursor-pointer"
              }`}
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Department Quick Select Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-black/60 border border-luxury-champagne/20 rounded-full backdrop-blur-md">
              {DEPARTMENTS_DATA.map((dept, idx) => {
                const isSelected = activeIndex === idx;

                return (
                  <button
                    key={dept.id}
                    onClick={() => navigateToDepartment(idx)}
                    aria-label={`Select Department 0${dept.order}: ${dept.name}`}
                    className={`relative px-2.5 py-1 text-[10px] sm:text-xs font-mono rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-luxury-gold text-black font-semibold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                        : "text-luxury-champagne/70 hover:text-luxury-ivory hover:bg-white/5"
                    }`}
                  >
                    0{dept.order}
                  </button>
                );
              })}
            </div>

            {/* Next Arrow Button */}
            <button
              onClick={() => navigateToDepartment(activeIndex + 1)}
              disabled={activeIndex === DEPARTMENTS_DATA.length - 1}
              aria-label="Next Department"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-luxury-champagne/20 bg-black/60 backdrop-blur-md text-xs uppercase tracking-widest transition-all ${
                activeIndex === DEPARTMENTS_DATA.length - 1
                  ? "opacity-30 cursor-not-allowed text-luxury-muted"
                  : "hover:border-luxury-gold hover:text-luxury-gold text-luxury-ivory cursor-pointer"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Gold Progress Track */}
          <div className="w-full max-w-md h-[2px] bg-luxury-champagne/15 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-luxury-gold/50 to-luxury-gold transition-all duration-300 ease-out shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              style={{
                width: `${((activeIndex + 1) / DEPARTMENTS_DATA.length) * 100}%`,
              }}
            />
          </div>

          {/* Department Name Indicator */}
          <span className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold/90 font-light text-center truncate max-w-xs">
            {DEPARTMENTS_DATA[activeIndex].name}
          </span>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsCarousel3D;
