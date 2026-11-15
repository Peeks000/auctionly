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
  private userExplicitlyPaused = false;
  private hasAutoStarted = false;
  private interactionListenersAttached = false;

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

  /**
   * Attempts immediate autoplay when site opens.
   * If browser autoplay policy blocks unprompted audio, automatically binds to the first user
   * interaction (scroll, click, touch, keydown, wheel) so playback begins seamlessly.
   */
  public async startAutoplay(): Promise<void> {
    if (this.hasAutoStarted || this.userExplicitlyPaused || typeof window === "undefined") return;
    this.hasAutoStarted = true;
    this.init();
    if (!this.audio) return;

    try {
      // Try playing immediately
      await this.audio.play();
      this.isPlaying = true;
      this.notify();
      this.fadeIn();
    } catch {
      // Browser blocked autoplay without user gesture.
      // Attach fallback interaction triggers on window.
      this.attachInteractionTrigger();
    }
  }

  private attachInteractionTrigger() {
    if (this.interactionListenersAttached || typeof window === "undefined") return;
    this.interactionListenersAttached = true;

    const triggerPlay = async () => {
      if (this.userExplicitlyPaused || this.isPlaying) {
        this.removeInteractionTrigger(triggerPlay);
        return;
      }

      this.init();
      if (!this.audio) return;

      try {
        await this.audio.play();
        this.isPlaying = true;
        this.notify();
        this.fadeIn();
      } catch (err) {
        console.warn("[AtmosphereAudio] Interaction play attempt:", err);
      } finally {
        this.removeInteractionTrigger(triggerPlay);
      }
    };

    const events = ["pointerdown", "click", "keydown", "scroll", "touchstart", "wheel"];
    events.forEach((evt) => {
      window.addEventListener(evt, triggerPlay, { once: true, passive: true });
    });
  }

  private removeInteractionTrigger(handler: () => void) {
    if (typeof window === "undefined") return;
    const events = ["pointerdown", "click", "keydown", "scroll", "touchstart", "wheel"];
    events.forEach((evt) => {
      window.removeEventListener(evt, handler);
    });
    this.interactionListenersAttached = false;
  }

  public async play(): Promise<boolean> {
    this.userExplicitlyPaused = false;
    this.init();
    if (!this.audio) return false;

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.notify();
      this.fadeIn();
      return true;
    } catch (err) {
      console.warn("[AtmosphereAudio] Playback error:", err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause(): void {
    this.userExplicitlyPaused = true;
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