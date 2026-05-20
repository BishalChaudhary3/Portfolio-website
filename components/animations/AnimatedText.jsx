// components/animations/AnimatedText.jsx
'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function AnimatedText({ 
  text, 
  type = 'word', // 'word', 'letter', 'line'
  delay = 0,
  duration = 0.05,
  staggerDelay = 0.03,
  className = '',
  once = true,
  onComplete = null
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      if (onComplete) setTimeout(onComplete, delay + (text.length * staggerDelay * 1000));
    }
  }, [isInView, controls]);

  // Split text based on type
  const getSplitText = () => {
    if (type === 'word') {
      return text.split(' ').map(word => ({ type: 'word', value: word + ' ' }));
    } else if (type === 'letter') {
      return text.split('').map(char => ({ type: 'letter', value: char }));
    } else {
      return text.split('\n').map(line => ({ type: 'line', value: line }));
    }
  };

  const splitText = getSplitText();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: type === 'line' ? 20 : 0,
      x: type === 'letter' ? -5 : 0,
      rotateX: type === 'letter' ? -90 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateX: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
  };

  // Different styles based on type
  const getItemStyle = (item) => {
    if (item.type === 'word') {
      return { display: 'inline-block', whiteSpace: 'pre-wrap' };
    } else if (item.type === 'letter') {
      return { display: 'inline-block' };
    } else {
      return { display: 'block', overflow: 'hidden' };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`animated-text ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      style={{ overflow: 'hidden' }}
    >
      {splitText.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={getItemStyle(item)}
          className="inline-block"
        >
          {item.value === ' ' ? '\u00A0' : item.value}
        </motion.span>
      ))}
    </motion.div>
  );
}