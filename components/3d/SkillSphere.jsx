// components/3d/SkillSphere.jsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Html, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

function SkillTag({ skill, position, color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.lookAt(0, 0, 0);
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? color : "#2d2d2d"} 
          metalness={0.5}
          roughness={0.4}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.12}
        color={hovered ? "#ffffff" : "#d1d5db"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.ttf"
      >
        {skill.name}
      </Text>
      
      {/* Proficiency ring */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[0.22, 0.28, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

function SkillSphereComponent({ skills }) {
  const groupRef = useRef();
  const [hoveredSkill, setHoveredSkill] = useState(null);
  
  // Distribute skills on a sphere
  const positions = useMemo(() => {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const numSkills = skills.length;
    const positions = [];
    
    for (let i = 0; i < numSkills; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numSkills);
      
      const radius = 2.2;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push({ x, y, z });
    }
    
    return positions;
  }, [skills]);
  
  // Color mapping based on category
  const getColor = (category) => {
    const colors = {
      frontend: '#8b5cf6',
      backend: '#ec4899',
      tools: '#10b981',
      default: '#f59e0b'
    };
    return colors[category] || colors.default;
  };
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.001;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Core sphere */}
      <Sphere args={[0.8, 64, 64]}>
        <meshStandardMaterial 
          color="#4c1d95" 
          metalness={0.8}
          roughness={0.2}
          emissive="#2e1065"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      {/* Glowing aura */}
      <Sphere args={[0.9, 32, 32]}>
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* Skill tags */}
      {skills.map((skill, index) => (
        <SkillTag
          key={skill.id}
          skill={skill}
          position={[positions[index].x, positions[index].y, positions[index].z]}
          color={getColor(skill.category)}
        />
      ))}
    </group>
  );
}

export default function SkillSphere({ skills = [] }) {
  const [loading, setLoading] = useState(true);
  
  // Default skills if none provided
  const defaultSkills = [
    { id: 1, name: 'React', category: 'frontend' },
    { id: 2, name: 'Next.js', category: 'frontend' },
    { id: 3, name: 'Node.js', category: 'backend' },
    { id: 4, name: 'Python', category: 'backend' },
    { id: 5, name: 'Tailwind', category: 'frontend' },
    { id: 6, name: 'MongoDB', category: 'backend' },
    { id: 7, name: 'Docker', category: 'tools' },
    { id: 8, name: 'Git', category: 'tools' },
    { id: 9, name: 'AWS', category: 'tools' },
    { id: 10, name: 'GraphQL', category: 'backend' },
  ];
  
  const displaySkills = skills.length > 0 ? skills : defaultSkills;
  
  setTimeout(() => setLoading(false), 1000);
  
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <Suspense fallback={
          <Html center>
            <div className="text-white">Loading 3D Skills Sphere...</div>
          </Html>
        }>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <spotLight position={[0, 5, 5]} angle={0.3} intensity={0.8} />
          <directionalLight position={[2, 3, 4]} intensity={0.6} />
          
          <SkillSphereComponent skills={displaySkills} />
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            autoRotate={false}
            minDistance={3}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">✨ Drag to rotate sphere • Hover skills to highlight ✨</p>
      </div>
    </div>
  );
}