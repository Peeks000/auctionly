"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural Fine Art / Jewelry Gemstone Stage for lots
 */
function ProceduralJewelModel({ title }: { title: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Core Gemstone */}
        <mesh>
          <octahedronGeometry args={[1.3, 2]} />
          <meshStandardMaterial
            color="#C6A66A"
            metalness={0.9}
            roughness={0.15}
            wireframe={false}
          />
        </mesh>

        {/* Outer Orbit Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.9, 0.05, 16, 48]} />
          <meshStandardMaterial color="#E8DCC4" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

interface ModelViewerCanvasProps {
  title: string;
  controlsRef: React.MutableRefObject<any>;
}

export default function ModelViewerCanvas({ title, controlsRef }: ModelViewerCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="cursor-grab active:cursor-grabbing relative z-10"
    >
      <ambientLight intensity={0.7} color="#F5F0E7" />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#E8DCC4" />
      <directionalLight position={[-5, -4, -4]} intensity={0.8} color="#C6A66A" />
      <pointLight position={[0, 0, -2]} intensity={2.0} color="#C6A66A" />

      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#333" wireframe />
          </mesh>
        }
      >
        <ProceduralJewelModel title={title} />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={7.5}
        dampingFactor={0.07}
        rotateSpeed={0.8}
      />
    </Canvas>
  );
}
