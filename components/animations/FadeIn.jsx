// components/animations/FadeIn.jsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FadeIn({ 
  children, 
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  className = '',
  threshold = 0.1,
  onAnimationComplete = null
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getDirectionVariants = () => {
    const directions = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
      none: { x: 0, y: 0 }
    };
    return directions[direction] || directions.up;
  };

  const variants = {
    hidden: { 
      opacity: 0,
      ...getDirectionVariants()
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth easing
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
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}