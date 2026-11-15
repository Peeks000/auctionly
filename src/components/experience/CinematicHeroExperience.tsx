"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Gavel,
  ArrowRight,
  ShieldCheck,
  Gem,
  Landmark,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";

// Register GSAP plugins safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 200 total extracted WebP frames covering 0.0s to 10.02s
const TOTAL_FRAMES = 200;
const getFramePath = (index: number) =>
  `/frames/frame_${String(index).padStart(3, "0")}.webp`;

interface ChapterConfig {
  id: string;
  number: string;
  name: string;
  headlineLine1: string;
  headlineLine2?: string;
  supporting: string;
  progressStart: number;
  progressEnd: number;
  alignment: "left" | "center" | "right";
}

// Continuous Curatorial Journey Chapters:
// Chapter 01 is the Grand Gallery Hero itself (progress 0.00 - 0.14).
// Chapters 02, 03, 04 continue smoothly from the eye transition into the gallery collections.
const CHAPTERS: ChapterConfig[] = [
  {
    id: "imperial-hall",
    number: "02",
    name: "THE IMPERIAL HALL",
    headlineLine1: "BEYOND ORDINARY",
    headlineLine2: "COLLECTIONS.",
    supporting: "A world of exceptional works, rare antiquities and remarkable craftsmanship.",
    progressStart: 0.18,
    progressEnd: 0.44,
    alignment: "center",
  },
  {
    id: "royal-collection",
    number: "03",
    name: "THE ROYAL COLLECTION",
    headlineLine1: "THE ART OF THE",
    headlineLine2: "EXCEPTIONAL.",
    supporting: "Discover objects whose craftsmanship, history and rarity transcend generations.",
    progressStart: 0.48,
    progressEnd: 0.72,
    alignment: "left",
  },
  {
    id: "collectors-study",
    number: "04",
    name: "THE COLLECTOR'S STUDY",
    headlineLine1: "EVERY EXTRAORDINARY",
    headlineLine2: "OBJECT HAS A STORY.",
    supporting: "Discover the provenance, artistry and history behind exceptional pieces.",
    progressStart: 0.76,
    progressEnd: 0.94,
    alignment: "right",
  },
];

