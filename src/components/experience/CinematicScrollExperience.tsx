"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";

// Ensure ScrollTrigger is registered safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

// Video start offset: skip the marble bust shot (0.0s - 1.35s) so the experience opens with Chapter 02
const START_OFFSET = 1.38;

interface ChapterConfig {
  id: string;
  number: string;
  name: string;
  headlineLine1: string;
  headlineLine2?: string;
  supporting: string;
  timeStart: number; // in seconds of the MP4
  timeEnd: number;
  progressStart: number; // normalized progress within the cinematic scroll track (0.0 - 1.0)
  progressEnd: number;
  alignment: "left" | "center" | "right";
}

// The existing hero IS Chapter 01 (The Grand Gallery).
// The cinematic scroll continues with Chapters 02, 03, and 04:
const CHAPTERS: ChapterConfig[] = [
  {
    id: "imperial-hall",
    number: "02",
    name: "THE IMPERIAL HALL",
    headlineLine1: "BEYOND ORDINARY",
    headlineLine2: "COLLECTIONS.",
    supporting: "A world of exceptional works, rare antiquities and remarkable craftsmanship.",
    timeStart: 1.38,
    timeEnd: 3.5,
    progressStart: 0.05,
    progressEnd: 0.32,
    alignment: "center",
  },
  {
    id: "royal-collection",
    number: "03",
    name: "THE ROYAL COLLECTION",
    headlineLine1: "THE ART OF THE",
    headlineLine2: "EXCEPTIONAL.",
    supporting: "Discover objects whose craftsmanship, history and rarity transcend generations.",
    timeStart: 3.5,
    timeEnd: 6.6,
    progressStart: 0.38,
    progressEnd: 0.68,
    alignment: "left",
  },
  {
    id: "collectors-study",
    number: "04",
    name: "THE COLLECTOR'S STUDY",
    headlineLine1: "EVERY EXTRAORDINARY",
    headlineLine2: "OBJECT HAS A STORY.",
    supporting: "Discover the provenance, artistry and history behind exceptional pieces.",
    timeStart: 6.6,
    timeEnd: 10.02,
    progressStart: 0.74,
    progressEnd: 0.95,
    alignment: "right",
  },
];

