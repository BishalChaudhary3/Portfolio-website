// components/animations/ParallaxSection.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

export default function ParallaxSection({ 
  children, 
  speed = 0.5, // 0-1, lower = slower parallax
  direction = 'up', // 'up', 'down'
  className = '',
  offsetStart = 'start end',
  offsetEnd = 'end start',
  disableOnMobile = true
}) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offsetStart, offsetEnd]
  });

  // Calculate movement based on direction and speed
  const getMovement = () => {
    const moveDistance = 200 * speed;
    if (direction === 'up') {
      return useTransform(scrollYProgress, [0, 1], [moveDistance, -moveDistance]);
    } else {
      return useTransform(scrollYProgress, [0, 1], [-moveDistance, moveDistance]);
    }
  };

  const y = useSpring(getMovement(), { stiffness: 100, damping: 30 });
  
  // Scale effect based on scroll
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0.3]);

  // If on mobile and parallax is disabled, render without parallax
  if (isMobile && disableOnMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ 
        y, 
        scale: direction === 'scale' ? scale : undefined,
        opacity 
      }}
      className={`parallax-section ${className}`}
    >
      {children}
    </motion.div>
  );
}