export const CinematicHeroExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hero interactive layers
  const heroBackdropRef = useRef<HTMLDivElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const targetOpacity = useRef(0);
  const heroUiRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroTrustRef = useRef<HTMLDivElement>(null);

  // Progressive frame image cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const lastDrawnIndexRef = useRef<number>(-1);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  // Chapter DOM elements for 60fps direct manipulation
  const chapterDomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(-1);
  const activeChapterRef = useRef<number>(-1);
  const [isMuted, setIsMuted] = useState(true);

  // Pointer & mouse tracking with window-level detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMove = (e: MouseEvent | PointerEvent) => {
      if ("pointerType" in e && e.pointerType === "touch") return;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetPos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        targetOpacity.current = 1;
        // Immediate first jump if starting from off-screen
        if (revealLayerRef.current && targetOpacity.current === 1) {
          revealLayerRef.current.style.opacity = "1";
        }
      } else {
        targetOpacity.current = 0;
      }
    };

    const onLeave = () => {
      targetOpacity.current = 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  // Cursor-following spotlight RAF lerp loop (60-120fps smooth easing)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let animId: number;
    let currentX = -1000;
    let currentY = -1000;
    let currentOpacity = 0;

    const render = () => {
      // Smooth lerp easing towards cursor position
      currentX += (targetPos.current.x - currentX) * 0.15;
      currentY += (targetPos.current.y - currentY) * 0.15;
      currentOpacity += (targetOpacity.current - currentOpacity) * 0.12;

      const layer = revealLayerRef.current;
      if (layer) {
        if (currentOpacity < 0.005) {
          layer.style.opacity = "0";
        } else {
          layer.style.opacity = currentOpacity.toFixed(3);
          const mask = `radial-gradient(circle 260px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, black 0%, black 140px, rgba(0, 0, 0, 0.45) 210px, transparent 260px)`;
          layer.style.webkitMaskImage = mask;
          layer.style.maskImage = mask;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Draw frame on canvas with nearest neighbor fallback for 0ms lag
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[index - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[index + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      if (lastDrawnIndexRef.current === index && img === imagesRef.current[index]) {
        return;
      }
      lastDrawnIndexRef.current = index;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Update Chapter DOM elements directly without triggering React re-render storms
  const updateChapterVisuals = useCallback((progress: number) => {
    const fadeWindow = 0.04;
    let currentActive = -1;

    CHAPTERS.forEach((chapter, idx) => {
      const el = chapterDomRefs.current[idx];
      if (!el) return;

      const { progressStart, progressEnd } = chapter;
      let opacity = 0;
      let y = 30;
      let blur = 8;

      if (progress < progressStart - fadeWindow) {
        opacity = 0;
        y = 30;
        blur = 8;
      } else if (progress < progressStart) {
        const enter = (progress - (progressStart - fadeWindow)) / fadeWindow;
        opacity = enter;
        y = 30 * (1 - enter);
        blur = 8 * (1 - enter);
      } else if (progress <= progressEnd) {
        opacity = 1;
        y = 0;
        blur = 0;
        currentActive = idx;
      } else if (progress < progressEnd + fadeWindow) {
        const exit = (progress - progressEnd) / fadeWindow;
        opacity = 1 - exit;
        y = -25 * exit;
        blur = 6 * exit;
      } else {
        opacity = 0;
        y = -25;
        blur = 6;
      }

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    });

    if (activeChapterRef.current !== currentActive) {
      activeChapterRef.current = currentActive;
      setActiveChapterIndex(currentActive);
    }
  }, []);

  // Update Hero Plate Zoom & Hero UI Fadeout directly on scroll update
  const updateHeroVisuals = useCallback((progress: number) => {
    const backdrop = heroBackdropRef.current;
    const title = heroTitleRef.current;
    const cta = heroCtaRef.current;
    const trust = heroTrustRef.current;

    // 1. Hero UI Fade Out (progress 0.00 -> 0.08)
    const uiProgress = Math.min(1, Math.max(0, progress / 0.08));
    const uiOpacity = Math.max(0, 1 - uiProgress);
    const pointerEvents = uiOpacity > 0.4 ? "auto" : "none";

    if (title) {
      title.style.opacity = uiOpacity.toFixed(3);
      title.style.transform = `translate3d(0, ${(-uiProgress * 40).toFixed(1)}px, 0) scale(${(1 + uiProgress * 0.05).toFixed(3)})`;
      title.style.pointerEvents = pointerEvents;
    }

    if (cta) {
      cta.style.opacity = uiOpacity.toFixed(3);
      cta.style.transform = `translate3d(0, ${(uiProgress * 30).toFixed(1)}px, 0)`;
      cta.style.pointerEvents = pointerEvents;
    }

    if (trust) {
      trust.style.opacity = uiOpacity.toFixed(3);
      trust.style.transform = `translate3d(0, ${(uiProgress * 25).toFixed(1)}px, 0)`;
      trust.style.pointerEvents = pointerEvents;
    }

    // 2. Camera Push-In Zoom into the Sculpture's Eye (progress 0.00 -> 0.14)
    // Sculpture eyes are centered at 50.5% horizontal and 38.0% vertical
    if (backdrop) {
      if (progress <= 0.14) {
        const zoomT = progress / 0.14; // 0.0 -> 1.0
        // Cinematic ease-in exponential push
        const scale = 1.0 + Math.pow(zoomT, 1.4) * 2.25; // 1.0 -> 3.25
        
        // As we reach extreme close-up of eye (zoomT > 0.7), cross-fade into canvas eye frame
        let backdropOpacity = 1;
        if (zoomT > 0.7) {
          backdropOpacity = Math.max(0, 1 - (zoomT - 0.7) / 0.3);
        }

        backdrop.style.opacity = backdropOpacity.toFixed(3);
        backdrop.style.transform = `scale(${scale.toFixed(4)})`;
        backdrop.style.display = "block";

        if (revealLayerRef.current) {
          revealLayerRef.current.style.transform = `scale(${scale.toFixed(4)})`;
          revealLayerRef.current.style.display = "block";
        }
      } else {
        backdrop.style.opacity = "0";
        backdrop.style.display = "none";
        if (revealLayerRef.current) {
          revealLayerRef.current.style.display = "none";
        }
      }
    }
  }, []);

  // Progressive Frame Preloading Engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1280;
      canvas.height = 720;
    }

    let isMounted = true;

    // 1. High priority: Preload Frame 0 immediately
    const firstImg = new window.Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current[0] = firstImg;
      drawFrame(0);
      setIsCanvasLoaded(true);
    };

    // 2. Preload opening eye zoom sequence (frames 1 to 30)
    for (let i = 1; i < Math.min(30, TOTAL_FRAMES); i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (isMounted) imagesRef.current[i] = img;
      };
    }

    // 3. Background progressive worker for remaining gallery frames
    let nextIndex = 30;
    const batchSize = 15;

    const loadNextBatch = () => {
      if (!isMounted || nextIndex >= TOTAL_FRAMES) return;
      const end = Math.min(nextIndex + batchSize, TOTAL_FRAMES);
      for (let i = nextIndex; i < end; i++) {
        const img = new window.Image();
        img.src = getFramePath(i);
        img.onload = () => {
          if (isMounted) imagesRef.current[i] = img;
        };
      }
      nextIndex = end;
      if (nextIndex < TOTAL_FRAMES) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          window.requestIdleCallback(loadNextBatch, { timeout: 1000 });
        } else {
          setTimeout(loadNextBatch, 50);
        }
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(loadNextBatch, { timeout: 1000 });
    } else {
      setTimeout(loadNextBatch, 80);
    }

    return () => {
      isMounted = false;
    };
  }, [drawFrame]);

  // GSAP ScrollTrigger Master Timeline (Pure CSS Sticky, Zero Pin-Spacer Conflict)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial paint at scroll progress 0.0
    updateHeroVisuals(0);
    updateChapterVisuals(0);
    drawFrame(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.05,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0

          // Update Hero Zoom and UI fade
          updateHeroVisuals(p);

          // Calculate precise frame index:
          // progress 0.00 - 0.14 covers frames 0 - 22 (the camera zoom into the eye)
          // progress 0.14 - 1.00 covers frames 23 - 199 (Imperial Hall, Royal Collection, Collector's Study)
          let frameIndex = 0;
          if (p <= 0.14) {
            frameIndex = Math.floor((p / 0.14) * 22);
          } else {
            const galleryProgress = (p - 0.14) / 0.86;
            frameIndex = 22 + Math.floor(galleryProgress * (TOTAL_FRAMES - 23));
          }
          frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex));

          drawFrame(frameIndex);
          updateChapterVisuals(p);
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [drawFrame, updateHeroVisuals, updateChapterVisuals]);

  // Chapter navigation scroll helper
  const scrollToChapter = (chapter: ChapterConfig) => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = container.offsetHeight - window.innerHeight;
    const targetScroll =
      containerTop + scrollDistance * ((chapter.progressStart + chapter.progressEnd) / 2);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      id="cinematic-hero"
      className="relative w-full bg-[#000000] text-luxury-ivory overflow-visible"
      style={{ height: "480vh" }}
    >
      {/* ====================================================================
          PINNED STAGE: PURE CSS STICKY (Full viewport museum exhibition)
         ==================================================================== */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100svh] min-h-[680px] max-h-[1200px] overflow-hidden flex flex-col justify-between items-center bg-[#000000] z-20 select-none border-b border-luxury-champagne/15"
      >
        {/* ====================================================================
            LAYER 0: High-Performance Canvas Frame Sequence (0ms Seek Lag)
           ==================================================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover object-center pointer-events-none select-none"
            style={{
              filter: "contrast(1.04) brightness(0.96)",
            }}
          />
        </div>

        {/* ====================================================================
            LAYER 1: The Base Hero Plate with Controlled Eye-Transform Origin
           ==================================================================== */}
        <div
          ref={heroBackdropRef}
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden transition-opacity duration-300"
          style={{
            transformOrigin: "50.5% 38%",
          }}
        >
          {/* Exact Museum Gallery Base Asset (BG_IMAGEs_1) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero/hero-base.jpg"
              alt="AUCTIONLY Classical Museum Gallery with Greco-Roman Bust"
              fill
              priority
              sizes="100vw"
              quality={95}
              className="object-cover object-center"
            />
          </div>

          {/* Atmospheric Lighting & Volumetric Rays (Entering from top-right across bust) */}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(225deg,rgba(255,225,160,0.14)_0%,rgba(212,175,55,0.05)_26%,transparent_60%)] mix-blend-screen" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

          {/* Edge Vignettes for Gallery Ambience */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#000000]/85 via-[#000000]/45 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#000000]/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#000000]/60 to-transparent" />
        </div>

        {/* ====================================================================
            LAYER 1.5: Cursor-Following Spotlight Character Reveal Layer (BG_IMAGEs_2)
            - 260px circular spotlight centered exactly on cursor
            - Soft feathered edge via CSS radial-gradient mask-image
            - Smooth lerp/easing cursor-follow
            - pointer-events: none, above base hero (z-12) but below UI (z-30)
            - Completely hidden outside spotlight and when cursor leaves hero
           ==================================================================== */}
        <div
          ref={revealLayerRef}
          className="absolute inset-0 z-[12] pointer-events-none overflow-hidden"
          style={{
            transformOrigin: "50.5% 38%",
            opacity: 0,
            WebkitMaskImage:
              "radial-gradient(circle 260px at -1000px -1000px, black 0%, black 140px, rgba(0, 0, 0, 0.45) 210px, transparent 260px)",
            maskImage:
              "radial-gradient(circle 260px at -1000px -1000px, black 0%, black 140px, rgba(0, 0, 0, 0.45) 210px, transparent 260px)",
          }}
        >
          {/* Exact Character Reveal Asset (BG_IMAGEs_2) - No editing, no crop, no resize */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero/hero-reveal.jpg"
              alt="AUCTIONLY Illuminated Character Gallery Reveal"
              fill
              priority
              sizes="100vw"
              quality={95}
              className="object-cover object-center"
            />
          </div>

          {/* Atmospheric Lighting matching base */}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(225deg,rgba(255,225,160,0.14)_0%,rgba(212,175,55,0.05)_26%,transparent_60%)] mix-blend-screen" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

          {/* Matching Edge Vignettes */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#000000]/85 via-[#000000]/45 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#000000]/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#000000]/60 to-transparent" />
        </div>

        {/* Global Dark Vignette Overlay for Crisp Readability across all chapters */}
        <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.65)_100%)]" />

        {/* ====================================================================
            LAYER 2: Chapter 01 — THE GRAND GALLERY HERO UI OVERLAY
           ==================================================================== */}
        <div
          ref={heroUiRef}
          className="relative z-30 w-full h-full flex flex-col justify-between items-center pointer-events-auto"
        >
          {/* Top: Main Headline & Tagline */}
          <div
            ref={heroTitleRef}
            className="text-center pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-4 w-full max-w-5xl mx-auto flex flex-col items-center transition-all duration-300"
          >
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

          {/* Center: Call-To-Action Buttons directly beneath sculpture */}
          <div
            ref={heroCtaRef}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 my-auto pt-48 sm:pt-60 md:pt-72 lg:pt-80 transition-all duration-300"
          >
            <Link
              href="/catalogue"
              className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-[#C6A66A] hover:bg-[#D4AF37] text-[#0A0907] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(198,166,106,0.35)] hover:shadow-[0_12px_32px_rgba(198,166,106,0.5)] flex items-center gap-2.5 active:scale-[0.98]"
            >
              <Gavel size={15} className="text-[#0A0907]" />
              <span>Explore Lots</span>
              <ArrowRight
                size={14}
                className="text-[#0A0907] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/live"
              className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-black/60 hover:bg-black/85 border border-luxury-gold/70 hover:border-luxury-gold text-luxury-ivory font-medium text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2.5 active:scale-[0.98]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Live Auctions</span>
              <ArrowRight
                size={14}
                className="text-luxury-gold transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Bottom: Trust Indicators & Scroll Indicator */}
          <div
            ref={heroTrustRef}
            className="w-full max-w-6xl mx-auto px-4 pb-5 sm:pb-7 flex flex-col items-center gap-4 sm:gap-5 transition-all duration-300"
          >
            {/* Trust Indicators Row */}
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

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center gap-1.5 pt-1 group cursor-pointer focus:outline-none">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-luxury-champagne/75 group-hover:text-luxury-gold transition-colors font-light">
                Scroll to Discover
              </span>
              <div className="w-[1px] h-7 sm:h-9 bg-gradient-to-b from-luxury-gold via-luxury-gold/50 to-transparent animate-pulse group-hover:h-11 transition-all" />
            </div>
          </div>
        </div>

        {/* ====================================================================
            LAYER 3: Chapters 02, 03, 04 Storytelling Overlays
           ==================================================================== */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          {CHAPTERS.map((chapter, idx) => {
            const alignClasses =
              chapter.alignment === "left"
                ? "items-start text-left ml-8 sm:ml-16 md:ml-24 max-w-xl"
                : chapter.alignment === "right"
                ? "items-end text-right mr-8 sm:mr-16 md:mr-24 max-w-xl ml-auto"
                : "items-center text-center mx-auto max-w-2xl px-4";

            return (
              <div
                key={chapter.id}
                ref={(el) => {
                  chapterDomRefs.current[idx] = el;
                }}
                className={`absolute w-full px-4 flex flex-col justify-center transition-[opacity,transform,filter] duration-75 ease-out ${alignClasses}`}
                style={{
                  opacity: 0,
                  transform: "translate3d(0, 30px, 0)",
                  filter: "blur(8px)",
                  pointerEvents: "none",
                }}
              >
                {/* Chapter Metadata Badge */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-semibold bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 rounded-xs backdrop-blur-md">
                    Chapter {chapter.number}
                  </span>
                  <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-luxury-champagne/80 font-light">
                    {chapter.name}
                  </span>
                </div>

                {/* Monumental Headline */}
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-luxury-ivory font-light leading-[1.08] tracking-[0.05em] uppercase mb-4 sm:mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  <span>{chapter.headlineLine1}</span>
                  {chapter.headlineLine2 && (
                    <>
                      <br />
                      <span className="text-luxury-champagne/95 font-normal">
                        {chapter.headlineLine2}
                      </span>
                    </>
                  )}
                </h2>

                {/* Editorial Supporting Description */}
                <p className="text-xs sm:text-sm md:text-base text-luxury-ivory/85 font-light leading-relaxed max-w-lg mb-6 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {chapter.supporting}
                </p>

                {/* Curatorial Link CTA */}
                <div className="flex items-center gap-4">
                  <Link
                    href="/catalogue"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black/60 hover:bg-luxury-gold/20 border border-luxury-gold/60 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-md"
                  >
                    <span>View Provenance</span>
                    <ArrowRight
                      size={13}
                      className="text-luxury-gold group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====================================================================
            LAYER 4: Exhibition Persistent Controls (Bottom bar)
           ==================================================================== */}
        <div
          className={`absolute bottom-6 inset-x-0 px-6 sm:px-12 flex items-center justify-between z-40 pointer-events-none transition-opacity duration-500 ${
            activeChapterIndex >= 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Chapter Quick Jump Pills */}
          <div className="flex items-center gap-2 pointer-events-auto bg-black/50 border border-luxury-gold/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            {CHAPTERS.map((chap, idx) => (
              <button
                key={chap.id}
                onClick={() => scrollToChapter(chap)}
                className={`text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full transition-all ${
                  activeChapterIndex === idx
                    ? "bg-luxury-gold text-black font-semibold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    : "text-luxury-champagne/70 hover:text-luxury-ivory"
                }`}
                aria-label={`Jump to Chapter ${chap.number}: ${chap.name}`}
              >
                {chap.number}
              </button>
            ))}
          </div>

          {/* Sound / Atmosphere Indicator */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 pointer-events-auto px-3 py-1.5 rounded-full bg-black/50 border border-luxury-gold/20 text-luxury-champagne/80 hover:text-luxury-gold hover:border-luxury-gold/40 transition-colors backdrop-blur-md text-[10px] tracking-wider uppercase"
            aria-label={isMuted ? "Unmute gallery atmosphere" : "Mute gallery atmosphere"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span className="hidden sm:inline">
              {isMuted ? "Atmosphere Muted" : "Atmosphere Playing"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CinematicHeroExperience;
