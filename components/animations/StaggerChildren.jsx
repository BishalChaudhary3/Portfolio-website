// components/animations/StaggerChildren.jsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, Children, cloneElement } from 'react';

export default function StaggerChildren({ 
  children, 
  staggerDelay = 0.1,
  delayChildren = 0,
  duration = 0.5,
  direction = 'up', // 'up', 'down', 'left', 'right', 'fade'
  distance = 30,
  once = true,
  className = '',
  threshold = 0.1,
  useIndexDelay = false // If true, delay increases with index
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getDirectionVariants = () => {
    const directions = {
      up: { y: distance, x: 0, opacity: 0 },
      down: { y: -distance, x: 0, opacity: 0 },
      left: { x: distance, y: 0, opacity: 0 },
      right: { x: -distance, y: 0, opacity: 0 },
      fade: { opacity: 0, x: 0, y: 0 }
    };
    return directions[direction] || directions.up;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  const itemVariants = {
    hidden: getDirectionVariants(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
  };

  // Clone children and add custom delays if needed
  const staggeredChildren = Children.map(children, (child, index) => {
    if (useIndexDelay && child.props) {
      return cloneElement(child, {
        customDelay: delayChildren + (index * staggerDelay)
      });
    }
    return child;
  });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {Children.map(staggeredChildren, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          custom={index}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}