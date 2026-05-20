// components/ui/AnimatedCursor.jsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', updateMousePosition);
    
    const interactiveElements = document.querySelectorAll('a, button, input, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseOver);
      el.addEventListener('mouseleave', handleMouseOut);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseOver);
        el.removeEventListener('mouseleave', handleMouseOut);
      });
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-2 h-2 bg-primary rounded-full" />
      </motion.div>
      <motion.div
        className="fixed pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 28, delay: 0.05 }}
      >
        <div className="w-10 h-10 border-2 border-primary rounded-full opacity-50" />
      </motion.div>
    </>
  );
}