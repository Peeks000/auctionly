"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Sparkles, Rotate3D } from "lucide-react";
import { safeImagePath } from "@/lib/images";

interface LotCard3DPreviewProps {
  modelUrl: string;
  fallbackImageUrl: string;
  title: string;
  slug: string;
  priority?: boolean;
}

// Preset configuration for each model to ensure optimal framing, lighting, and animation
interface ModelPreset {
  cameraDistanceMultiplier: number;
  fov: number;
  initialRotation: [number, number, number];
  autoRotateSpeed: number;
  isPainting?: boolean; // Restrict 360 spin; apply subtle cinematic tilt/parallax
  floatingBob?: boolean;
  lightingTheme: "gold" | "painting" | "watch" | "bronze" | "coin" | "wood";
}

const MODEL_PRESETS: Record<string, ModelPreset> = {
  "jewelry-necklace": {
    cameraDistanceMultiplier: 1.15,
    fov: 38,
    initialRotation: [0, 0, 0],
    autoRotateSpeed: 0.005,
    floatingBob: true,
    lightingTheme: "gold",
  },
  "horse-painting": {
    cameraDistanceMultiplier: 1.05,
    fov: 36,
    initialRotation: [0, 0, 0],
    autoRotateSpeed: 0,
    isPainting: true, // Strictly no 360 spin
    floatingBob: false,
    lightingTheme: "painting",
  },
  "luxury-wristwatch": {
    cameraDistanceMultiplier: 1.12,
    fov: 38,
    initialRotation: [0.1, 0.45, 0],
    autoRotateSpeed: 0.006,
    floatingBob: false,
    lightingTheme: "watch",
  },
  "bronze-deity-family": {
    cameraDistanceMultiplier: 1.18,
    fov: 40,
    initialRotation: [0, 0, 0],
    autoRotateSpeed: 0.005,
    floatingBob: false,
    lightingTheme: "bronze",
  },
  "gold-coin": {
    cameraDistanceMultiplier: 1.1,
    fov: 36,
    initialRotation: [0.16, 0.2, 0.06],
    autoRotateSpeed: 0.007,
    floatingBob: true,
    lightingTheme: "coin",
  },
  "wooden-lounge-chair": {
    cameraDistanceMultiplier: 1.25,
    fov: 42,
    initialRotation: [0.12, -0.38, 0],
    autoRotateSpeed: 0.005,
    floatingBob: false,
    lightingTheme: "wood",
  },
};

function getPreset(url: string): ModelPreset {
  for (const key of Object.keys(MODEL_PRESETS)) {
    if (url.includes(key)) {
      return MODEL_PRESETS[key];
    }
  }
  return {
    cameraDistanceMultiplier: 1.15,
    fov: 38,
    initialRotation: [0, 0, 0],
    autoRotateSpeed: 0.005,
    lightingTheme: "gold",
  };
}

// In-memory GLTF cache so revisited cards load instantly without redownloading
const gltfSceneCache = new Map<string, THREE.Group>();
const gltfPromiseCache = new Map<string, Promise<THREE.Group>>();

function loadModelCached(url: string): Promise<THREE.Group> {
  if (gltfSceneCache.has(url)) {
    return Promise.resolve(gltfSceneCache.get(url)!.clone(true));
  }
  if (gltfPromiseCache.has(url)) {
    return gltfPromiseCache.get(url)!.then((scene) => scene.clone(true));
  }

  const promise = new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        // Prepare scene materials for optimal PBR presentation
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness, 0.85);
              mat.needsUpdate = true;
            }
          }
        });
        gltfSceneCache.set(url, gltf.scene);
        resolve(gltf.scene.clone(true));
      },
      undefined,
      (error) => reject(error)
    );
  });

  gltfPromiseCache.set(url, promise);
  return promise.then((scene) => scene.clone(true));
}

