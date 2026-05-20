// components/3d/Avatar3D.jsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function AvatarModel({ scrollY }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (group.current) {
      // Gentle floating animation
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // React to scroll
      if (scrollY) {
        group.current.rotation.x = scrollY * 0.005;
      }
    }
  });
  
  return (
    <group 
      ref={group} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Simple avatar using basic geometries */}
      <mesh position={[0, 0, 0]}>
        {/* Head */}
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#a78bfa" : "#8b5cf6"} 
          roughness={0.3}
          metalness={0.7}
          emissive={hovered ? "#4c1d95" : "#2e1065"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.3, 0.2, 0.95]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.95]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, -0.1, 0.85]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.25, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>
      
      {/* Glasses (on hover) */}
      {hovered && (
        <>
          <mesh position={[-0.45, 0.2, 0.9]}>
            <torusGeometry args={[0.2, 0.03, 16, 32]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
          <mesh position={[0.45, 0.2, 0.9]}>
            <torusGeometry args={[0.2, 0.03, 16, 32]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Avatar3D({ scrollY = 0 }) {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Suspense fallback={
          <Html center>
            <div className="text-white">Loading 3D Avatar...</div>
          </Html>
        }>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <spotLight position={[0, 5, 5]} angle={0.3} intensity={1} />
          
          <AvatarModel scrollY={scrollY} />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}