export const CinematicScrollExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Chapter DOM refs for high-performance direct styling without React re-render storms
  const chapterDomRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const activeChapterRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Video seeking pipeline state (kept in refs for high frequency execution)
  const isSeekingRef = useRef<boolean>(false);
  const targetTimeRef = useRef<number>(START_OFFSET);
  const pendingTargetRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const actualDurationRef = useRef<number>(10.027);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsReducedMotion(prefersReduced);
    }
  }, []);

  // Precision Seek Engine: Non-blocking, requestAnimationFrame-scheduled seeking
  const executeSeek = useCallback(() => {
    animFrameIdRef.current = null;
    const video = videoRef.current;
    if (!video || video.readyState < 1) return;

    if (isSeekingRef.current) {
      // Browser is currently decoding; queue this target for next cycle
      pendingTargetRef.current = targetTimeRef.current;
      return;
    }

    const target = targetTimeRef.current;
    const diff = Math.abs(video.currentTime - target);

    // Only issue seek if target has meaningfully moved (> 0.02s)
    if (diff > 0.02) {
      isSeekingRef.current = true;
      try {
        video.currentTime = target;
      } catch {
        isSeekingRef.current = false;
      }
    }
  }, []);

  const scheduleSeek = useCallback(
    (time: number) => {
      targetTimeRef.current = time;
      if (animFrameIdRef.current === null) {
        animFrameIdRef.current = requestAnimationFrame(executeSeek);
      }
    },
    [executeSeek]
  );

  // Handle Seeked event to drain queued target times without infinite revert loops
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTargetRef.current !== null) {
        const nextTarget = pendingTargetRef.current;
        pendingTargetRef.current = null;
        targetTimeRef.current = nextTarget;
        const diff = Math.abs(video.currentTime - nextTarget);
        if (diff > 0.02) {
          isSeekingRef.current = true;
          try {
            video.currentTime = nextTarget;
          } catch {
            isSeekingRef.current = false;
          }
        }
      }
    };

    video.addEventListener("seeked", handleSeeked);
    return () => {
      video.removeEventListener("seeked", handleSeeked);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Update Chapter DOM elements directly without triggering React re-renders
  const updateChapterVisuals = useCallback((progress: number) => {
    const fadeWindow = 0.05;

    let currentActive = 0;

    CHAPTERS.forEach((chapter, idx) => {
      const el = chapterDomRefs.current[idx];
      if (!el) return;

      const { progressStart, progressEnd } = chapter;
      let opacity = 0;
      let y = 30;
      let blur = 8;

      if (progress < progressStart - fadeWindow) {
        // Before chapter
        opacity = 0;
        y = 30;
        blur = 8;
      } else if (progress < progressStart) {
        // Fade in
        const enterFraction = (progress - (progressStart - fadeWindow)) / fadeWindow;
        opacity = enterFraction;
        y = 30 * (1 - enterFraction);
        blur = 8 * (1 - enterFraction);
      } else if (progress <= progressEnd) {
        // Active chapter
        opacity = 1;
        y = 0;
        blur = 0;
        currentActive = idx;
      } else if (progress < progressEnd + fadeWindow) {
        // Fade out
        const exitFraction = (progress - progressEnd) / fadeWindow;
        opacity = 1 - exitFraction;
        y = -25 * exitFraction;
        blur = 6 * exitFraction;
      } else {
        // After chapter
        opacity = 0;
        y = -25;
        blur = 6;
      }

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
    });

    // Only update React state when active chapter actually changes
    if (activeChapterRef.current !== currentActive) {
      activeChapterRef.current = currentActive;
      setActiveChapterIndex(currentActive);
    }
  }, []);

  // Synchronize video timeline on loadedmetadata without forcing currentTime = 0
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    const duration = video.duration || 10.027;
    actualDurationRef.current = duration;
    setIsVideoLoaded(true);
    video.pause();

    // Check if visitor has already scrolled into the cinematic section
    let initialProgress = 0;
    if (container && typeof window !== "undefined") {
      const rect = container.getBoundingClientRect();
      const scrollDistance = container.offsetHeight - window.innerHeight;
      if (scrollDistance > 0 && rect.top < 0) {
        initialProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      }
    }

    const scrubDuration = duration - START_OFFSET;
    const target = Math.min(Math.max(START_OFFSET + initialProgress * scrubDuration, START_OFFSET), duration - 0.02);
    targetTimeRef.current = target;
    try {
      video.currentTime = target;
    } catch {
      // safe seek fallback
    }

    updateChapterVisuals(initialProgress);
    try {
      ScrollTrigger.refresh();
    } catch {
      // safe refresh fallback
    }
  };

  // GSAP ScrollTrigger configuration using Pure CSS Sticky (NO GSAP pin or pinSpacing)
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1, // Smooth, low-latency tracking
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          const duration = actualDurationRef.current;
          const scrubDuration = Math.max(duration - START_OFFSET, 1);
          const target = Math.min(
            Math.max(START_OFFSET + p * scrubDuration, START_OFFSET),
            duration - 0.02
          );

          scheduleSeek(target);
          updateChapterVisuals(p);
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [scheduleSeek, updateChapterVisuals]);

  // Chapter navigation: scrolls smoothly to the chapter's position in the track
  const scrollToChapter = (chapter: ChapterConfig) => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = container.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + scrollDistance * ((chapter.progressStart + chapter.progressEnd) / 2);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  // Sound toggle handler
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <section
      ref={containerRef}
      id="cinematic-experience"
      className="relative w-full bg-[#000000] text-luxury-ivory overflow-visible h-[280vh] md:h-[380vh]"
    >
      {/* Pinned Stage: Managed purely via CSS sticky (NO GSAP pin-spacer conflict) */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden flex items-center justify-center bg-[#000000] z-20"
      >
        {/* Layer 1: Cinematic Video Presentation */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src="/videos/Generated%20video%201.mp4"
            muted={isMuted}
            playsInline
            preload="auto"
            loop={false}
            autoPlay={false}
            onLoadedMetadata={handleLoadedMetadata}
            onError={(e) => console.warn("AUCTIONLY Cinematic Video Notice:", e)}
            className="w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700"
            style={{
              opacity: isVideoLoaded ? 1 : 0.5,
              filter: "contrast(1.04) brightness(0.96)",
            }}
          />
        </div>

        {/* Layer 2: Deep Luxury Black Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

        {/* Top & Bottom seamless gradient transitions to hero and lower sections */}
        <div className="absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-[#000000] via-[#000000]/60 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent pointer-events-none z-10" />

        {/* Subtle Warm Gold Lighting overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(135deg,rgba(198,166,106,0.06)_0%,transparent_50%,rgba(212,175,55,0.04)_100%)] mix-blend-screen" />

        {/* Layer 3: Synchronized Chapter Text Overlays (Chapters 02, 03, 04) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full pointer-events-none">
          {CHAPTERS.map((chapter, idx) => (
            <div
              key={chapter.id}
              ref={(el) => {
                chapterDomRefs.current[idx] = el;
              }}
              className={`absolute inset-x-6 sm:inset-x-10 lg:inset-x-16 top-1/2 -translate-y-1/2 transition-all duration-200 ease-out flex flex-col ${
                chapter.alignment === "left"
                  ? "items-start text-left max-w-2xl"
                  : chapter.alignment === "center"
                  ? "items-center text-center mx-auto max-w-3xl"
                  : "items-end text-right ml-auto max-w-2xl"
              }`}
              style={{
                opacity: 0,
                transform: "translate3d(0, 30px, 0)",
                filter: "blur(8px)",
              }}
            >
              {/* Chapter Label */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-luxury-gold font-semibold">
                  {chapter.number} — {chapter.name}
                </span>
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-luxury-gold to-transparent" />
              </div>

              {/* Main Headline (High-Contrast Roman Serif) */}
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.08em] sm:tracking-[0.14em] text-[#F7F3EB] uppercase leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <span className="block">{chapter.headlineLine1}</span>
                {chapter.headlineLine2 && (
                  <span className="block text-gold-gradient italic font-serif">
                    {chapter.headlineLine2}
                  </span>
                )}
              </h2>

              {/* Supporting Editorial Paragraph */}
              {chapter.supporting && (
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-luxury-champagne/90 font-sans font-light leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {chapter.supporting}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Layer 4: Interactive Luxury Exhibition HUD (Chapters 02, 03, 04) */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-end gap-5 pointer-events-auto">
          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapterIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch)}
                className="group flex items-center gap-3 py-1 cursor-pointer transition-all duration-300 focus:outline-none"
                aria-label={`Jump to Chapter ${ch.number}: ${ch.name}`}
              >
                <span
                  className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-luxury-gold font-medium"
                      : "text-luxury-muted/70 group-hover:text-luxury-champagne"
                  }`}
                >
                  {ch.name}
                </span>
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-2.5 h-2.5 bg-luxury-gold shadow-[0_0_10px_rgba(198,166,106,0.8)]"
                      : "w-1.5 h-1.5 bg-luxury-champagne/30 group-hover:bg-luxury-gold/70"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom Left: Audio Toggle */}
        <div className="absolute bottom-6 left-6 sm:left-10 z-30 pointer-events-auto flex items-center gap-4">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/60 hover:bg-black/90 border border-luxury-gold/40 hover:border-luxury-gold text-luxury-champagne text-[11px] uppercase tracking-wider backdrop-blur-md transition-all duration-300 cursor-pointer"
            aria-label={isMuted ? "Unmute Cinematic Score" : "Mute Cinematic Score"}
          >
            {isMuted ? (
              <>
                <VolumeX size={14} className="text-luxury-muted" />
                <span className="text-luxury-muted">Score Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={14} className="text-luxury-gold animate-pulse" />
                <span className="text-luxury-gold">Audio On</span>
              </>
            )}
          </button>
        </div>

        {/* Top Left: Cinematic Exhibition Watermark */}
        <div className="absolute top-6 left-6 sm:left-10 z-30 pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/80" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-luxury-champagne/70 font-light">
            Cinematic Retrospective
          </span>
        </div>
      </div>
    </section>
  );
};

export default CinematicScrollExperience;
