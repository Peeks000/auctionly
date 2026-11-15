"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 7 Specialist Departments Data mapped to authentic museum visual assets
export interface DepartmentItem {
  id: string;
  order: string;
  name: string;
  slug: string;
  description: string;
  curatorialSubtitle: string;
  imageUrl: string;
}

export const DEPARTMENTS_DATA: DepartmentItem[] = [
  {
    id: "cat-1",
    order: "01",
    name: "Fine Art & Paintings",
    slug: "fine-art",
    description:
      "Masterpiece oils, traditional miniatures, contemporary Indian canvases, and signed lithographs curated with museum provenance.",
    curatorialSubtitle: "MASTERPIECE OILS & TRADITIONAL MINIATURES",
    imageUrl: "/departments/fine-art.webp",
  },
  {
    id: "cat-2",
    order: "02",
    name: "Sculptures & Decorative Art",
    slug: "sculptures",
    description:
      "Classical bronzes, carved marble, temple stone, fine ceramics, and monumental architectural artifacts.",
    curatorialSubtitle: "CLASSICAL MARBLE & HISTORIC BRONZES",
    imageUrl: "/departments/sculptures.webp",
  },
  {
    id: "cat-3",
    order: "03",
    name: "Antiques & Historical Objects",
    slug: "antiques",
    description:
      "Royal heirloom artifacts, imperial Mughal weaponry, colonial silverware, and rare antiquities preserved across centuries.",
    curatorialSubtitle: "IMPERIAL RELICS & JADE-HILTED WEAPONRY",
    imageUrl: "/departments/antiques.webp",
  },
  {
    id: "cat-4",
    order: "04",
    name: "Coins, Stamps & Numismatics",
    slug: "numismatics",
    description:
      "Ancient Indian punch-marked coins, Mughal gold mohurs, British India rarities, and philatelic gems of imperial history.",
    curatorialSubtitle: "AKBAR GOLD MOHURS & DYNASTIC RARITIES",
    imageUrl: "/departments/numismatics.webp",
  },
  {
    id: "cat-5",
    order: "05",
    name: "Watches & Jewellery",
    slug: "watches-jewellery",
    description:
      "Haute horlogerie tourbillons, vintage chronographs, royal polki, natural Basra pearls, and certified gemstones.",
    curatorialSubtitle: "HAUTE HORLOGERIE & ROYAL BASRA PEARLS",
    imageUrl: "/departments/watches-jewellery.webp",
  },
  {
    id: "cat-6",
    order: "06",
    name: "Rare Books & Manuscripts",
    slug: "rare-books",
    description:
      "First editions, illuminated folios with gold leaf calligraphy, royal farmans, historical cartography, and ancient texts.",
    curatorialSubtitle: "ILLUMINATED FOLIOS & IMPERIAL FARMANS",
    imageUrl: "/departments/rare-books.webp",
  },
  {
    id: "cat-7",
    order: "07",
    name: "Vintage Design & Furniture",
    slug: "vintage-design",
    description:
      "Mid-century modernist design, Pierre Jeanneret Chandigarh originals, and Art Deco masterworks from legendary ateliers.",
    curatorialSubtitle: "CHANDIGARH TEAK & MID-CENTURY MODERN",
    imageUrl: "/departments/vintage-design.webp",
  },
];

