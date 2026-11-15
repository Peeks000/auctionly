"use client";

type AudioListener = (isPlaying: boolean, volume: number) => void;

class AtmosphereAudioManager {
  private static instance: AtmosphereAudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private targetVolume = 0.55;
  private currentVolume = 0;
  private fadeInterval: number | null = null;
  private listeners: Set<AudioListener> = new Set();
  private isInitialized = false;

  private constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  public static getInstance(): AtmosphereAudioManager {
    if (!AtmosphereAudioManager.instance) {
      AtmosphereAudioManager.instance = new AtmosphereAudioManager();
    }
    return AtmosphereAudioManager.instance;
  }

  private init() {
    if (this.isInitialized || typeof window === "undefined") return;
    try {
      this.audio = new Audio("/music/Calculated_Grace.mp3");
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = "auto";

      this.audio.addEventListener("ended", () => {
        // loop is true, but safeguard
        if (this.isPlaying && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      });

      this.isInitialized = true;
    } catch (e) {
      console.warn("[AtmosphereAudio] Could not initialize audio element:", e);
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.currentVolume);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying, this.currentVolume));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(): Promise<boolean> {
    this.init();
    if (!this.audio) return false;

    this.isPlaying = true;
    this.fadeIn();
    this.notify();

    try {
      await this.audio.play();
      return true;
    } catch (err) {
      console.warn("[AtmosphereAudio] Autoplay blocked or playback error:", err);
      return false;
    }
  }

  public pause(): void {
    if (!this.audio) return;
    this.fadeOut(() => {
      if (this.audio) {
        this.audio.pause();
      }
      this.isPlaying = false;
      this.notify();
    });
  }

  public toggle(): Promise<boolean> | void {
    if (this.isPlaying) {
      this.pause();
    } else {
      return this.play();
    }
  }

  private fadeIn() {
    if (!this.audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const step = 0.05;
    this.fadeInterval = window.setInterval(() => {
      if (!this.audio) return;
      if (this.currentVolume < this.targetVolume) {
        this.currentVolume = Math.min(this.targetVolume, this.currentVolume + step);
        this.audio.volume = this.currentVolume;
        this.notify();
      } else {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
      }
    }, 40);
  }

  private fadeOut(onComplete?: () => void) {
    if (!this.audio) {
      onComplete?.();
      return;
    }
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const step = 0.08;
    this.fadeInterval = window.setInterval(() => {
      if (!this.audio) return;
      if (this.currentVolume > 0.02) {
        this.currentVolume = Math.max(0, this.currentVolume - step);
        this.audio.volume = this.currentVolume;
        this.notify();
      } else {
        this.currentVolume = 0;
        this.audio.volume = 0;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        onComplete?.();
      }
    }, 40);
  }
}

export const atmosphereAudio = typeof window !== "undefined" ? AtmosphereAudioManager.getInstance() : null;
export default AtmosphereAudioManager;
