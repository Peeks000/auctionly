"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CanvasFallback from "./CanvasFallback";
import { Compass, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Sparkles } from "lucide-react";

interface HeroScene3DProps {
  fallbackImage?: string;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  fallbackImage = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isRotatingRef = useRef<boolean>(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      // Check reduced motion preference
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setIsRotating(false);
        isRotatingRef.current = false;
      }

      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 540;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.5);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = false;
      controls.minDistance = 2.8;
      controls.maxDistance = 8.5;
      controls.rotateSpeed = 0.8;
      controlsRef.current = controls;

      // Museum Multi-Point Lighting
      const ambientLight = new THREE.AmbientLight(0xf5f0e7, 0.65);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xe8dcc4, 2.2);
      dirLight1.position.set(6, 8, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xc6a66a, 1.0);
      dirLight2.position.set(-6, -4, -3);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xc6a66a, 2.5, 8);
      pointLight.position.set(0, 0, -2);
      scene.add(pointLight);

      const spotLight = new THREE.SpotLight(0xffffff, 3.0, 15, 0.5, 0.9);
      spotLight.position.set(0, 7, 3);
      scene.add(spotLight);

      // Procedural Royal Emerald & Kundan Gold Imperial Medallion
      const group = new THREE.Group();

      // Outer Torus Ring
      const outerRingGeo = new THREE.TorusGeometry(2.2, 0.08, 24, 64);
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xc6a66a,
        metalness: 0.92,
        roughness: 0.18,
      });
      const outerRing = new THREE.Mesh(outerRingGeo, goldMat);
      group.add(outerRing);

      // Secondary Concentric Gold Gyroscopic Ring
      const innerRingGeo = new THREE.TorusGeometry(1.75, 0.06, 20, 48);
      const champMat = new THREE.MeshStandardMaterial({
        color: 0xe8dcc4,
        metalness: 0.88,
        roughness: 0.22,
      });
      const innerRing = new THREE.Mesh(innerRingGeo, champMat);
      innerRing.rotation.x = Math.PI / 4;
      group.add(innerRing);

      // Central Octagonal Royal Colombian Emerald Crystal
      const gemGeo = new THREE.OctahedronGeometry(1.1, 1);
      const emeraldMat = new THREE.MeshStandardMaterial({
        color: 0x0b5345,
        metalness: 0.35,
        roughness: 0.1,
      });
      const gem = new THREE.Mesh(gemGeo, emeraldMat);
      group.add(gem);

      // Inner Core Accent
      const coreGeo = new THREE.OctahedronGeometry(0.5, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xe8dcc4,
        metalness: 0.95,
        roughness: 0.05,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Gold Bezel Studs
      for (let angle = 0; angle < 360; angle += 60) {
        const rad = (angle * Math.PI) / 180;
        const studGeo = new THREE.SphereGeometry(0.07, 16, 16);
        const studMat = new THREE.MeshStandardMaterial({
          color: 0xf5f0e7,
          metalness: 0.95,
          roughness: 0.1,
        });
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(1.35 * Math.cos(rad), 1.35 * Math.sin(rad), 0);
        group.add(stud);
      }

      scene.add(group);
      setHasWebGL(true);

      let floatClock = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        floatClock += 0.02;
        group.position.y = Math.sin(floatClock) * 0.08;

        if (isRotatingRef.current) {
          outerRing.rotation.z += 0.003;
          outerRing.rotation.x += 0.0015;
          innerRing.rotation.y -= 0.004;
          innerRing.rotation.z += 0.002;
          gem.rotation.y += 0.005;
          group.rotation.y += 0.002;
        }

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
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 0, 5.5);
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

  if (hasWebGL === false) {
    return (
      <CanvasFallback
        primaryImage={fallbackImage}
        title="Royal Heritage Rare Pendant"
        altText="Curated 3D Heritage Collectible"
      />
    );
  }

  return (
    <div
      className="relative w-full h-[540px] bg-luxury-black rounded-sm border border-luxury-champagne/20 overflow-hidden flex items-center justify-center select-none shadow-2xl"
      aria-label="3D Interactive Collectible Stage"
    >
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(198,166,106,0.12)_0%,rgba(36,36,36,0.4)_45%,rgba(17,17,17,0.98)_90%)] pointer-events-none" />

      {/* Hardware Accelerated WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Top Curatorial Badge */}
      <div className="absolute top-4 left-4 z-20 bg-luxury-black/85 backdrop-blur-md px-3 py-1.5 border border-luxury-champagne/25 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
        <span className="text-[10px] uppercase tracking-luxury text-luxury-ivory font-medium flex items-center gap-1.5">
          <Sparkles size={11} className="text-luxury-gold" />
          <span>Interactive 3D Stage (WebGL)</span>
        </span>
      </div>

      {/* Interactive Controls Overlay Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-luxury-black/85 backdrop-blur-md p-1 border border-luxury-champagne/20">
        <button
          onClick={() => setIsRotating(!isRotating)}
          aria-label={isRotating ? "Pause rotation" : "Play rotation"}
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title={isRotating ? "Pause auto-orbit" : "Resume auto-orbit"}
        >
          {isRotating ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={() => handleZoom(-0.8)}
          aria-label="Zoom in"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={() => handleZoom(0.8)}
          aria-label="Zoom out"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={handleResetCamera}
          aria-label="Reset 3D camera"
          className="p-1.5 text-luxury-champagne hover:text-luxury-gold hover:bg-luxury-dark/80 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Bottom Stage Details & Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-luxury-black/85 backdrop-blur-md px-3.5 py-2 border border-luxury-champagne/25 pointer-events-auto">
          <p className="text-[9px] tracking-luxury uppercase text-luxury-gold font-semibold">Curatorial Centerpiece</p>
          <p className="text-xs font-serif text-luxury-ivory font-normal">Mughal Imperial Emerald & Kundan Gold Medallion</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-luxury-black/85 backdrop-blur-md px-3 py-2 border border-luxury-champagne/25 text-luxury-champagne pointer-events-auto">
          <Compass size={14} className="text-luxury-gold" />
          <span className="text-[10px] tracking-luxury uppercase">Drag to Rotate • Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};

export default HeroScene3D;
