// components/animations/ParticleBackground.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground({ 
  particleCount = 100,
  particleColor = '#8b5cf6',
  particleSize = 2,
  speed = 0.5,
  connectParticles = true,
  interactive = true,
  className = ''
}) {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const particles = useRef([]);
  const animationFrame = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initParticles();
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [interactive]);

  const initParticles = () => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * particleSize + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Update and draw particles
    particles.current.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -1;

      // Wrap around edges (alternative to bounce)
      if (particle.x < 0) particle.x = dimensions.width;
      if (particle.x > dimensions.width) particle.x = 0;
      if (particle.y < 0) particle.y = dimensions.height;
      if (particle.y > dimensions.height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
      ctx.globalAlpha = particle.alpha;
      
      // Draw connections
      if (connectParticles) {
        particles.current.forEach((particle2, j) => {
          if (i !== j) {
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;
            
            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.strokeStyle = particleColor;
              ctx.globalAlpha = (1 - distance / maxDistance) * 0.3;
              ctx.stroke();
            }
          }
        });
      }
    });

    // Interactive mouse repulsion
    if (interactive && mousePosition.x && mousePosition.y) {
      particles.current.forEach(particle => {
        const dx = particle.x - mousePosition.x;
        const dy = particle.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 100;
        
        if (distance < repulsionRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (repulsionRadius - distance) / repulsionRadius;
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
          
          // Limit velocity
          const maxSpeed = 3;
          particle.vx = Math.min(Math.max(particle.vx, -maxSpeed), maxSpeed);
          particle.vy = Math.min(Math.max(particle.vy, -maxSpeed), maxSpeed);
        }
      });
    }

    animationFrame.current = requestAnimationFrame(drawParticles);
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles();
      drawParticles();
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [dimensions, particleCount, speed, connectParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}