export const DepartmentsCarousel3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardDomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterTextRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchCurrentXRef = useRef<number>(0);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const isSectionVisibleRef = useRef<boolean>(true);

  // Viewport detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Ambient Gold Dust Particles (Pause when outside viewport)
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

    // Particle pool with multi-depth layers
    const PARTICLE_COUNT = 38;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.7 + 0.3,
      radius: Math.random() * 1.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18 - 0.08,
      alpha: Math.random() * 0.35 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();
    const render = (time: number) => {
      if (!isSectionVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.pulse += dt * 1.2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 166, 106, ${currentAlpha.toFixed(3)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 3D Spatial Transform Engine (Hardware-accelerated DOM transforms)
  const updateCardTransforms = useCallback((continuousIndex: number) => {
    if (typeof window === "undefined") return;

    const screenW = window.innerWidth;
    const isSmall = screenW < 768;
    const isMedium = screenW >= 768 && screenW < 1200;

    // Spacing calibrated so neighbor cards expose ~25-35% and tuck behind
    const xSpacing = isSmall ? 280 : isMedium ? 360 : 410;
    const zStep = isSmall ? 150 : isMedium ? 200 : 240;
    const rotStep = isSmall ? 16 : isMedium ? 24 : 28;

    // Update central spotlight tracking
    if (spotlightRef.current) {
      const spotOffset = (continuousIndex - 3) * 20;
      spotlightRef.current.style.transform = `translateX(${spotOffset.toFixed(1)}px)`;
    }

    // Direct HUD updates (zero latency, no React reconciliation lag)
    if (progressBarRef.current) {
      const progressFraction = Math.min(1, Math.max(0, continuousIndex / (DEPARTMENTS_DATA.length - 1)));
      const pct = (1 / DEPARTMENTS_DATA.length + progressFraction * ((DEPARTMENTS_DATA.length - 1) / DEPARTMENTS_DATA.length)) * 100;
      progressBarRef.current.style.width = `${pct.toFixed(2)}%`;
    }
    if (counterTextRef.current) {
      const currentNum = Math.min(DEPARTMENTS_DATA.length, Math.max(1, Math.round(continuousIndex) + 1));
      counterTextRef.current.textContent = `0${currentNum}`;
    }

    DEPARTMENTS_DATA.forEach((_, idx) => {
      const el = cardDomRefs.current[idx];
      if (!el) return;

      const delta = idx - continuousIndex;
      const absDelta = Math.abs(delta);

      // Cull far away cards
      if (absDelta > 2.8) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.display = "none";
        return;
      }

      el.style.display = "flex";

      const sign = delta < 0 ? -1 : 1;
      
      // Non-linear horizontal projection: cards curve gracefully
      const x = sign * Math.pow(absDelta, 0.88) * xSpacing;
      
      // Dramatic Z-depth recession: active card is at front (+20px), neighbors recede (-220px to -500px)
      const z = 20 - Math.pow(absDelta, 1.15) * zStep;

      // Inward rotation facing the viewer/center stage
      const rotY = -sign * Math.min(absDelta * rotStep, 46);

      // Hierarchical scaling: central card is commanding, neighbors scale down
      const scale = Math.max(0.66, 1.04 - absDelta * 0.18);
      
      // Layered atmospheric opacity & depth of field blur
      const opacity = Math.max(0, 1.0 - absDelta * 0.35);
      const blur = Math.max(0, (absDelta - 0.22) * 4.2);

      // Active card state
      const isCardActive = absDelta < 0.45;

      el.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.zIndex = Math.round(100 - absDelta * 25).toString();
      el.style.pointerEvents = isCardActive ? "auto" : "none";

      // Active card halo & gold illumination
      if (isCardActive) {
        el.style.borderColor = "#C6A66A";
        el.style.boxShadow = "0 25px 70px -15px rgba(198,166,106,0.25), 0 0 40px rgba(198,166,106,0.12)";
      } else {
        el.style.borderColor = "rgba(232, 220, 196, 0.15)";
        el.style.boxShadow = "none";
      }

      // Internal subtle image zoom on active
      const imgContainer = el.querySelector(".dept-card-image") as HTMLElement | null;
      if (imgContainer) {
        const imgScale = Math.max(1.0, 1.06 - absDelta * 0.1);
        imgContainer.style.transform = `scale(${imgScale.toFixed(3)})`;
      }
    });

    // Update active index state for Prev/Next button disabled state
    const nearestIndex = Math.min(
      DEPARTMENTS_DATA.length - 1,
      Math.max(0, Math.round(continuousIndex))
    );
    if (activeIndexRef.current !== nearestIndex) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }
  }, []);

  // GSAP ScrollTrigger with Snapping (6 equal intervals between 7 departments)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Initial position at index 0
    updateCardTransforms(0);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.12,
        snap: {
          snapTo: 1 / (DEPARTMENTS_DATA.length - 1), // 1/6 increments
          duration: { min: 0.25, max: 0.55 },
          delay: 0.06,
          ease: "power2.out",
        },
        invalidateOnRefresh: true,
        onToggle: (self) => {
          isSectionVisibleRef.current = self.isActive;
        },
        onUpdate: (self) => {
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
  const navigateToDepartment = useCallback((index: number) => {
    const targetIdx = Math.min(DEPARTMENTS_DATA.length - 1, Math.max(0, index));

    if (isMobile) {
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
  }, [isMobile, updateCardTransforms]);

  // Keyboard Navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4;
      if (!inView) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        navigateToDepartment(activeIndexRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        navigateToDepartment(activeIndexRef.current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToDepartment]);

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
    const normalizedDelta = diff / 220;
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
      className="relative w-full bg-[#0E0D0B] text-luxury-ivory overflow-visible select-none"
      style={{
        height: isMobile ? "auto" : "440vh",
      }}
    >
      {/* ====================================================================
          PINNED CAROUSEL STAGE (CSS Sticky on Desktop, Static on Mobile)
         ==================================================================== */}
      <div
        ref={stageRef}
        className={`${
          isMobile
            ? "relative min-h-[720px] py-12"
            : "sticky top-0 h-[100svh] min-h-[680px] max-h-[1200px]"
        } w-full overflow-hidden flex flex-col justify-between items-center bg-[#0E0D0B] z-20`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Layer 1: Ambient 3D Gold Dust Particles */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
        />

        {/* Layer 2: Architectural Gallery Vignette & Vertical Grid Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-10 overflow-hidden">
          <div className="w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#C6A66A] to-transparent -translate-x-[420px]" />
          <div className="w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#C6A66A] to-transparent translate-x-[420px]" />
          <div className="w-[1px] h-[120%] bg-gradient-to-b from-transparent via-[#C6A66A]/40 to-transparent -translate-x-[680px]" />
          <div className="w-[1px] h-[120%] bg-gradient-to-b from-transparent via-[#C6A66A]/40 to-transparent translate-x-[680px]" />
        </div>

        {/* Layer 3: Central Soft Gold Spotlight following the active card */}
        <div
          ref={spotlightRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[580px] pointer-events-none z-0 transition-transform duration-500 ease-out"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(198, 166, 106, 0.12) 0%, rgba(198, 166, 106, 0.03) 50%, transparent 75%)",
          }}
        />

        {/* Layer 4: Top & Bottom Stage Gradients for Clean Seamless Transitions */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0E0D0B] via-[#0E0D0B]/80 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#0E0D0B] via-[#0E0D0B]/85 to-transparent pointer-events-none z-10" />

        {/* Layer 5: Dark Polished Floor Reflection Plane */}
        <div className="absolute bottom-16 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent pointer-events-none z-10" />

        {/* ====================================================================
            COMPACT SECTION HEADER (15-20% height, never collides with cards)
           ==================================================================== */}
        <div className="relative z-20 pt-5 sm:pt-7 md:pt-8 px-4 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-luxury-gold font-medium">
              AUCTIONLY — SPECIALIST COLLECTIONS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-luxury-ivory font-light uppercase tracking-[0.14em] leading-tight">
            <span>SEVEN DEPARTMENTS.</span>
            <br />
            <span className="text-luxury-champagne/90 font-normal">
              ONE EXTRAORDINARY WORLD.
            </span>
          </h2>

          <p className="text-xs text-luxury-champagne/65 mt-1 font-light leading-relaxed max-w-lg hidden sm:block">
            Seven curatorial disciplines dedicated to exceptional masterworks, rare antiquities and historic collectibles.
          </p>
        </div>

        {/* ====================================================================
            3D SPATIAL CAROUSEL STAGE
           ==================================================================== */}
        <div
          className="relative z-20 w-full flex-1 flex items-center justify-center my-auto overflow-visible py-2"
          style={{
            perspective: isMobile ? "950px" : "1350px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            ref={cardsContainerRef}
            className="relative w-[310px] sm:w-[380px] md:w-[420px] lg:w-[450px] h-[460px] sm:h-[510px] md:h-[550px] lg:h-[580px] max-h-[66vh] flex items-center justify-center"
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
                  className={`absolute inset-0 rounded-sm bg-[#12110F]/95 border backdrop-blur-xl transition-[border-color,box-shadow] duration-500 overflow-hidden flex flex-col justify-between group cursor-pointer ${
                    isCurrent
                      ? "border-[#C6A66A] shadow-[0_25px_70px_-15px_rgba(198,166,106,0.25)]"
                      : "border-luxury-champagne/15 hover:border-luxury-gold/40"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {/* Subtle Card Surface Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-luxury-gold/5 pointer-events-none z-10" />

                  {/* 1. TOP: Department Number, Fine Gold Divider & Taxonomy */}
                  <div className="relative z-20 px-5 sm:px-6 py-3 flex items-center justify-between border-b border-luxury-champagne/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-luxury-gold">
                        {dept.order}
                      </span>
                      <span className="text-luxury-champagne/30 text-xs">/</span>
                      <span className="text-[10px] tracking-widest text-luxury-champagne/50 uppercase font-mono">
                        07
                      </span>
                    </div>

                    <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />

                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-medium text-luxury-champagne/70">
                      Curatorial Discipline
                    </span>
                  </div>

                  {/* 2. MAIN IMAGE: 55-65% Area, Museum Presentation, Parallax Zoom */}
                  <div className="relative z-20 flex-1 w-full overflow-hidden bg-black/60 relative">
                    <div className="dept-card-image absolute inset-0 w-full h-full transition-transform duration-700 ease-out">
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        sizes="(max-width: 768px) 310px, (max-width: 1200px) 420px, 450px"
                        quality={90}
                        priority={idx === 0 || idx === 1}
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Bottom Vignette for Smooth Transition into Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12110F] via-transparent to-black/30 pointer-events-none" />

                    {/* Curatorial Subtitle Tag */}
                    <div className="absolute bottom-2.5 left-4 right-4 z-10">
                      <span className="inline-block px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-luxury-gold/95 bg-black/75 backdrop-blur-md border border-luxury-gold/30 rounded-xs truncate max-w-full">
                        {dept.curatorialSubtitle}
                      </span>
                    </div>
                  </div>

                  {/* 3. CONTENT: Editorial Serif Title & Concise Curatorial Statement */}
                  <div className="relative z-20 px-5 sm:px-6 py-3.5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-luxury-ivory font-normal leading-tight group-hover:text-luxury-gold transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-luxury-champagne/75 mt-1 line-clamp-2 leading-relaxed font-light">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  {/* 4. BOTTOM: Minimal Refined Explore CTA */}
                  <div className="relative z-20 px-5 sm:px-6 py-3 border-t border-luxury-champagne/10 bg-black/50 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-champagne/50 font-light">
                      AUCTIONLY ARCHIVE
                    </span>

                    <Link
                      href={`/departments/${dept.slug}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-black border border-luxury-gold/40 hover:border-luxury-gold font-semibold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 rounded-xs group/btn"
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
            REFINED HUD: Counter, Continuous Gold Progress Track & Minimal Arrows
           ==================================================================== */}
        <div className="relative z-30 pb-5 sm:pb-7 px-4 w-full max-w-xl mx-auto flex items-center justify-between gap-4">
          {/* Previous Arrow Button */}
          <button
            onClick={() => navigateToDepartment(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous Department"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-luxury-champagne/20 bg-black/60 backdrop-blur-md text-[11px] uppercase tracking-widest transition-all ${
              activeIndex === 0
                ? "opacity-25 cursor-not-allowed text-luxury-muted border-luxury-champagne/10"
                : "hover:border-luxury-gold hover:text-luxury-gold text-luxury-ivory cursor-pointer"
            }`}
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline font-mono">PREV</span>
          </button>

          {/* Center: Department Counter & Continuous Gold Progress Track */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span
                ref={counterTextRef}
                className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-luxury-gold"
              >
                01
              </span>
              <span className="text-luxury-champagne/30 text-xs">/</span>
              <span className="font-mono text-xs text-luxury-champagne/50">
                0{DEPARTMENTS_DATA.length}
              </span>
            </div>

            {/* Continuous Gold Progress Track */}
            <div className="w-36 sm:w-64 h-[2px] bg-luxury-champagne/15 rounded-full overflow-hidden relative">
              <div
                ref={progressBarRef}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-luxury-gold/50 to-luxury-gold transition-all duration-150 ease-out shadow-[0_0_8px_rgba(198,166,106,0.8)]"
                style={{
                  width: `${(1 / DEPARTMENTS_DATA.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={() => navigateToDepartment(activeIndex + 1)}
            disabled={activeIndex === DEPARTMENTS_DATA.length - 1}
            aria-label="Next Department"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-luxury-champagne/20 bg-black/60 backdrop-blur-md text-[11px] uppercase tracking-widest transition-all ${
              activeIndex === DEPARTMENTS_DATA.length - 1
                ? "opacity-25 cursor-not-allowed text-luxury-muted border-luxury-champagne/10"
                : "hover:border-luxury-gold hover:text-luxury-gold text-luxury-ivory cursor-pointer"
            }`}
          >
            <span className="hidden sm:inline font-mono">NEXT</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsCarousel3D;
