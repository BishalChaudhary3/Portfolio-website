// components/3d/ProjectCarousel3D.jsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Html, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function ProjectCard({ project, index, total, rotation }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const radius = 3.5;
  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group 
      position={[x, 0, z]} 
      rotation={[0, -angle, 0]}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? "#8b5cf6" : "#4c1d95"} 
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? "#a78bfa" : "#2e1065"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Front face texture */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Project Title */}
      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {project.title.substring(0, 12)}
      </Text>
      
      {/* Tech stack indicator */}
      <Text
        position={[0, -0.1, 0.1]}
        fontSize={0.07}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
      >
        {project.techStack?.[0] || 'React'}
      </Text>
      
      {/* Click indicator on hover */}
      {hovered && (
        <Text
          position={[0, -0.4, 0.1]}
          fontSize={0.06}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Click to view
        </Text>
      )}
    </group>
  );
}

function CenterInfo({ currentProject }) {
  return (
    <Html center>
      <div className="text-center pointer-events-auto">
        <motion.div
          key={currentProject?.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glassmorphic p-6 max-w-sm"
        >
          <h3 className="text-2xl font-bold mb-2">{currentProject?.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{currentProject?.description?.substring(0, 100)}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {currentProject?.techStack?.slice(0, 3).map(tech => (
              <span key={tech} className="px-2 py-1 text-xs bg-primary/20 rounded-full">
                {tech}
              </span>
            ))}
          </div>
          <a href={`/projects/${currentProject?.slug}`}>
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-primary to-dark rounded-lg text-sm font-semibold hover:shadow-lg transition">
              View Project →
            </button>
          </a>
        </motion.div>
      </div>
    </Html>
  );
}

export default function ProjectCarousel3D({ projects = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setRotation((prev) => prev + (Math.PI * 2) / projects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [projects.length]);
  
  if (projects.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 1, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <spotLight position={[0, 5, 5]} angle={0.3} intensity={0.8} />
          
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              rotation={rotation}
            />
          ))}
          
          <CenterInfo currentProject={projects[currentIndex]} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}