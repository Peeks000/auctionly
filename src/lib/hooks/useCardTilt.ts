"use client";

import { useState, useCallback, RefObject } from "react";

export interface CardTiltState {
  rotX: number;
  rotY: number;
  glareX: number;
  glareY: number;
  isHovered: boolean;
}

export interface UseCardTiltOptions {
  maxRotationDeg?: number;
}

export interface UseCardTiltReturn {
  tilt: CardTiltState;
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
  transformStyle: React.CSSProperties;
  glareStyle: React.CSSProperties;
}

/**
 * useCardTilt - Encapsulates 3D perspective tilt and specular glare coordinates.
 * High-performance mouse movement tracker for luxury product cards.
 */
export function useCardTilt(
  cardRef: RefObject<HTMLElement | null>,
  options: UseCardTiltOptions = {}
): UseCardTiltReturn {
  const { maxRotationDeg = 6 } = options;

  const [tilt, setTilt] = useState<CardTiltState>({
    rotX: 0,
    rotY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles bounded by maxRotationDeg
      const rotX = -((y - centerY) / centerY) * maxRotationDeg;
      const rotY = ((x - centerX) / centerX) * maxRotationDeg;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({ rotX, rotY, glareX, glareY, isHovered: true });
    },
    [cardRef, maxRotationDeg]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });
  }, []);

  const transformStyle: React.CSSProperties = {
    transform: tilt.isHovered
      ? `perspective(1000px) rotateX(${tilt.rotX.toFixed(2)}deg) rotateY(${tilt.rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: tilt.isHovered
      ? "transform 0.08s ease-out"
      : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const glareStyle: React.CSSProperties = {
    opacity: tilt.isHovered ? 1 : 0,
    background: `radial-gradient(circle 320px at ${tilt.glareX.toFixed(1)}% ${tilt.glareY.toFixed(1)}%, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 45%, transparent 75%)`,
  };

  return {
    tilt,
    handleMouseMove,
    handleMouseLeave,
    transformStyle,
    glareStyle,
  };
}
