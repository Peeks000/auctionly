"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Sparkles, RotateCcw, Compass, Eye, ShieldCheck, Box } from "lucide-react";

interface MascotViewer3DProps {
  className?: string;
  modelUrl?: string;
}

export const MascotViewer3D: React.FC<MascotViewer3DProps> = ({
  className = "",
  modelUrl = "/3D-element/auctionly-mascot.glb",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for animation loop and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Smooth mouse coordinates for parallax / looking effect
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const idleTimer = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Reset camera view
  const handleResetView = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !modelGroupRef.current) return;
    controlsRef.current.reset();
    cameraRef.current.position.set(0, 0.2, 2.6);
    cameraRef.current.lookAt(0, 0, 0);
    modelGroupRef.current.rotation.set(0, 0, 0);
    mousePos.current = { x: 0, y: 0, targetX: 0, targetY: 0 };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 420;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 2.6);
    cameraRef.current = camera;

    // 3. WebGL Renderer
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
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
    } catch (err) {
      console.error("WebGL initialization failed:", err);
      setLoadError("WebGL not available in this environment.");
      setIsLoading(false);
      return;
    }

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.6;
    controls.maxDistance = 4.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't go below floor
    controls.minPolarAngle = Math.PI / 5;
    controls.rotateSpeed = 0.7;
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      isDragging.current = true;
      setIsInteracting(true);
    });
    controls.addEventListener("end", () => {
      isDragging.current = false;
      idleTimer.current = Date.now();
      setTimeout(() => {
        if (!isDragging.current) setIsInteracting(false);
      }, 2500);
    });

    // 5. Museum Lighting Rig
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.75);
    scene.add(ambientLight);

    // Warm directional key light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(3.5, 4.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Gold rim light from rear-left
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.4);
    rimLight.position.set(-3.5, 2.5, -3.0);
    scene.add(rimLight);

    // Upward soft gold fill
    const bounceLight = new THREE.PointLight(0xc6a66a, 1.2, 8);
    bounceLight.position.set(0, -1.2, 1.5);
    scene.add(bounceLight);

    // 6. Ground Pedestal Soft Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.0, 2.0);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      grad.addColorStop(0.35, "rgba(10, 9, 7, 0.5)");
      grad.addColorStop(0.7, "rgba(198, 166, 106, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.88;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 7. Ambient Golden Floating Micro-Particles
    const particleCount = 48;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOffsets = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5);
      const rad = 0.8 + Math.random() * 0.9;
      particlePositions[i * 3] = Math.cos(angle) * rad;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      particlePositions[i * 3 + 2] = Math.sin(angle) * rad;
      particleOffsets[i] = Math.random() * Math.PI * 2;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Particle Canvas Texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      pGrad.addColorStop(0, "rgba(255, 230, 160, 1.0)");
      pGrad.addColorStop(0.4, "rgba(212, 175, 55, 0.7)");
      pGrad.addColorStop(1, "rgba(212, 175, 55, 0)");
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      map: pTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. Model Group Container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 9. Load Mascot GLB with GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;

        // Auto-center and normalize scale
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reposition geometry to pivot around its visual center
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y;
        gltf.scene.position.z = -center.z;

        // Scale to ideal museum showcase height (~1.45 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1.45;
        const scale = targetSize / maxDim;

        const innerGroup = new THREE.Group();
        innerGroup.add(gltf.scene);
        innerGroup.scale.set(scale, scale, scale);

        // Enhance materials with luxury sheen & shadows
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.22, mat.roughness ?? 0.4);
              mat.metalness = Math.min(0.85, mat.metalness ?? 0.35);
              mat.envMapIntensity = 1.3;
            }
          }
        });

        modelGroup.add(innerGroup);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Failed to load mascot GLB:", error);
        if (!isDisposed) {
          setLoadError("Could not load 3D model asset.");
          setIsLoading(false);
        }
      }
    );

    // 10. Pointer Tracking for Dynamic Gaze / Parallax
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const inContainer =
        e.clientX >= rect.left - 100 &&
        e.clientX <= rect.right + 100 &&
        e.clientY >= rect.top - 100 &&
        e.clientY <= rect.bottom + 100;

      if (inContainer) {
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        mousePos.current.targetX = Math.max(-1, Math.min(1, x));
        mousePos.current.targetY = Math.max(-1, Math.min(1, y));
      } else {
        mousePos.current.targetX = 0;
        mousePos.current.targetY = 0;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 11. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 12. 60 FPS Render & Animation Loop
    let clock = new THREE.Clock();
    let idleBaseRotation = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      if (modelGroup) {
        // Floating organic levitation (breathing on Y axis)
        const floatY = Math.sin(elapsed * 1.8) * 0.06;
        modelGroup.position.y = floatY;

        // Animate pedestal shadow to breathe with floating
        if (shadowMeshRef.current) {
          const shadowScale = 1 + floatY * 0.8;
          shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
          shadowMat.opacity = 0.72 - floatY * 1.5;
        }

        // When user is not dragging, gently auto-rotate and track mouse
        if (!isDragging.current) {
          idleBaseRotation += delta * 0.45;
          // Subtly turn model to track mouse cursor + ambient spin
          const targetRotY = idleBaseRotation + mousePos.current.x * 0.45;
          const targetRotX = -mousePos.current.y * 0.22;
          const targetRotZ = -mousePos.current.x * 0.12;

          modelGroup.rotation.y = targetRotY;
          modelGroup.rotation.x = targetRotX;
          modelGroup.rotation.z = targetRotZ;
        }
      }

      // Animate ambient gold particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.08;
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3 + 1;
          const initialY = particlePositions[idx];
          arr[idx] = initialY + Math.sin(elapsed * 1.2 + particleOffsets[i]) * 0.08;
        }
        posAttr.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[420px] sm:h-[460px] md:h-[480px] rounded-lg border border-luxury-gold/30 bg-gradient-to-b from-[#110F0C] via-[#0A0907] to-[#050504] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.85)] group ${className}`}
    >
      {/* Decorative Luxury Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-luxury-gold/60 pointer-events-none z-20" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-luxury-gold/60 pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-luxury-gold/60 pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-luxury-gold/60 pointer-events-none z-20" />

      {/* Atmospheric Gallery Spotlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(198,166,106,0.18)_0%,transparent_70%)] pointer-events-none z-10" />

      {/* Top Header Badge */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0A0907]/85 border border-luxury-gold/40 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
          <Sparkles size={12} className="text-luxury-gold animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-luxury-gold font-medium">
            3D Curatorial Mascot
          </span>
        </div>

        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          data-cursor="RESET"
          className="pointer-events-auto p-1.5 rounded-full bg-[#0A0907]/85 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-champagne hover:text-luxury-gold transition-colors backdrop-blur-md"
          title="Reset 3D View"
          aria-label="Reset 3D Perspective"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* WebGL Hardware Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        data-cursor="INSPECT 3D"
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none block"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0907]/90 backdrop-blur-md text-center p-4">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border border-luxury-gold/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-luxury-gold animate-spin" />
            <Box size={20} className="absolute inset-0 m-auto text-luxury-gold animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-serif text-luxury-gold font-medium">
            Curating 3D Mascot
          </span>
          <span className="text-[10px] text-luxury-champagne/60 mt-1 tracking-wider">
            Loading high-fidelity museum mesh...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && !isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0907]/95 p-6 text-center">
          <ShieldCheck size={28} className="text-luxury-gold/60 mb-2" />
          <p className="text-xs text-luxury-champagne/80 max-w-xs">{loadError}</p>
        </div>
      )}

      {/* Bottom Interactive Prompt Pill */}
      <div className="absolute bottom-3.5 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0A0907]/80 border border-luxury-gold/30 px-3.5 py-1 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 group-hover:border-luxury-gold/60">
          <Compass size={11} className={`text-luxury-gold ${isInteracting ? "animate-spin" : ""}`} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-luxury-champagne/90 font-light">
            {isInteracting ? "Viewing Custom Angle" : "Drag to Rotate 360° • Mouse Tracking Active"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MascotViewer3D;