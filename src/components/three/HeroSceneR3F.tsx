"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural Royal Emerald & Kundan Gold Imperial Medallion
 */
function RoyalHeritageSculpture({ isRotating }: { isRotating: boolean }) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!isRotating) return;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.2;
      outerRingRef.current.rotation.x += delta * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.25;
      innerRingRef.current.rotation.z += delta * 0.15;
    }
    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 0.35;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Outer Celestial Kundan Gold Ring */}
        <mesh ref={outerRingRef}>
          <torusGeometry args={[2.2, 0.08, 24, 64]} />
          <meshStandardMaterial
            color="#C6A66A"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Secondary Concentric Gold Gyroscopic Ring */}
        <mesh ref={innerRingRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.75, 0.06, 20, 48]} />
          <meshStandardMaterial
            color="#E8DCC4"
            metalness={0.88}
            roughness={0.22}
          />
        </mesh>

        {/* Central Octagonal Royal Colombian Emerald Crystal */}
        <mesh ref={gemRef}>
          <octahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color="#0B5345"
            metalness={0.35}
            roughness={0.1}
          />
        </mesh>

        {/* Inner Diamond Core Accent */}
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#E8DCC4"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Surrounding Gold Bezel Studs */}
        {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const x = 1.35 * Math.cos(rad);
          const y = 1.35 * Math.sin(rad);
          return (
            <mesh key={idx} position={[x, y, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#F5F0E7"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

interface HeroSceneR3FProps {
  isRotating: boolean;
  controlsRef: React.MutableRefObject<any>;
}

export default function HeroSceneR3F({ isRotating, controlsRef }: HeroSceneR3FProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="cursor-grab active:cursor-grabbing relative z-10"
    >
      <ambientLight intensity={0.6} color="#F5F0E7" />
      <directionalLight position={[6, 8, 5]} intensity={2.2} color="#E8DCC4" />
      <directionalLight position={[-6, -4, -3]} intensity={1.0} color="#C6A66A" />
      <pointLight position={[0, 0, -2]} intensity={2.5} color="#C6A66A" distance={8} />
      <spotLight
        position={[0, 7, 3]}
        intensity={3.0}
        angle={0.5}
        penumbra={0.9}
        color="#FFFFFF"
      />

      <Suspense fallback={null}>
        <RoyalHeritageSculpture isRotating={isRotating} />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={3.0}
        maxDistance={8.5}
        dampingFactor={0.06}
        rotateSpeed={0.8}
      />
    </Canvas>
  );
}
