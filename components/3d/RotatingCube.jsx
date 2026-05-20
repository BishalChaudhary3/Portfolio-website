// components/3d/RotatingCube.jsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

function Cube({ colors, speed = 0.01 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 1.2;
      meshRef.current.rotation.z += speed * 0.8;
    }
  });
  
  // Create materials for each face
  const materials = colors.map(color => 
    new THREE.MeshStandardMaterial({ 
      color, 
      metalness: 0.6, 
      roughness: 0.3,
      emissive: color,
      emissiveIntensity: hovered ? 0.3 : 0.1
    })
  );
  
  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      {materials.map((material, i) => (
        <primitive key={i} attach={`material-${i}`} object={material} />
      ))}
    </mesh>
  );
}

export default function RotatingCube({ 
  colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
  speed = 0.01,
  title = "3D Cube"
}) {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <Suspense fallback={
          <Html center>
            <div className="text-white">Loading 3D Cube...</div>
          </Html>
        }>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <directionalLight position={[2, 3, 4]} intensity={0.8} />
          
          <Cube colors={colors} speed={speed} />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {title && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      )}
    </div>
  );
}