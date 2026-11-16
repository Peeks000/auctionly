"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { safeImagePath } from "@/lib/images";
import {
  Box,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Rotate3D,
  ShieldCheck,
  Maximize2,
  X,
  ExternalLink,
  Layers,
  Eye,
  Info,
} from "lucide-react";

export interface CuratorialArtifactItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  curatorialCategory: string;
  period: string;
  medium: string;
  dimensions: string;
  specimenCode: string;
  dossierSummary: string;
  imagePath: string;
  modelPath: string;
  altText: string;
  presetKey: string;
}

export const CURATORIAL_ARTIFACTS: CuratorialArtifactItem[] = [
  {
    id: "list-6",
    slug: "chola-dynasty-bronze-somaskanda-11th-century",
    title: "Chola Dynasty Bronze Somaskanda (11th Century CE)",
    shortTitle: "Antique Bronze Somaskanda Sculpture",
    curatorialCategory: "Sculptures & Decorative Art",
    period: "11th Century CE (Later Chola)",
    medium: "Panchaloha Bronze (Five Sacred Metals)",
    dimensions: "H: 48 cm, W: 42 cm, D: 22 cm",
    specimenCode: "ASI-TN-482-A",
    dossierSummary:
      "Masterpiece lost-wax bronze casting depicting Shiva and Uma enthroned with infant Skanda. Deep natural olive-green cuprite patina with ritual camphor deposits.",
    imagePath: "/images/Antique Bronze Somaskanda Sculpture.png",
    modelPath: "/3D-element/bronze-deity-family.glb",
    altText:
      "Antique Bronze Somaskanda Sculpture depicting Shiva, Uma, and infant Skanda, 11th Century Chola Dynasty",
    presetKey: "bronze-deity-family",
  },
  {
    id: "list-3",
    slug: "patek-philippe-ref-2499-yellow-gold-1978",
    title: "Patek Philippe Ref. 2499 Perpetual Calendar Chronograph (1978)",
    shortTitle: "Gold Patek Philippe Perpetual Calendar Chronograph",
    curatorialCategory: "Watches & Haute Horlogerie",
    period: "1978 (Fourth Series)",
    medium: "18K Yellow Gold & Hand-stitched Alligator",
    dimensions: "Diameter: 37.5 mm, Caliber 13-130",
    specimenCode: "PP-GENEVE-13130",
    dossierSummary:
      "Summit of mid-century Swiss horology with crisp hallmarks beneath stepped lugs. Accompanied by Patek Philippe Extract from Archives confirming 1978 manufacture.",
    imagePath: "/images/Gold Patek Philippe Perpetual Calendar Chronograph.png",
    modelPath: "/3D-element/luxury-wristwatch.glb",
    altText:
      "Gold Patek Philippe Perpetual Calendar Chronograph Ref. 2499 in 18K Yellow Gold with Silvered Matte Dial",
    presetKey: "luxury-wristwatch",
  },
  {
    id: "list-5",
    slug: "emperor-akbar-gold-mohur-agra-ah981",
    title: "Emperor Akbar Gold Mohur — Minted at Agra, AH 981 (1573 CE)",
    shortTitle: "Imperial Mughal Gold Mohur Coin",
    curatorialCategory: "Coins & Numismatics",
    period: "1573 CE (AH 981)",
    medium: "24K Pure Gold (10.92 grams)",
    dimensions: "Diameter: 21 mm, Weight: 10.92 g",
    specimenCode: "NGC-XF45-AGRA",
    dossierSummary:
      "Struck during the zenith of Emperor Jalal-ud-din Akbar's reign. Obverse presents the Kalima in flowing Naskh script flanked by the four Rashidun Caliphs.",
    imagePath: "/images/Imperial Mughal Gold Mohur Coin.png",
    modelPath: "/3D-element/gold-coin.glb",
    altText:
      "Imperial Mughal Gold Mohur Coin minted at Agra AH 981 (1573 CE) during Emperor Akbar's reign",
    presetKey: "gold-coin",
  },
  {
    id: "list-4",
    slug: "pierre-jeanneret-kangaroo-chairs-chandigarh-1955",
    title: "Pierre Jeanneret — Pair of Kangaroo Lounge Chairs (Chandigarh, c. 1955)",
    shortTitle: "Mid-Century Teak & Cane V-Leg Armchairs",
    curatorialCategory: "Vintage Design & Furniture",
    period: "c. 1955 (Chandigarh)",
    medium: "Solid Burma Teak & Natural Handwoven Cane",
    dimensions: "H: 75 cm, W: 60 cm, D: 70 cm",
    specimenCode: "CHAND-SEC1-TEAK",
    dossierSummary:
      "Designed by Pierre Jeanneret for Chandigarh's administrative sector. Sculptural Z-profile with original inventory stencils on underside and preserved hand-woven cane.",
    imagePath: "/images/Mid-Century Teak & Cane V-Leg Armchairs.png",
    modelPath: "/3D-element/wooden-lounge-chair.glb",
    altText:
      "Mid-Century Teak & Cane V-Leg Armchairs designed by Pierre Jeanneret for Chandigarh c. 1955",
    presetKey: "wooden-lounge-chair",
  },
  {
    id: "list-2",
    slug: "mf-husain-sun-chariot-horses-1972",
    title: "M.F. Husain (1915–2011) — 'The Sun Chariot Horses'",
    shortTitle: "Modernist Chariot & Horses Painting in Gilded Frame",
    curatorialCategory: "Fine Art & Modern Indian Masters",
    period: "1972",
    medium: "Oil on Heavy Canvas & Gilded Teak Float Frame",
    dimensions: "H: 122 cm, W: 183 cm (48 x 72 in)",
    specimenCode: "MFH-ND-1972-04",
    dossierSummary:
      "Monumental equestrian composition signed in Hindi and English. Intense ochres and raw brushwork embodying mythological dynamism and modern Indian vitality.",
    imagePath: "/images/Modernist Chariot & Horses Painting in Gilded Frame.png",
    modelPath: "/3D-element/horse-painting.glb",
    altText:
      "Modernist Chariot & Horses Painting in Gilded Frame by M.F. Husain (1972 oil on canvas)",
    presetKey: "horse-painting",
  },
  {
    id: "list-1",
    slug: "mughal-basra-pearl-emerald-sautoir-1840",
    title: "19th Century Mughal Basra Pearl & Uncut Emerald Sautoir",
    shortTitle: "Royal Mughal Pearl & Emerald Kundan Necklace",
    curatorialCategory: "Royal Jewels & Antiquities",
    period: "c. 1840 (Late Mughal)",
    medium: "24K Kundan Gold, 184 Basra Pearls & 34.5ct Emerald",
    dimensions: "Length: 58 cm, Weight: 214 g",
    specimenCode: "RAJ-JAIPUR-1840",
    dossierSummary:
      "Imperial sautoir from a princely Rajasthani treasury. 184 certified natural Basra saltwater pearls suspending a 34.50ct carved Colombian emerald with pristine meenakari enamel reverse.",
    imagePath: "/images/Royal Mughal Pearl & Emerald Kundan Necklace.png",
    modelPath: "/3D-element/jewelry-necklace.glb",
    altText:
      "Royal Mughal Pearl & Emerald Kundan Necklace with 184 natural Basra pearls and carved emerald medallion",
    presetKey: "jewelry-necklace",
  },
];

