"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ScrollTriggerEnhancer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait slightly for DOM to settle
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // 1. Featured Auctions Card Grid Stagger
        const featuredCards = document.querySelectorAll("#featured-auctions .grid > div");
        if (featuredCards.length > 0) {
          gsap.from(featuredCards, {
            scrollTrigger: {
              trigger: "#featured-auctions",
              start: "top 82%",
              toggleActions: "play none none none",
            },
            y: 50,
            opacity: 0,
            rotateX: 7,
            stagger: 0.12,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        }

        // 2. Live Gala Room Preview Box
        const galaBox = document.querySelector(".gala-banner-reveal");
        if (galaBox) {
          gsap.from(galaBox, {
            scrollTrigger: {
              trigger: galaBox,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            scale: 0.97,
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
        }

        // 3. Buy Now Curated Lots Grid Stagger
        const buyNowCards = document.querySelectorAll("#buy-now-section .grid > div");
        if (buyNowCards.length > 0) {
          gsap.from(buyNowCards, {
            scrollTrigger: {
              trigger: "#buy-now-section",
              start: "top 82%",
              toggleActions: "play none none none",
            },
            y: 50,
            opacity: 0,
            rotateX: 7,
            stagger: 0.12,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        }

        // 4. Consignment Studio Section
        const studioBox = document.querySelector(".consignment-studio-reveal");
        if (studioBox) {
          gsap.from(studioBox, {
            scrollTrigger: {
              trigger: studioBox,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 35,
            duration: 0.9,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
        }

        // 5. Section Header Titles Split / Fade
        const headers = document.querySelectorAll(".scroll-header-reveal");
        headers.forEach((header) => {
          gsap.from(header, {
            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 25,
            duration: 0.75,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
        });
      });

      return () => ctx.revert();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return <div ref={containerRef} className="hidden" aria-hidden="true" />;
};

export default ScrollTriggerEnhancer;
