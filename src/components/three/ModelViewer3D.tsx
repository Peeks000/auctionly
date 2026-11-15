"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Box,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Rotate3D,
} from "lucide-react";

interface ModelViewer3DProps {
  modelUrl?: string | null;
  primaryImageUrl: string;
  galleryUrls?: string[];
  title: string;
}

interface ViewerPreset {
  fov: number;
  cameraDistanceMultiplier: number;
  initialRotation: [number, number, number];
  isPainting?: boolean;
  floatingBob?: boolean;
  lightingTheme: "gold" | "painting" | "watch" | "bronze" | "coin" | "wood";
}

const VIEWER_PRESETS: Record<string, ViewerPreset> = {
  "jewelry-necklace": {
    fov: 38,
    cameraDistanceMultiplier: 1.15,
    initialRotation: [0, 0, 0],
    floatingBob: true,
    lightingTheme: "gold",
  },
  "horse-painting": {
    fov: 36,
    cameraDistanceMultiplier: 1.05,
    initialRotation: [0, 0, 0],
    isPainting: true,
    floatingBob: false,
    lightingTheme: "painting",
  },
  "luxury-wristwatch": {
    fov: 38,
    cameraDistanceMultiplier: 1.15,
    initialRotation: [0.12, 0.45, 0],
    floatingBob: false,
    lightingTheme: "watch",
  },
  "bronze-deity-family": {
    fov: 40,
    cameraDistanceMultiplier: 1.2,
    initialRotation: [0, 0, 0],
    floatingBob: false,
    lightingTheme: "bronze",
  },
  "gold-coin": {
    fov: 36,
    cameraDistanceMultiplier: 1.12,
    initialRotation: [0.18, 0.25, 0.08],
    floatingBob: true,
    lightingTheme: "coin",
  },
  "wooden-lounge-chair": {
    fov: 42,
    cameraDistanceMultiplier: 1.28,
    initialRotation: [0.14, -0.4, 0],
    floatingBob: false,
    lightingTheme: "wood",
  },
};

