"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX, Sparkles, Compass } from "lucide-react";

// Ensure ScrollTrigger is registered safely on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChapterConfig {
  id: string;
  number: string;
  name: string;
  headlineLine1: string;
  headlineLine2?: string;
  supporting?: string;
  timeStart: number; // in seconds
  timeEnd: number;
  progressStart: number;
  progressEnd: number;
  alignment: "left" | "center" | "right";
}

const CHAPTERS: ChapterConfig[] = [
  {
    id: "gallery",
    number: "01",
    name: "THE GALLERY",
    headlineLine1: "WHERE ART",
    headlineLine2: "BECOMES A LEGACY.",
    timeStart: 0,
    timeEnd: 1.3,
    progressStart: 0.02,
    progressEnd: 0.22,
    alignment: "left",
  },
  {
    id: "imperial-hall",
    number: "02",
    name: "THE IMPERIAL HALL",
    headlineLine1: "BEYOND ORDINARY",
    headlineLine2: "COLLECTIONS.",
    supporting: "A world of exceptional works, rare antiquities and remarkable craftsmanship.",
    timeStart: 1.3,
    timeEnd: 3.5,
    progressStart: 0.26,
    progressEnd: 0.48,
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
    timeEnd: 6.5,
    progressStart: 0.52,
    progressEnd: 0.74,
    alignment: "left",
  },
  {
    id: "collectors-study",
    number: "04",
    name: "THE COLLECTOR'S STUDY",
    headlineLine1: "EVERY EXTRAORDINARY",
    headlineLine2: "OBJECT HAS A STORY.",
    supporting: "Discover the provenance, artistry and history behind exceptional pieces.",
    timeStart: 6.5,
    timeEnd: 10.0,
    progressStart: 0.78,
    progressEnd: 0.96,
    alignment: "right",
  },
];

