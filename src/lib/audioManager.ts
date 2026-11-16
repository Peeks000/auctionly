"use client";

export interface AtmosphereTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  fallbackSrc: string;
}

export const ATMOSPHERE_PLAYLIST: AtmosphereTrack[] = [
  {
    id: "alicia-violin",
    title: "Alicia (Violin)",
    artist: "Curatorial Strings",
    src: encodeURI("/music/Alicia (Violin).mp3"),
    fallbackSrc: "/music/alicia-violin.mp3",
  },
  {
    id: "lumiere-a-laube",
    title: "Lumière à l’Aube",
    artist: "Lumière",
    src: encodeURI("/music/Lumière - Lumière à l’Aube.mp3"),
    fallbackSrc: "/music/lumiere-a-laube.mp3",
  },
];

export type AudioListener = (
  isPlaying: boolean,
  volume: number,
  currentTrack: AtmosphereTrack
) => void;

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
  private activeTriggerHandler: ((e: Event) => void) | null = null;
  private currentTrackIndex = 0;

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

  public getCurrentTrack(): AtmosphereTrack {
    return ATMOSPHERE_PLAYLIST[this.currentTrackIndex] || ATMOSPHERE_PLAYLIST[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getPlaylist(): AtmosphereTrack[] {
    return ATMOSPHERE_PLAYLIST;
  }

  private init() {
    if (this.isInitialized || typeof window === "undefined") return;
    try {
      const track = this.getCurrentTrack();
      this.audio = new Audio(track.src);
      // loop MUST be false so that the 'ended' event fires and transitions to the next song!
      this.audio.loop = false;
      this.audio.volume = 0;
      this.audio.preload = "auto";

      // Robust fallback handler for special characters / server environment variations
      this.audio.addEventListener("error", () => {
        const cur = this.getCurrentTrack();
        if (this.audio && !this.audio.src.includes(cur.fallbackSrc)) {
          console.warn(
            `[AtmosphereAudio] Primary audio load failed for ${cur.title}, trying fallback ${cur.fallbackSrc}`
          );
          this.audio.src = cur.fallbackSrc;
          this.audio.load();
          if (this.isPlaying) {
            this.audio.play().catch(() => {});
          }
        }
      });

      // Sequential Looping: When the current track ends, advance to the next track in the playlist
      // (Alicia Violin -> Lumière à l'Aube -> Alicia Violin -> ...)
      this.audio.addEventListener("ended", () => {
        console.log(
          `[AtmosphereAudio] Track finished: ${this.getCurrentTrack().title}. Playing next track in playlist.`
        );
        if (this.isPlaying) {
          this.nextTrack();
        }
      });

      this.isInitialized = true;
    } catch (e) {
      console.warn("[AtmosphereAudio] Could not initialize audio element:", e);
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.currentVolume, this.getCurrentTrack());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const cur = this.getCurrentTrack();
    this.listeners.forEach((fn) => fn(this.isPlaying, this.currentVolume, cur));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Advances sequentially to the next track in the playlist.
   * If music was playing, the new track automatically begins playing immediately.
   */
  public async nextTrack(): Promise<void> {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % ATMOSPHERE_PLAYLIST.length;
    const next = this.getCurrentTrack();
    console.log(`[AtmosphereAudio] Switch to track #${this.currentTrackIndex + 1}: ${next.title}`);

    if (this.audio) {
      this.audio.src = next.src;
      this.audio.currentTime = 0;
      this.audio.load();
      if (this.isPlaying) {
        try {
          await this.audio.play();
        } catch (err) {
          console.warn("[AtmosphereAudio] Play error on next track, trying fallback:", err);
          if (this.audio && next.fallbackSrc) {
            this.audio.src = next.fallbackSrc;
            this.audio.load();
            await this.audio.play().catch(() => {});
          }
        }
      }
    }
    this.notify();
  }

  /**
   * Sets track directly by index.
   */
  public async setTrack(index: number): Promise<void> {
    if (index < 0 || index >= ATMOSPHERE_PLAYLIST.length) return;
    this.currentTrackIndex = index;
    const track = this.getCurrentTrack();

    if (this.audio) {
      this.audio.src = track.src;
      this.audio.currentTime = 0;
      this.audio.load();
      if (this.isPlaying) {
        try {
          await this.audio.play();
        } catch (err) {
          if (this.audio && track.fallbackSrc) {
            this.audio.src = track.fallbackSrc;
            this.audio.load();
            await this.audio.play().catch(() => {});
          }
        }
      }
    }
    this.notify();
  }

  /**
   * Attempts immediate autoplay when site opens.
   * If browser autoplay policy blocks unprompted audio, attaches persistent capture listeners
   * on the window and document so the very first interaction (click, tap, keypress, pointerdown)
   * immediately begins smooth playback.
   */
  public async startAutoplay(): Promise<void> {
    if (this.hasAutoStarted || this.userExplicitlyPaused || typeof window === "undefined") return;
    this.hasAutoStarted = true;
    this.init();
    if (!this.audio) return;

    try {
      // 1. Try direct playback on open
      await this.audio.play();
      this.isPlaying = true;
      this.notify();
      this.fadeIn();
    } catch {
      // 2. Direct unmuted autoplay prevented by browser policy.
      // Attach capture listeners on window and document so any first user gesture unlocks sound.
      this.attachInteractionTrigger();
    }
  }

  private attachInteractionTrigger() {
    if (this.activeTriggerHandler || typeof window === "undefined") return;

    const onUserGesture = async (e: Event) => {
      if (this.userExplicitlyPaused) {
        this.removeInteractionTrigger();
        return;
      }
      if (this.isPlaying) {
        this.removeInteractionTrigger();
        return;
      }

      this.init();
      if (!this.audio) return;

      try {
        await this.audio.play();
        this.isPlaying = true;
        this.notify();
        this.fadeIn();
        // Successfully started audio! Clean up listeners
        this.removeInteractionTrigger();
      } catch (err) {
        console.warn("[AtmosphereAudio] Autoplay attempt on", e.type, "pending user activation:", err);
      }
    };

    this.activeTriggerHandler = onUserGesture;

    const events = [
      "pointerdown",
      "mousedown",
      "click",
      "touchstart",
      "touchend",
      "keydown",
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, onUserGesture, { capture: true, passive: true });
      document.addEventListener(evt, onUserGesture, { capture: true, passive: true });
    });
  }

  private removeInteractionTrigger() {
    if (!this.activeTriggerHandler || typeof window === "undefined") return;
    const handler = this.activeTriggerHandler;
    this.activeTriggerHandler = null;

    const events = [
      "pointerdown",
      "mousedown",
      "click",
      "touchstart",
      "touchend",
      "keydown",
    ];

    events.forEach((evt) => {
      window.removeEventListener(evt, handler, { capture: true } as EventListenerOptions);
      document.removeEventListener(evt, handler, { capture: true } as EventListenerOptions);
    });
  }

  public async play(): Promise<boolean> {
    this.userExplicitlyPaused = false;
    this.removeInteractionTrigger();
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
    this.removeInteractionTrigger();
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

    // Start with immediate audible presence (0.2), then smoothly swell to target volume
    if (this.currentVolume < 0.2) {
      this.currentVolume = 0.2;
      this.audio.volume = this.currentVolume;
      this.notify();
    }

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

export const atmosphereAudio =
  typeof window !== "undefined" ? AtmosphereAudioManager.getInstance() : null;
export default AtmosphereAudioManager;
