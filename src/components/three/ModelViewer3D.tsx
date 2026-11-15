"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Box,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
} from "lucide-react";

interface ModelViewer3DProps {
  modelUrl?: string | null;
  primaryImageUrl: string;
  galleryUrls?: string[];
  title: string;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelUrl,
  primaryImageUrl,
  galleryUrls = [],
  title,
}) => {
  const [activeTab, setActiveTab] = useState<"3d" | "photos">("3d");
  const [selectedImage, setSelectedImage] = useState<string>(primaryImageUrl);
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const allImages = [primaryImageUrl, ...galleryUrls];

  useEffect(() => {
    if (activeTab !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.5);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 2.5;
      controls.maxDistance = 7.5;
      controls.rotateSpeed = 0.8;
      controlsRef.current = controls;

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xf5f0e7, 0.7);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xe8dcc4, 2.0);
      dirLight1.position.set(5, 8, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xc6a66a, 0.8);
      dirLight2.position.set(-5, -4, -4);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xc6a66a, 2.0, 6);
      pointLight.position.set(0, 0, -2);
      scene.add(pointLight);

      // Procedural Jewel Model
      const group = new THREE.Group();

      const gemGeo = new THREE.OctahedronGeometry(1.3, 2);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xc6a66a,
        metalness: 0.9,
        roughness: 0.15,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      group.add(gem);

      const ringGeo = new THREE.TorusGeometry(1.9, 0.05, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xe8dcc4,
        metalness: 0.95,
        roughness: 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      scene.add(group);
      setHasWebGL(true);

      let floatTick = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        floatTick += 0.02;
        group.position.y = Math.sin(floatTick) * 0.06;
        group.rotation.y += 0.003;
        ring.rotation.z += 0.002;
        controls.update();
        renderer?.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!canvasRef.current || !renderer) return;
        const w = canvasRef.current.clientWidth;
        const h = canvasRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("WebGL blocked or unsupported by browser:", err);
      setHasWebGL(false);
    }
  }, [activeTab]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 0, 4.5);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current && cameraRef.current) {
      const camera = cameraRef.current;
      const target = controlsRef.current.target;
      const dir = camera.position.clone().sub(target).normalize();
      camera.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-2">
        <div className="flex items-center gap-3">
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
      {activeTab === "3d" ? (
        <div className="relative w-full h-[480px] bg-luxury-black rounded-sm border border-luxury-champagne/20 overflow-hidden shadow-2xl flex items-center justify-center select-none">
          {/* Subtle radial atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,166,106,0.12)_0%,rgba(24,24,24,0.6)_50%,rgba(17,17,17,0.98)_90%)] pointer-events-none" />

          {hasWebGL === false ? (
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
              onClick={() => handleZoom(-0.6)}
              className="p-1.5 text-luxury-champagne hover:text-luxury-gold transition-colors"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoom(0.6)}
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
              <p className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">Interactive Mesh</p>
              <p className="text-xs font-serif text-luxury-ivory font-normal truncate max-w-xs">{title}</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 text-luxury-champagne pointer-events-auto">
              <Compass size={13} className="text-luxury-gold" />
              <span className="text-[10px] tracking-luxury uppercase">Rotate 360°</span>
            </div>
          </div>
        </div>
      ) : (
        /* High-Res Photography Gallery Mode */
        <div className="flex flex-col gap-3">
          <div className="relative w-full h-[480px] bg-luxury-dark rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center group shadow-xl">
            <div className="relative w-full h-full p-8 transition-transform duration-300 ease-out" style={{ transform: `scale(${photoZoom})` }}>
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
