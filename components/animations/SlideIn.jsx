// components/animations/SlideIn.jsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SlideIn({ 
  children, 
  direction = 'left', // 'left', 'right', 'up', 'down'
  delay = 0,
  duration = 0.5,
  distance = 100,
  once = true,
  className = '',
  threshold = 0.1
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialPosition = () => {
    const positions = {
      left: { x: -distance, y: 0 },
      right: { x: distance, y: 0 },
      up: { x: 0, y: -distance },
      down: { x: 0, y: distance }
    };
    return positions[direction] || positions.left;
  };

  const variants = {
    hidden: { 
      opacity: 0,
      ...getInitialPosition()
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: delay,
        duration: duration
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}