export const LotCard3DPreview: React.FC<LotCard3DPreviewProps> = ({
  modelUrl,
  fallbackImageUrl,
  title,
  slug,
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for render loop and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const idleResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag tracking to prevent accidental navigation
  const pointerState = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    hasDragged: false,
  });

  const preset = getPreset(modelUrl);

  // Determine whether preview optimized GLB exists
  const effectiveModelUrl = modelUrl.endsWith(".glb") && !modelUrl.includes("-preview.glb")
    ? modelUrl.replace(".glb", "-preview.glb")
    : modelUrl;

  // 1. IntersectionObserver for viewport lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        rootMargin: "150px 0px",
        threshold: 0.05,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [priority]);

  // 2. Initialize Three.js Scene when entering view
  useEffect(() => {
    if (!isInView) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 288;

    // Camera
    const camera = new THREE.PerspectiveCamera(preset.fov, width / height, 0.05, 50);
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      rendererRef.current = renderer;
    } catch {
      setHasError(true);
      return;
    }

    // Curated Lighting based on preset theme
    const ambientLight = new THREE.AmbientLight(
      preset.lightingTheme === "painting" ? 0xffffff : 0xf7f0e3,
      preset.lightingTheme === "painting" ? 1.4 : 1.1
    );
    scene.add(ambientLight);

    // Key Directional Light
    const keyLight = new THREE.DirectionalLight(
      preset.lightingTheme === "gold" || preset.lightingTheme === "coin"
        ? 0xf3e2b8
        : 0xffffff,
      preset.lightingTheme === "watch" || preset.lightingTheme === "coin" ? 2.4 : 1.8
    );
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Warm Secondary Fill Light
    const fillLight = new THREE.DirectionalLight(0xc6a66a, 0.9);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Subtle Rim Light for museum separation
    const rimLight = new THREE.DirectionalLight(0xe8dcc4, 1.2);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Pivot group for centering and rotations
    const pivot = new THREE.Group();
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // Load Model (attempts preview GLB, falls back to original GLB)
    loadModelCached(effectiveModelUrl)
      .catch(() => loadModelCached(modelUrl))
      .then((model) => {
        if (isDisposed) return;

        // Auto-center and auto-frame model using Box3
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center model within its group
        model.position.set(-center.x, -center.y, -center.z);
        pivot.add(model);

        // Calculate appropriate camera distance
        const maxDim = Math.max(size.x, size.y, size.z);
        const fovRad = (camera.fov * Math.PI) / 180;
        let cameraDistance = (maxDim / 2 / Math.tan(fovRad / 2)) * preset.cameraDistanceMultiplier;

        // Adjust for aspect ratio
        const aspect = width / height;
        if (aspect < 1) {
          cameraDistance = cameraDistance / aspect;
        }

        camera.position.set(0, 0, Math.max(cameraDistance, 1.2));
        camera.lookAt(0, 0, 0);

        // Apply initial orientation
        pivot.rotation.set(
          preset.initialRotation[0],
          preset.initialRotation[1],
          preset.initialRotation[2]
        );

        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("LotCard3DPreview load failed:", err);
        if (!isDisposed) setHasError(true);
      });

    // Animation & Render Loop
    let clock = new THREE.Clock();
    let userRotY = preset.initialRotation[1];
    let userRotX = preset.initialRotation[0];

    const animate = () => {
      if (isDisposed) return;
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (pivot) {
        // Automatic Idle Rotation / Motion
        if (!pointerState.current.isDown && !prefersReducedMotion) {
          if (preset.isPainting) {
            // Painting: Gentle subtle cinematic tilt (no 360 spin)
            const targetTiltY = Math.sin(elapsed * 0.7) * 0.08;
            const targetTiltX = Math.cos(elapsed * 0.5) * 0.04;
            pivot.rotation.y += (targetTiltY - pivot.rotation.y) * 0.04;
            pivot.rotation.x += (targetTiltX - pivot.rotation.x) * 0.04;
          } else {
            // Turntable objects: slow controlled rotation around Y axis
            pivot.rotation.y += preset.autoRotateSpeed;
          }

          // Subtle floating bob
          if (preset.floatingBob) {
            pivot.position.y = Math.sin(elapsed * 1.6) * 0.03;
          }
        }

        // Smooth damping towards manual target when interacting
        if (pointerState.current.isDown) {
          pivot.rotation.y = userRotY;
          pivot.rotation.x = userRotX;
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (idleResumeTimerRef.current) {
        clearTimeout(idleResumeTimerRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isInView, effectiveModelUrl, modelUrl, preset]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerState.current.isDown = true;
    pointerState.current.startX = e.clientX;
    pointerState.current.startY = e.clientY;
    pointerState.current.lastX = e.clientX;
    pointerState.current.lastY = e.clientY;
    pointerState.current.hasDragged = false;
    setIsInteracting(true);

    if (idleResumeTimerRef.current) {
      clearTimeout(idleResumeTimerRef.current);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerState.current.isDown) return;

    const dx = e.clientX - pointerState.current.lastX;
    const dy = e.clientY - pointerState.current.lastY;
    const totalDist = Math.hypot(
      e.clientX - pointerState.current.startX,
      e.clientY - pointerState.current.startY
    );

    // Mark as dragged if moved past threshold
    if (totalDist > 5) {
      pointerState.current.hasDragged = true;
    }

    pointerState.current.lastX = e.clientX;
    pointerState.current.lastY = e.clientY;

    if (modelPivotRef.current) {
      const pivot = modelPivotRef.current;
      const rotSpeed = 0.009;

      if (preset.isPainting) {
        // Clamped tilt for paintings
        const newY = pivot.rotation.y + dx * rotSpeed;
        const newX = pivot.rotation.x + dy * rotSpeed;
        pivot.rotation.y = THREE.MathUtils.clamp(newY, -0.22, 0.22);
        pivot.rotation.x = THREE.MathUtils.clamp(newX, -0.15, 0.15);
      } else {
        pivot.rotation.y += dx * rotSpeed;
        pivot.rotation.x = THREE.MathUtils.clamp(pivot.rotation.x + dy * rotSpeed, -0.4, 0.4);
      }
    }
  };

  const handlePointerUp = () => {
    pointerState.current.isDown = false;

    // Smoothly resume idle rotation after 2.5s of inactivity
    idleResumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2500);
  };

  // Click handler that navigates ONLY if user did not drag
  const handleClick = (e: React.MouseEvent) => {
    if (pointerState.current.hasDragged) {
      // User was rotating the 3D model: prevent navigation
      e.preventDefault();
      e.stopPropagation();
      pointerState.current.hasDragged = false;
      return;
    }
    // Clean click: allowed to navigate
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden group/stage"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    >
      {/* Background Luxury Ambient Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120F0B]/40 via-transparent to-[#070605] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,106,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Fallback & Initial Image (Fades out when 3D model is loaded) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none ${
          isLoaded && !hasError ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={safeImagePath(fallbackImageUrl)}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-3 select-none drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out cursor-grab active:cursor-grabbing ${
          isLoaded && !hasError ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ display: hasError ? "none" : "block" }}
      />

      {/* Interactive Drag Hint Pill */}
      {isLoaded && !hasError && (
        <div
          className={`absolute bottom-3 right-3 z-10 transition-all duration-300 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-luxury-gold/30 text-[9px] uppercase tracking-wider text-luxury-champagne/90 backdrop-blur-sm ${
            isInteracting ? "opacity-90 scale-105 border-luxury-gold" : "opacity-0 group-hover/stage:opacity-80"
          }`}
        >
          <Rotate3D size={11} className="text-luxury-gold animate-spin-slow" />
          <span>{isInteracting ? "Rotating" : "Drag to Inspect"}</span>
        </div>
      )}
    </div>
  );
};

export default LotCard3DPreview;