interface ModelViewer3DProps {
  modelUrl?: string | null;
  primaryImageUrl: string;
  galleryUrls?: string[];
  title: string;
  slug?: string;
  listingId?: string;
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

function resolveInitialArtifact(props: {
  slug?: string;
  modelUrl?: string | null;
  primaryImageUrl?: string;
  title?: string;
}): CuratorialArtifactItem {
  if (props.slug) {
    const bySlug = CURATORIAL_ARTIFACTS.find((a) => a.slug === props.slug);
    if (bySlug) return bySlug;
  }
  if (props.modelUrl) {
    const byModel = CURATORIAL_ARTIFACTS.find((a) => props.modelUrl?.includes(a.presetKey));
    if (byModel) return byModel;
  }
  if (props.primaryImageUrl) {
    const primary = props.primaryImageUrl;
    const decoded = decodeURIComponent(primary);
    const byImage = CURATORIAL_ARTIFACTS.find((a) =>
      decoded.includes(a.shortTitle) ||
      a.imagePath === primary ||
      a.imagePath.includes(primary)
    );
    if (byImage) return byImage;
  }
  if (props.title) {
    const rawTitle = props.title;
    const byTitle = CURATORIAL_ARTIFACTS.find(
      (a) => rawTitle.includes(a.shortTitle) || a.title.includes(rawTitle)
    );
    if (byTitle) return byTitle;
  }
  return CURATORIAL_ARTIFACTS[0];
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelUrl,
  primaryImageUrl,
  galleryUrls = [],
  title,
  slug,
  listingId,
}) => {
  const [selectedArtifact, setSelectedArtifact] = useState<CuratorialArtifactItem>(() =>
    resolveInitialArtifact({ slug, modelUrl, primaryImageUrl, title })
  );
  const [activeTab, setActiveTab] = useState<"photos" | "3d">("photos");
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const initialCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3));
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Keep selected artifact synchronized if incoming props change (e.g., lot navigation)
  useEffect(() => {
    setSelectedArtifact(resolveInitialArtifact({ slug, modelUrl, primaryImageUrl, title }));
  }, [slug, modelUrl, primaryImageUrl, title]);

  const preset = getViewerPreset(selectedArtifact.modelPath);

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

  // 3D Scene Initialization
  useEffect(() => {
    if (activeTab !== "3d" || !selectedArtifact.modelPath) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    setIsLoading(true);
    setLoadError(null);

    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;

    try {
      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 520;

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
        // Painting: restrict angles to preserve front-facing focus
        controls.minAzimuthAngle = -Math.PI / 4;
        controls.maxAzimuthAngle = Math.PI / 4;
        controls.minPolarAngle = Math.PI / 2 - 0.35;
        controls.maxPolarAngle = Math.PI / 2 + 0.35;
      } else {
        // Sculptures, watches, jewellery, furniture: 360 inspection
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
      if (
        preset.lightingTheme === "gold" ||
        preset.lightingTheme === "coin" ||
        preset.lightingTheme === "watch"
      ) {
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
        selectedArtifact.modelPath,
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
  }, [activeTab, selectedArtifact.modelPath, preset]);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* ====================================================================
          TOP NAV TABS: CURATORIAL PHOTOGRAPHY & INTERACTIVE 3D STAGE
         ==================================================================== */}
      <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            data-testid="tab-curatorial-photos"
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-luxury transition-all rounded-sm ${
              activeTab === "photos"
                ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium shadow-sm"
                : "text-luxury-champagne/60 hover:text-luxury-ivory"
            }`}
          >
            <ImageIcon size={14} />
            <span>Curatorial Photography</span>
          </button>

          <button
            data-testid="tab-3d-stage"
            onClick={() => setActiveTab("3d")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-luxury transition-all rounded-sm ${
              activeTab === "3d"
                ? "bg-luxury-gold/15 text-luxury-gold border-b-2 border-luxury-gold font-medium shadow-sm"
                : "text-luxury-champagne/60 hover:text-luxury-ivory"
            }`}
          >
            <Box size={14} />
            <span>Interactive 3D Stage</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-wider uppercase text-luxury-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
          <span>Synchronized 3D & Photographic Twin</span>
        </div>
      </div>

      {/* ====================================================================
          STAGE 1: CURATORIAL PHOTOGRAPHY MODE (MUSEUM-GRADE PRESENTATION)
         ==================================================================== */}
      {activeTab === "photos" && (
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[500px] sm:h-[560px] bg-[#070605] rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center group shadow-2xl">
            {/* Museum Gallery Lighting Atmosphere: Deep charcoal with warm amber halo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(212,175,55,0.08)_0%,rgba(18,15,11,0.65)_50%,rgba(7,6,5,0.98)_95%)] pointer-events-none" />

            {/* Subtle luxury geometric corner markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-luxury-gold/40 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-luxury-gold/40 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-luxury-gold/40 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-luxury-gold/40 pointer-events-none" />

            {/* Curatorial Specimen Image — 100% object-contain, complete artifact visible without cropping */}
            <div
              className="relative w-full h-full flex items-center justify-center p-6 sm:p-10 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${photoZoom})` }}
            >
              <Image
                src={safeImagePath(selectedArtifact.imagePath)}
                alt={selectedArtifact.altText}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-4 sm:p-8 select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.92)] transition-opacity duration-500 ease-out"
                priority
              />
            </div>

            {/* Top Left Specimen Badge */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-luxury-gold" />
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
                  Curatorial Specimen
                </span>
              </div>
              <span className="text-[9px] font-mono text-luxury-champagne/80 tracking-wider">
                {selectedArtifact.specimenCode}
              </span>
            </div>

            {/* Top Right Action Pill: Zoom Controls & Lightbox */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-luxury-black/85 backdrop-blur-md p-1 border border-luxury-champagne/20">
              <button
                onClick={() => setPhotoZoom(1)}
                className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm transition-colors ${
                  photoZoom === 1
                    ? "bg-luxury-gold/20 text-luxury-gold font-semibold"
                    : "text-luxury-champagne hover:text-luxury-ivory"
                }`}
                title="1x Framing"
                aria-label="1x Framing"
              >
                1x
              </button>
              <button
                onClick={() => setPhotoZoom(1.5)}
                className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm transition-colors ${
                  photoZoom === 1.5
                    ? "bg-luxury-gold/20 text-luxury-gold font-semibold"
                    : "text-luxury-champagne hover:text-luxury-ivory"
                }`}
                title="1.5x Macro Detail"
                aria-label="1.5x Macro"
              >
                1.5x
              </button>
              <button
                onClick={() => setPhotoZoom(2)}
                className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm transition-colors ${
                  photoZoom === 2
                    ? "bg-luxury-gold/20 text-luxury-gold font-semibold"
                    : "text-luxury-champagne hover:text-luxury-ivory"
                }`}
                title="2x Forensic Close-up"
                aria-label="2x Forensic"
              >
                2x
              </button>
              <button
                data-testid="lightbox-open-btn"
                onClick={() => setIsLightboxOpen(true)}
                className="p-1.5 text-luxury-champagne hover:text-luxury-gold border-l border-luxury-champagne/15 ml-0.5 transition-colors"
                title="Expand Lightbox"
                aria-label="Expand Lightbox"
              >
                <Maximize2 size={13} />
              </button>
            </div>

            {/* Bottom Bar: Artifact Plaque & 3D Switch Action */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
              <div className="bg-luxury-black/85 backdrop-blur-md px-3.5 py-2 border border-luxury-champagne/25 pointer-events-auto max-w-md">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">
                    {selectedArtifact.curatorialCategory}
                  </span>
                  <span className="text-luxury-muted text-[10px]">•</span>
                  <span className="text-[9px] font-sans text-luxury-champagne/80">
                    {selectedArtifact.period}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-serif text-luxury-ivory font-medium leading-snug line-clamp-1">
                  {selectedArtifact.shortTitle}
                </h3>
                <p className="text-[10px] text-luxury-muted mt-0.5 hidden sm:block truncate">
                  {selectedArtifact.medium}
                </p>
              </div>

              {/* Direct Synchronized 3D Switch CTA */}
              <button
                data-testid="btn-switch-to-3d"
                onClick={() => setActiveTab("3d")}
                className="pointer-events-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-luxury-gold/90 hover:bg-luxury-gold text-luxury-black font-semibold text-[10px] uppercase tracking-luxury shadow-lg transition-all rounded-sm shrink-0"
              >
                <Box size={13} />
                <span>Switch to 3D Inspection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          STAGE 2: INTERACTIVE 3D STAGE (PBR REAL-TIME 360 INSPECTION)
         ==================================================================== */}
      {activeTab === "3d" && (
        <div className="relative w-full h-[500px] sm:h-[560px] bg-[#070605] rounded-sm border border-luxury-champagne/20 overflow-hidden shadow-2xl flex items-center justify-center select-none">
          {/* Subtle radial atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,166,106,0.14)_0%,rgba(24,24,24,0.6)_50%,rgba(17,17,17,0.98)_90%)] pointer-events-none" />

          {/* Subtle luxury geometric corner markers */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-luxury-gold/40 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-luxury-gold/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-luxury-gold/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-luxury-gold/40 pointer-events-none" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-luxury-black/90 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin" />
              <p className="font-serif text-xs text-luxury-champagne uppercase tracking-widest">
                Calibrating 3D Curatorial Twin...
              </p>
            </div>
          )}

          {hasWebGL === false || loadError ? (
            <div className="relative w-full h-full flex items-center justify-center p-6">
              <Image
                src={safeImagePath(selectedArtifact.imagePath)}
                alt={selectedArtifact.altText}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4"
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

          {/* Bottom Stage Details & Switch Back CTA */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-none">
            <div className="bg-luxury-black/85 backdrop-blur-md px-3.5 py-2 border border-luxury-champagne/25 pointer-events-auto max-w-md">
              <p className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">
                Authentic PBR Digital Twin
              </p>
              <p className="text-xs sm:text-sm font-serif text-luxury-ivory font-normal truncate">
                {selectedArtifact.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-luxury-champagne/70 text-[10px]">
                {preset.isPainting ? (
                  <>
                    <Rotate3D size={12} className="text-luxury-gold" />
                    <span>Cinematic Parallax & Clamped Tilt</span>
                  </>
                ) : (
                  <>
                    <Compass size={12} className="text-luxury-gold" />
                    <span>360° Studio Orbit Inspection</span>
                  </>
                )}
              </div>
            </div>

            {/* Direct Switch to Curatorial Photography */}
            <button
              data-testid="btn-switch-to-photos"
              onClick={() => setActiveTab("photos")}
              className="pointer-events-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-luxury-black/90 hover:bg-luxury-gold/20 text-luxury-champagne hover:text-luxury-gold border border-luxury-champagne/30 font-medium text-[10px] uppercase tracking-luxury shadow-lg transition-all rounded-sm shrink-0"
            >
              <ImageIcon size={13} />
              <span>Switch to Curatorial Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SYNCHRONIZED CURATORIAL ARTIFACT SELECTOR (THE 6 MUSEUM MASTERPIECES)
         ==================================================================== */}
      <div className="bg-[#0A0907] border border-luxury-champagne/15 rounded-sm p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-luxury-champagne/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-luxury-gold" />
            <h4 className="text-xs uppercase tracking-luxury text-luxury-gold font-semibold">
              Curatorial Collection Specimen Synchronization
            </h4>
          </div>
          <span className="text-[10px] text-luxury-champagne/60 tracking-wider uppercase hidden sm:inline-block">
            6 Vetted Masterpieces Available for Dual-Inspection
          </span>
        </div>

        {/* 6 Specimen Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CURATORIAL_ARTIFACTS.map((artifact) => {
            const isSelected = selectedArtifact.id === artifact.id;
            return (
              <button
                key={artifact.id}
                data-testid={`specimen-item-${artifact.id}`}
                onClick={() => {
                  setSelectedArtifact(artifact);
                  setPhotoZoom(1);
                }}
                className={`flex flex-col text-left p-2 rounded-sm border transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-luxury-gold/15 border-luxury-gold ring-1 ring-luxury-gold/60 shadow-lg scale-[1.02]"
                    : "bg-[#050403] border-luxury-champagne/15 hover:border-luxury-gold/40 hover:bg-luxury-dark/40"
                }`}
              >
                {/* Active Indicator Pin */}
                {isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_#d4af37]" />
                )}

                {/* Individual Photograph Thumbnail (object-contain with zero crop) */}
                <div className="relative w-full h-20 bg-[#0B0907] rounded-sm overflow-hidden mb-2 border border-luxury-champagne/10 flex items-center justify-center p-1">
                  <Image
                    src={safeImagePath(artifact.imagePath)}
                    alt={artifact.altText}
                    fill
                    unoptimized
                    sizes="100px"
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-luxury-gold/80 font-mono line-clamp-1">
                    {artifact.period}
                  </span>
                  <span className="text-[11px] font-serif text-luxury-ivory font-medium line-clamp-2 leading-tight">
                    {artifact.shortTitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Lot Dossier Link (if visitor selected an artifact other than the host lot) */}
        {selectedArtifact.slug !== slug && (
          <div className="pt-2 flex items-center justify-between text-xs text-luxury-champagne/80 border-t border-luxury-champagne/10 mt-1">
            <span className="text-[11px] text-luxury-champagne/70 truncate">
              Viewing curatorial synchronization for:{" "}
              <strong className="text-luxury-ivory">{selectedArtifact.shortTitle}</strong>
            </span>
            <Link
              href={`/lot/${selectedArtifact.slug}`}
              className="inline-flex items-center gap-1 text-[11px] text-luxury-gold hover:text-luxury-goldLight uppercase tracking-wider font-medium shrink-0 ml-3"
            >
              <span>Enter Lot Bidding Room</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* ====================================================================
          FULLSCREEN LIGHTBOX MODAL (FORENSIC CURATORIAL INSPECTION)
         ==================================================================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-luxury-champagne/20">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
                High-Resolution Curatorial Dossier Inspection
              </span>
              <h2 className="font-serif text-base sm:text-lg text-luxury-ivory font-medium">
                {selectedArtifact.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-luxury-dark/90 p-1 border border-luxury-champagne/20 rounded-sm">
                <button
                  onClick={() => setPhotoZoom((prev) => Math.max(1, prev - 0.5))}
                  className="p-1.5 text-luxury-champagne hover:text-luxury-gold"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono text-luxury-gold px-2">
                  {photoZoom.toFixed(1)}x
                </span>
                <button
                  onClick={() => setPhotoZoom((prev) => Math.min(3, prev + 0.5))}
                  className="p-1.5 text-luxury-champagne hover:text-luxury-gold"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setPhotoZoom(1);
                }}
                className="p-2 bg-luxury-dark/90 border border-luxury-champagne/30 text-luxury-champagne hover:text-luxury-gold rounded-sm transition-colors"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Centered High-Res Image Viewport */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-4">
            <div
              className="relative w-full h-full max-w-5xl transition-transform duration-200 ease-out"
              style={{ transform: `scale(${photoZoom})` }}
            >
              <Image
                src={safeImagePath(selectedArtifact.imagePath)}
                alt={selectedArtifact.altText}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain p-4 select-none drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Footer Metadata Dossier */}
          <div className="pt-4 border-t border-luxury-champagne/20 flex flex-col sm:flex-row items-center justify-between text-xs text-luxury-champagne/70 gap-2">
            <div className="flex items-center gap-4">
              <span>
                Medium: <strong className="text-luxury-ivory">{selectedArtifact.medium}</strong>
              </span>
              <span>•</span>
              <span>
                Dimensions:{" "}
                <strong className="text-luxury-ivory">{selectedArtifact.dimensions}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={14} />
              <span>Certified Museum-Grade Curatorial Photography</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer3D;
