// components/3d/FloatingShapes.jsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

function FloatingShape({ position, color, shape, speed, delay }) {
  const meshRef = useRef();
  const startTime = useMemo(() => Date.now(), []);
  
  useFrame(() => {
    if (meshRef.current) {
      const elapsed = (Date.now() - startTime) * 0.001;
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(elapsed * speed) * 0.3;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.z += 0.005;
    }
  });
  
  let geometry;
  switch(shape) {
    case 'box':
      geometry = <boxGeometry args={[0.5, 0.5, 0.5]} />;
      break;
    case 'sphere':
      geometry = <sphereGeometry args={[0.3, 32, 32]} />;
      break;
    case 'torus':
      geometry = <torusGeometry args={[0.3, 0.1, 16, 64]} />;
      break;
    case 'cone':
      geometry = <coneGeometry args={[0.3, 0.6, 32]} />;
      break;
    default:
      geometry = <boxGeometry args={[0.5, 0.5, 0.5]} />;
  }
  
  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.7}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

export default function FloatingShapes() {
  const shapes = useMemo(() => [
    { position: [-3, 1, -2], color: '#8b5cf6', shape: 'box', speed: 0.5 },
    { position: [2.5, -1, -1.5], color: '#ec4899', shape: 'sphere', speed: 0.7 },
    { position: [0, 2, -3], color: '#10b981', shape: 'torus', speed: 0.4 },
    { position: [-1.5, -2, -2], color: '#f59e0b', shape: 'cone', speed: 0.6 },
    { position: [3.5, 0.5, -2.5], color: '#3b82f6', shape: 'sphere', speed: 0.8 },
    { position: [-2, 1.5, -3.5], color: '#ef4444', shape: 'torus', speed: 0.3 },
    { position: [1, -1, -4], color: '#06b6d4', shape: 'box', speed: 0.9 },
    { position: [-2.5, -0.5, -3], color: '#a855f7', shape: 'sphere', speed: 0.55 },
    { position: [2, 1.8, -3.2], color: '#f43f5e', shape: 'cone', speed: 0.45 },
  ], []);
  
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />
          <directionalLight position={[2, 3, 4]} intensity={0.8} />
          
          {shapes.map((shape, index) => (
            <FloatingShape key={index} {...shape} />
          ))}
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}