export const CinematicScrollExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(10.027);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Targets for video scrubbing pipeline
  const targetTimeRef = useRef<number>(0);
  const seekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsReducedMotion(prefersReduced);
    }
  }, []);

  // Safe video seek pipeline
  const applyVideoSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoDuration) return;

    const target = targetTimeRef.current;

    if (video.seeking) {
      pendingTimeRef.current = target;
      return;
    }

    if (Math.abs(video.currentTime - target) > 0.03) {
      try {
        if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
          (video as any).fastSeek(target);
        } else {
          video.currentTime = target;
        }
      } catch {
        video.currentTime = target;
      }
    }
  }, [videoDuration]);

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const duration = video.duration || 10.027;
      setVideoDuration(duration);
      setIsVideoLoaded(true);
      video.pause();
      video.currentTime = 0;
    }
  };

  // Video seeked event listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        if (Math.abs(video.currentTime - nextTime) > 0.03) {
          try {
            video.currentTime = nextTime;
          } catch {
            // Safe fallback
          }
        }
      }
    };

    video.addEventListener("seeked", onSeeked);
    return () => {
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // Setup GSAP ScrollTrigger timeline
  useEffect(() => {
    if (isReducedMotion) return;
    const container = containerRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;

    if (!container || !stage || !video) return;

    const ctx = gsap.context(() => {
      const proxy = { progress: 0 };

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          proxy.progress = p;
          setScrollProgress(p);

          // Calculate current chapter index
          let currentIdx = 0;
          for (let i = CHAPTERS.length - 1; i >= 0; i--) {
            if (p >= CHAPTERS[i].progressStart - 0.04) {
              currentIdx = i;
              break;
            }
          }
          setActiveChapterIndex(currentIdx);

          // Update video target time
          const duration = videoDuration || 10.027;
          targetTimeRef.current = Math.min(Math.max(p * duration, 0), duration - 0.01);
          applyVideoSeek();
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [videoDuration, isReducedMotion, applyVideoSeek]);

  // Handle Chapter click navigation
  const scrollToChapter = (chapter: ChapterConfig) => {
    const container = containerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = container.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + scrollDistance * chapter.progressStart;

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

  // Helper to compute chapter opacity & transform based on current progress
  const getChapterState = (chapter: ChapterConfig) => {
    const { progressStart, progressEnd } = chapter;
    const fadeDistance = 0.05;

    // Before chapter
    if (scrollProgress < progressStart - fadeDistance) {
      return { opacity: 0, y: 35, blur: 10, visible: false };
    }
    // Entering chapter (fade in + unblur)
    if (scrollProgress < progressStart) {
      const enterProgress = (scrollProgress - (progressStart - fadeDistance)) / fadeDistance;
      return {
        opacity: Math.max(0, enterProgress),
        y: 35 * (1 - enterProgress),
        blur: 10 * (1 - enterProgress),
        visible: true,
      };
    }
    // Active chapter peak
    if (scrollProgress <= progressEnd) {
      return { opacity: 1, y: 0, blur: 0, visible: true };
    }
    // Exiting chapter (fade out)
    if (scrollProgress < progressEnd + fadeDistance) {
      const exitProgress = (scrollProgress - progressEnd) / fadeDistance;
      return {
        opacity: Math.max(0, 1 - exitProgress),
        y: -30 * exitProgress,
        blur: 8 * exitProgress,
        visible: true,
      };
    }
    // After chapter
    return { opacity: 0, y: -30, blur: 8, visible: false };
  };

  return (
    <section
      ref={containerRef}
      id="cinematic-experience"
      className="relative w-full bg-[#000000] text-luxury-ivory"
      style={{
        // 420vh scroll track on desktop, 320vh on mobile
        height: isReducedMotion ? "100svh" : "420vh",
      }}
    >
      {/* Pinned Viewport Stage (100svh) */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden flex items-center justify-center bg-[#000000] z-20"
      >
        {/* Layer 1: Cinematic Video Presentation */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/Generated%20video%201.mp4"
            muted={isMuted}
            playsInline
            preload="auto"
            loop={isReducedMotion}
            autoPlay={isReducedMotion}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-700"
            style={{
              opacity: isVideoLoaded ? 1 : 0.4,
              filter: "contrast(1.04) brightness(0.96)",
            }}
          />
        </div>

        {/* Layer 2: Deep Luxury Black Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-radial-vignette" />
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

        {/* Top & Bottom seamless gradient blend transitions */}
        <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-b from-[#000000] via-[#000000]/70 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-36 sm:h-44 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent pointer-events-none z-10" />

        {/* Subtle Warm Gold Lighting overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(135deg,rgba(198,166,106,0.06)_0%,transparent_50%,rgba(212,175,55,0.04)_100%)] mix-blend-screen" />

        {/* Layer 3: Synchronized Chapter Text Overlays */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col justify-center pointer-events-none">
          {CHAPTERS.map((chapter) => {
            const state = getChapterState(chapter);
            if (!state.visible && !isReducedMotion) return null;

            return (
              <div
                key={chapter.id}
                className={`transition-all duration-300 ease-out flex flex-col ${
                  chapter.alignment === "left"
                    ? "items-start text-left max-w-2xl"
                    : chapter.alignment === "center"
                    ? "items-center text-center mx-auto max-w-3xl"
                    : "items-end text-right ml-auto max-w-2xl"
                }`}
                style={{
                  opacity: state.opacity,
                  transform: `translate3d(0, ${state.y}px, 0)`,
                  filter: `blur(${state.blur}px)`,
                }}
              >
                {/* Chapter Label */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-luxury-gold font-semibold">
                    {chapter.number} — {chapter.name}
                  </span>
                  <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-luxury-gold to-transparent" />
                </div>

                {/* Main Headline (Masked Line Reveal) */}
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
            );
          })}
        </div>

        {/* Layer 4: Luxury Interactive HUD Controls & Progress Rail */}
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

        {/* Bottom Center: Scroll Prompt for initial frame */}
        {scrollProgress < 0.08 && (
          <div className="absolute bottom-6 inset-x-0 z-30 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-500 animate-fadeIn">
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-champagne/70 font-light">
              Scroll to Experience the Journey
            </span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-luxury-gold via-luxury-gold/50 to-transparent animate-pulse" />
          </div>
        )}

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