function getViewerPreset(url?: string | null): ViewerPreset {
  if (!url) {
    return {
      fov: 38,
      cameraDistanceMultiplier: 1.15,
      initialRotation: [0, 0, 0],
      lightingTheme: "gold",
    };
  }
  for (const key of Object.keys(VIEWER_PRESETS)) {
    if (url.includes(key)) {
      return VIEWER_PRESETS[key];
    }
  }
  return {
    fov: 38,
    cameraDistanceMultiplier: 1.15,
    initialRotation: [0, 0, 0],
    lightingTheme: "gold",
  };
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelUrl,
  primaryImageUrl,
  galleryUrls = [],
  title,
}) => {
  const [activeTab, setActiveTab] = useState<"3d" | "photos">(modelUrl ? "3d" : "photos");
  const [selectedImage, setSelectedImage] = useState<string>(primaryImageUrl);
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const initialCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3));
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);

  const allImages = [primaryImageUrl, ...galleryUrls];
  const preset = getViewerPreset(modelUrl);

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.copy(initialCameraPosRef.current);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      if (modelPivotRef.current) {
        modelPivotRef.current.rotation.set(
          preset.initialRotation[0],
          preset.initialRotation[1],
          preset.initialRotation[2]
        );
      }
    }
  }, [preset]);

  const handleZoom = (factor: number) => {
    if (controlsRef.current && cameraRef.current) {
      const camera = cameraRef.current;
      const target = controlsRef.current.target;
      const dir = camera.position.clone().sub(target);
      camera.position.addScaledVector(dir, factor);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    if (activeTab !== "3d" || !modelUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    setIsLoading(true);
    setLoadError(null);

    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;

    try {
      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(preset.fov, width / height, 0.05, 50);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.rotateSpeed = 0.8;

      if (preset.isPainting) {
        // Painting: restrict polar and azimuthal angles to preserve front-facing focus
        controls.minAzimuthAngle = -Math.PI / 4;
        controls.maxAzimuthAngle = Math.PI / 4;
        controls.minPolarAngle = Math.PI / 2 - 0.35;
        controls.maxPolarAngle = Math.PI / 2 + 0.35;
      } else {
        // Sculptures, watches, jewellery: full 360 horizontal inspection
        controls.maxPolarAngle = Math.PI / 2 + 0.25;
        controls.minPolarAngle = Math.PI / 6;
      }

      controlsRef.current = controls;

      // Studio Lighting tailored to material themes
      const ambientLight = new THREE.AmbientLight(
        preset.lightingTheme === "painting" ? 0xffffff : 0xf7f0e3,
        preset.lightingTheme === "painting" ? 1.4 : 1.1
      );
      scene.add(ambientLight);

      // Primary Key Light
      const keyLight = new THREE.DirectionalLight(
        preset.lightingTheme === "gold" || preset.lightingTheme === "coin" ? 0xf5e4c0 : 0xffffff,
        preset.lightingTheme === "watch" || preset.lightingTheme === "coin" ? 2.5 : 1.9
      );
      keyLight.position.set(4, 5, 5);
      keyLight.castShadow = true;
      scene.add(keyLight);

      // Warm Secondary Fill Light
      const fillLight = new THREE.DirectionalLight(0xc6a66a, 0.95);
      fillLight.position.set(-4, -2, 3);
      scene.add(fillLight);

      // Top Backlight / Rim
      const rimLight = new THREE.DirectionalLight(0xe8dcc4, 1.3);
      rimLight.position.set(0, 5, -4);
      scene.add(rimLight);

      // Golden Specular Accent for metals
      if (preset.lightingTheme === "gold" || preset.lightingTheme === "coin" || preset.lightingTheme === "watch") {
        const pointGlint = new THREE.PointLight(0xd4af37, 1.8, 8);
        pointGlint.position.set(2, 2, 2.5);
        scene.add(pointGlint);
      }

      // Model Pivot Group
      const pivot = new THREE.Group();
      scene.add(pivot);
      modelPivotRef.current = pivot;

      // Load the actual GLB model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (isDisposed) return;
          const model = gltf.scene;

          // Enable shadows and calibrate roughness
          model.traverse((child) => {
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

          // Calculate bounding box and center
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.set(-center.x, -center.y, -center.z);
          pivot.add(model);

          // Calculate camera distance for full framing
          const maxDim = Math.max(size.x, size.y, size.z);
          const fovRad = (camera.fov * Math.PI) / 180;
          let distance = (maxDim / 2 / Math.tan(fovRad / 2)) * preset.cameraDistanceMultiplier;

          const aspect = width / height;
          if (aspect < 1) {
            distance = distance / aspect;
          }

          camera.position.set(0, 0, Math.max(distance, 1.3));
          camera.lookAt(0, 0, 0);
          initialCameraPosRef.current.copy(camera.position);

          controls!.minDistance = distance * 0.5;
          controls!.maxDistance = distance * 2.8;
          controls!.target.set(0, 0, 0);
          controls!.update();

          pivot.rotation.set(
            preset.initialRotation[0],
            preset.initialRotation[1],
            preset.initialRotation[2]
          );

          setHasWebGL(true);
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.error("Error loading product detail 3D model:", err);
          if (!isDisposed) {
            setLoadError("Could not load 3D asset.");
            setIsLoading(false);
            setHasWebGL(false);
          }
        }
      );

      // Render Loop
      let clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed) return;
        animFrameIdRef.current = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        if (preset.floatingBob && pivot) {
          pivot.position.y = Math.sin(elapsed * 1.5) * 0.04;
        }

        controls?.update();
        renderer?.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!canvasRef.current || !renderer || !camera) return;
        const w = canvasRef.current.clientWidth;
        const h = canvasRef.current.clientHeight;
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
        controls?.dispose();
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("WebGL initialization failed:", err);
      setHasWebGL(false);
      setIsLoading(false);
    }
  }, [activeTab, modelUrl, preset]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-2">
        <div className="flex items-center gap-3">
          {modelUrl && (
            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-luxury transition-all rounded-sm ${
                activeTab === "3d"
                  ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium"
                  : "text-luxury-champagne/60 hover:text-luxury-ivory"
              }`}
            >
              <Box size={14} />
              <span>Interactive 3D Stage</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-luxury transition-all rounded-sm ${
              activeTab === "photos"
                ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium"
                : "text-luxury-champagne/60 hover:text-luxury-ivory"
            }`}
          >
            <ImageIcon size={14} />
            <span>Curatorial Photography ({allImages.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[10px] tracking-wider uppercase text-luxury-muted">
          PBR Real-Time Shader Pipeline
        </span>
      </div>

      {/* Main Display Stage */}
      {activeTab === "3d" && modelUrl ? (
        <div className="relative w-full h-[480px] bg-luxury-black rounded-sm border border-luxury-champagne/20 overflow-hidden shadow-2xl flex items-center justify-center select-none">
          {/* Subtle radial atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,166,106,0.14)_0%,rgba(24,24,24,0.6)_50%,rgba(17,17,17,0.98)_90%)] pointer-events-none" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-luxury-black/90 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin" />
              <p className="font-serif text-xs text-luxury-champagne uppercase tracking-widest">
                Loading 3D Curatorial Model...
              </p>
            </div>
          )}

          {hasWebGL === false || loadError ? (
            <div className="relative w-full h-full flex items-center justify-center p-6">
              <Image
                src={primaryImageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
            />
          )}

          {/* Top Left Badge */}
          <div className="absolute top-4 left-4 z-20 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
            <span className="text-[10px] uppercase tracking-luxury text-luxury-ivory font-medium">
              3D Real-Time Inspection
            </span>
          </div>

          {/* 3D Control Action Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-luxury-black/85 backdrop-blur-md p-1 border border-luxury-champagne/20">
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-1.5 text-luxury-champagne hover:text-luxury-gold transition-colors"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoom(0.25)}
              className="p-1.5 text-luxury-champagne hover:text-luxury-gold transition-colors"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 text-luxury-champagne hover:text-luxury-gold transition-colors"
              title="Reset View"
              aria-label="Reset camera"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Bottom Stage Details */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 pointer-events-auto">
              <p className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">
                Authentic PBR Specimen
              </p>
              <p className="text-xs font-serif text-luxury-ivory font-normal truncate max-w-xs">{title}</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 text-luxury-champagne pointer-events-auto">
              {preset.isPainting ? (
                <>
                  <Rotate3D size={13} className="text-luxury-gold" />
                  <span className="text-[10px] tracking-luxury uppercase">Cinematic Parallax Tilt</span>
                </>
              ) : (
                <>
                  <Compass size={13} className="text-luxury-gold" />
                  <span className="text-[10px] tracking-luxury uppercase">Rotate 360°</span>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* High-Res Photography Gallery Mode */
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-[480px] bg-luxury-dark rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center group shadow-xl">
            <div
              className="relative w-full h-full p-8 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${photoZoom})` }}
            >
              <Image
                src={selectedImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 select-none drop-shadow-2xl"
                priority
              />
            </div>

            {/* Gallery Zoom Pill */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-luxury-black/85 backdrop-blur-md p-1 border border-luxury-champagne/25">
              <button
                onClick={() => setPhotoZoom((prev) => (prev > 1 ? 1 : 1.5))}
                className="p-1.5 text-luxury-champagne hover:text-luxury-gold text-[10px] uppercase tracking-wider flex items-center gap-1"
                aria-label="Toggle Macro Zoom"
              >
                <ZoomIn size={14} />
                <span>{photoZoom > 1 ? "1x Zoom" : "1.5x Macro"}</span>
              </button>
            </div>

            {/* Curatorial 2D Label */}
            <div className="absolute bottom-4 left-4 z-20 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 text-[10px] uppercase tracking-luxury text-luxury-champagne">
              Curatorial Photographic Specimen
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto py-2">
            {allImages.map((url, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(url);
                  setPhotoZoom(1);
                }}
                className={`relative w-20 h-20 shrink-0 rounded-sm overflow-hidden border transition-all ${
                  selectedImage === url
                    ? "border-luxury-gold ring-1 ring-luxury-gold scale-105"
                    : "border-luxury-champagne/25 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`${title} view ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer3D;
