'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
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
      {/* Central parking structure - abstract */}
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Main platform */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 0.5, 6]} />
          <meshStandardMaterial 
            color="#2F5D9F" 
            metalness={0.8}
            roughness={0.2}
            emissive="#2F5D9F"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Floating platforms */}
        {[1, 2, 3].map((i) => (
          <mesh key={i} position={[0, i * 2.5, 0]}>
            <boxGeometry args={[6 - i * 0.5, 0.3, 4 - i * 0.3]} />
            <meshStandardMaterial 
              color={i === 1 ? "#2F5D9F" : i === 2 ? "#1F2937" : "#00C853"}
              metalness={0.9}
              roughness={0.1}
              emissive={i === 1 ? "#2F5D9F" : i === 2 ? "#1F2937" : "#00C853"}
              emissiveIntensity={0.15}
            />
          </mesh>
        ))}

        {/* Parking slots - glowing lines */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 0.3, -1.5 + i * 1.2]}>
            {[0, 1, 2, 3].map((j) => (
              <mesh key={j} position={[j * 1.8 - 2.7, 0, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.05]} />
                <meshStandardMaterial 
                  color="#00C853" 
                  emissive="#00C853"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Ambient glowing orbs */}
      <Float speed={1.5} floatIntensity={2}>
        <mesh position={[6, 4, 4]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#2F5D9F" 
            emissive="#2F5D9F"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      
      <Float speed={2} floatIntensity={1.5}>
        <mesh position={[-5, -3, 5]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#00C853" 
            emissive="#00C853"
            emissiveIntensity={0.7}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0"
    >
      <Canvas
        camera={{ position: [10, 8, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} fade />
          
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#2F5D9F" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#00C853" />
          
          <FloatingGeometry />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-fondo/0 via-fondo/20 to-fondo pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-acero/5 via-transparent to-verde-esmeralda/5 pointer-events-none" />
    </motion.div>
  );
}
