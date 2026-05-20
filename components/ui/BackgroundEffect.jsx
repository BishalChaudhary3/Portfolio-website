'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundEffect() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      // Ensure body has no background
      document.body.style.backgroundColor = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
    };
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Solid background that changes with mode - NO GRID */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gradient-light'
      }`} />
      
      {/* Animated effects - Dark Mode */}
      {isDarkMode && (
        <>
          {/* Ambient glow blobs */}
          <motion.div
            className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(109,129,150,0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -30, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 -right-48 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(203,203,203,0.2) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, -50, 60, 0],
              y: [0, 40, -30, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,227,0.12) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      
      {/* Animated effects - Light Mode */}
      {!isDarkMode && (
        <>
          <motion.div
            className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(109,129,150,0.15) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -30, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 -right-48 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(74,74,74,0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, -50, 60, 0],
              y: [0, 40, -30, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      
      {/* Flowing Wave Lines - All moving properly */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
            <stop offset="50%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity={isDarkMode ? "0.5" : "0.35"} />
            <stop offset="100%" stopColor={isDarkMode ? "#FFFFE3" : "#6D8196"} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
            <stop offset="50%" stopColor={isDarkMode ? "#FFFFE3" : "#6D8196"} stopOpacity={isDarkMode ? "0.35" : "0.25"} />
            <stop offset="100%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 - Top */}
        <motion.path
          d="M-100,250 C200,150 400,350 700,250 C1000,150 1300,300 1600,230 C1900,160 2200,270 2500,210"
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="2"
          animate={{
            d: [
              "M-100,250 C200,150 400,350 700,250 C1000,150 1300,300 1600,230 C1900,160 2200,270 2500,210",
              "M-100,230 C200,170 400,330 700,270 C1000,170 1300,280 1600,250 C1900,180 2200,250 2500,230",
              "M-100,250 C200,150 400,350 700,250 C1000,150 1300,300 1600,230 C1900,160 2200,270 2500,210",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Wave 2 - Middle */}
        <motion.path
          d="M-100,380 C200,280 400,480 700,380 C1000,280 1300,430 1600,360 C1900,290 2200,400 2500,340"
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="1.8"
          animate={{
            d: [
              "M-100,380 C200,280 400,480 700,380 C1000,280 1300,430 1600,360 C1900,290 2200,400 2500,340",
              "M-100,360 C200,300 400,460 700,400 C1000,300 1300,410 1600,380 C1900,310 2200,380 2500,360",
              "M-100,380 C200,280 400,480 700,380 C1000,280 1300,430 1600,360 C1900,290 2200,400 2500,340",
            ]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Wave 3 - Bottom */}
        <motion.path
          d="M-100,520 C200,420 400,620 700,520 C1000,420 1300,570 1600,500 C1900,430 2200,540 2500,480"
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M-100,520 C200,420 400,620 700,520 C1000,420 1300,570 1600,500 C1900,430 2200,540 2500,480",
              "M-100,500 C200,440 400,600 700,540 C1000,440 1300,550 1600,520 C1900,450 2200,520 2500,500",
              "M-100,520 C200,420 400,620 700,520 C1000,420 1300,570 1600,500 C1900,430 2200,540 2500,480",
            ]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Neural Network Lines - Increased number and visibility */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
            <stop offset="50%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity={isDarkMode ? "0.5" : "0.35"} />
            <stop offset="100%" stopColor={isDarkMode ? "#FFFFE3" : "#6D8196"} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neuralGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
            <stop offset="50%" stopColor={isDarkMode ? "#FFFFE3" : "#6D8196"} stopOpacity={isDarkMode ? "0.4" : "0.3"} />
            <stop offset="100%" stopColor={isDarkMode ? "#6D8196" : "#4A4A4A"} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Neural Line 1 */}
        <motion.path
          d="M-100,150 C250,50 500,350 850,200 C1200,50 1550,300 1900,150 C2150,50 2400,200 2600,120"
          fill="none"
          stroke="url(#neuralGrad1)"
          strokeWidth="1.2"
          animate={{
            d: [
              "M-100,150 C250,50 500,350 850,200 C1200,50 1550,300 1900,150 C2150,50 2400,200 2600,120",
              "M-100,130 C250,70 500,330 850,220 C1200,70 1550,280 1900,170 C2150,70 2400,180 2600,140",
              "M-100,150 C250,50 500,350 850,200 C1200,50 1550,300 1900,150 C2150,50 2400,200 2600,120",
            ]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neural Line 2 */}
        <motion.path
          d="M-100,350 C300,250 600,450 1000,350 C1400,250 1700,400 2100,320"
          fill="none"
          stroke="url(#neuralGrad2)"
          strokeWidth="1"
          animate={{
            d: [
              "M-100,350 C300,250 600,450 1000,350 C1400,250 1700,400 2100,320",
              "M-100,330 C300,270 600,430 1000,370 C1400,270 1700,380 2100,340",
              "M-100,350 C300,250 600,450 1000,350 C1400,250 1700,400 2100,320",
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neural Line 3 */}
        <motion.path
          d="M-100,550 C350,450 650,650 1100,520 C1550,390 1850,550 2350,470"
          fill="none"
          stroke="url(#neuralGrad1)"
          strokeWidth="0.9"
          animate={{
            d: [
              "M-100,550 C350,450 650,650 1100,520 C1550,390 1850,550 2350,470",
              "M-100,530 C350,470 650,630 1100,540 C1550,410 1850,530 2350,490",
              "M-100,550 C350,450 650,650 1100,520 C1550,390 1850,550 2350,470",
            ]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neural Line 4 - Diagonal */}
        <motion.path
          d="M200,-100 C350,150 500,400 800,300 C1100,200 1400,450 1700,350 C2000,250 2300,500 2500,400"
          fill="none"
          stroke="url(#neuralGrad2)"
          strokeWidth="1.1"
          animate={{
            d: [
              "M200,-100 C350,150 500,400 800,300 C1100,200 1400,450 1700,350 C2000,250 2300,500 2500,400",
              "M200,-80 C350,170 500,380 800,320 C1100,220 1400,430 1700,370 C2000,270 2300,480 2500,420",
              "M200,-100 C350,150 500,400 800,300 C1100,200 1400,450 1700,350 C2000,250 2300,500 2500,400",
            ]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neural Line 5 - Additional */}
        <motion.path
          d="M500,-100 C700,200 900,350 1200,280 C1500,210 1800,380 2100,300 C2300,250 2450,350 2600,280"
          fill="none"
          stroke="url(#neuralGrad1)"
          strokeWidth="0.8"
          animate={{
            d: [
              "M500,-100 C700,200 900,350 1200,280 C1500,210 1800,380 2100,300 C2300,250 2450,350 2600,280",
              "M500,-80 C700,220 900,330 1200,300 C1500,230 1800,360 2100,320 C2300,270 2450,330 2600,300",
              "M500,-100 C700,200 900,350 1200,280 C1500,210 1800,380 2100,300 C2300,250 2450,350 2600,280",
            ]
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Neural Network Nodes (Dots at intersections) */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <motion.circle
            key={i}
            cx={`${10 + Math.random() * 80}%`}
            cy={`${10 + Math.random() * 80}%`}
            r="2"
            fill={isDarkMode ? "#6D8196" : "#4A4A4A"}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              r: [1.5, 2.5, 1.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>
      
      {/* Floating Particles - Increased count */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkMode ? 'bg-[#6D8196]' : 'bg-[#4A4A4A]'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: isDarkMode ? '2px' : '1.5px',
              height: isDarkMode ? '2px' : '1.5px',
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0, isDarkMode ? 0.7 : 0.5, 0],
            }}
            transition={{
              duration: 8 + i * 0.15,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Cursor Glow */}
      <CursorGlow isDarkMode={isDarkMode} />
    </div>
  );
}

function CursorGlow({ isDarkMode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 150,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(109,129,150,0.15) 0%, transparent 80%)'
          : 'radial-gradient(circle, rgba(109,129,150,0.06) 0%, transparent 80%)',
        filter: 'blur(30px)',
      }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}