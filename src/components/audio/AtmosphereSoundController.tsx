"use client";

import React, { useState, useEffect } from "react";
import AtmosphereAudioManager from "@/lib/audioManager";
import { Volume2, VolumeX } from "lucide-react";

export const AtmosphereSoundController: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const manager = AtmosphereAudioManager.getInstance();
    const unsubscribe = manager.subscribe((playing, vol) => {
      setIsPlaying(playing);
      setVolume(vol);
    });

    // Auto-start gallery atmosphere audio when site opens
    manager.startAutoplay();

    return unsubscribe;
  }, []);

  const handleToggle = () => {
    const manager = AtmosphereAudioManager.getInstance();
    manager.toggle();
  };

  return (
    <div className={`pointer-events-auto ${className}`}>
      <button
        onClick={handleToggle}
        data-cursor="SOUND"
        className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.8)] ${
          isPlaying
            ? "bg-[#0A0907]/90 border-luxury-gold/60 text-luxury-gold shadow-[0_0_20px_rgba(198,166,106,0.35)]"
            : "bg-[#0A0907]/80 border-luxury-champagne/20 text-luxury-champagne/80 hover:text-luxury-gold hover:border-luxury-gold/40"
        }`}
        aria-label={isPlaying ? "Mute gallery atmosphere" : "Play gallery atmosphere"}
      >
        {/* Animated Equalizer Wave Bars */}
        <div className="flex items-end gap-[3px] h-3.5 w-4 shrink-0">
          <span
            className={`w-[2.5px] bg-luxury-gold rounded-full transition-all duration-200 ${
              isPlaying ? "animate-[soundWave1_0.8s_ease-in-out_infinite] h-full" : "h-[3px] opacity-40"
            }`}
          />
          <span
            className={`w-[2.5px] bg-luxury-gold rounded-full transition-all duration-200 ${
              isPlaying ? "animate-[soundWave2_0.6s_ease-in-out_infinite_0.15s] h-full" : "h-[5px] opacity-40"
            }`}
          />
          <span
            className={`w-[2.5px] bg-luxury-gold rounded-full transition-all duration-200 ${
              isPlaying ? "animate-[soundWave3_0.9s_ease-in-out_infinite_0.3s] h-full" : "h-[3px] opacity-40"
            }`}
          />
          <span
            className={`w-[2.5px] bg-luxury-gold rounded-full transition-all duration-200 ${
              isPlaying ? "animate-[soundWave4_0.7s_ease-in-out_infinite_0.2s] h-full" : "h-[4px] opacity-40"
            }`}
          />
        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[9px] tracking-[0.25em] uppercase font-semibold leading-tight text-luxury-gold">
            {isPlaying ? "ATMOSPHERE ACTIVE" : "PLAY ATMOSPHERE"}
          </span>
          <span className="text-[8px] tracking-[0.18em] uppercase text-luxury-champagne/60 font-light truncate max-w-[130px]">
            Alicia (Violin)
          </span>
        </div>

        {isPlaying ? (
          <Volume2 size={13} className="text-luxury-gold shrink-0" />
        ) : (
          <VolumeX size={13} className="text-luxury-champagne/60 group-hover:text-luxury-gold shrink-0 transition-colors" />
        )}
      </button>
    </div>
  );
};

export default AtmosphereSoundController;
