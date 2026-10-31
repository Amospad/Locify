'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGeometry() {
  const meshRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={meshRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[3, 0.5, 16, 100]} />
          <meshStandardMaterial 
            color="#2F5D9F" 
            metalness={0.8}
            roughness={0.2}
            emissive="#2F5D9F"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      <Float speed={2} floatIntensity={2}>
        <mesh position={[5, 3, 2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#00C853" 
            emissive="#00C853"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setFallback(isMobile || prefersReduced);
  }, []);

  if (fallback) {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#0B1220] to-[#1a2335]" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(60%_60%_at_50%_40%,rgba(47,93,159,0.35),transparent_60%),radial-gradient(40%_40%_at_70%_70%,rgba(0,200,83,0.25),transparent_60%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-64 rounded-full bg-gradient-to-br from-acero/20 to-verde-esmeralda/20 blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#2F5D9F" />
          <FloatingGeometry />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
