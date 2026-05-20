// components/ui/TimelineNode.jsx
'use client';
import { motion } from 'framer-motion';

export default function TimelineNode({ 
  experience, 
  index, 
  total, 
  position,
  isActive, 
  isHovered, 
  onClick, 
  onHover, 
  onLeave,
  isInView,
  controls 
}) {
  // Alternate branches: up for even indices, down for odd indices
  const branchDirection = index % 2 === 0 ? 'up' : 'down';
  const branchHeight = 100; // Height of branch line in pixels
  
  // Calculate delay for snake-like emergence
  const emergenceDelay = index * 0.1;

  // Node variants for snake emergence
  const nodeVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: emergenceDelay,
        duration: 0.4
      }
    }
  };

  const branchVariants = {
    hidden: { 
      scaleY: 0,
      opacity: 0
    },
    visible: { 
      scaleY: 1,
      opacity: 1,
      transition: { 
        delay: emergenceDelay + 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const labelVariants = {
    hidden: { 
      opacity: 0,
      y: branchDirection === 'up' ? -20 : 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        delay: emergenceDelay + 0.2,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <div
      className="absolute -translate-x-1/2"
      style={{ left: `${position}%`, top: '50%' }}
    >
      {/* Node Circle ON the main branch */}
      <motion.button
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="relative z-20 group cursor-pointer"
        variants={nodeVariants}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Effect on Emergence */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/40 blur-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={controls}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: [0, 2.5, 1],
              opacity: [0, 0.4, 0],
              transition: { delay: emergenceDelay, duration: 0.6 }
            }
          }}
        />
        
        {/* Node Circle */}
        <div className={`
          w-7 h-7 rounded-full transition-all duration-300 relative shadow-lg
          ${isActive 
            ? 'bg-primary shadow-primary/50 ring-4 ring-primary/30 scale-125' 
            : isHovered
              ? 'bg-primary ring-4 ring-primary/20 scale-110'
              : 'bg-primary hover:bg-primary-light'
          }
        `}>
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-2 h-2 rounded-full bg-white"
              initial={{ scale: 0 }}
              animate={controls}
              variants={{
                hidden: { scale: 0 },
                visible: { 
                  scale: 1,
                  transition: { delay: emergenceDelay + 0.1, duration: 0.2 }
                }
              }}
            />
          </div>
        </div>

        {/* Pulse Effect on Hover/Active */}
        {(isActive || isHovered) && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}
      </motion.button>

      {/* Branch Line COMING OUT from node */}
      <motion.div
        variants={branchVariants}
        className={`absolute w-0.5 bg-gradient-to-b from-primary to-primary/30 left-1/2 -translate-x-1/2
          ${branchDirection === 'up' ? 'bottom-full' : 'top-full'}`}
        style={{
          height: `${branchHeight}px`,
          transformOrigin: branchDirection === 'up' ? 'bottom' : 'top',
          marginBottom: branchDirection === 'up' ? '4px' : '0',
          marginTop: branchDirection === 'down' ? '4px' : '0'
        }}
      />

      {/* Branch End Decorator (small circle at branch tip) */}
      <motion.div
        variants={branchVariants}
        className={`absolute w-2.5 h-2.5 rounded-full bg-primary/50 left-1/2 -translate-x-1/2
          ${branchDirection === 'up' ? 'bottom-[100px]' : 'top-[100px]'}`}
      />

      {/* Company Label - Positioned at the end of branch */}
      <motion.div
        variants={labelVariants}
        className={`absolute left-1/2 -translate-x-1/2 text-center z-10 whitespace-nowrap
          ${branchDirection === 'up' ? 'bottom-[115px]' : 'top-[115px]'}`}
      >
        <div className={`
          px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300
          ${isHovered || isActive 
            ? 'bg-primary/15 border border-primary/30 shadow-lg' 
            : 'bg-white/5 border border-white/10'
          }
        `}>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {experience.company}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
            {experience.title}
          </p>
        </div>
      </motion.div>

      {/* Small connecting dot at branch start (near node) */}
      <motion.div
        variants={branchVariants}
        className={`absolute w-1.5 h-1.5 rounded-full bg-primary/60 left-1/2 -translate-x-1/2
          ${branchDirection === 'up' ? 'bottom-[4px]' : 'top-[4px]'}`}
      />
    </div>
  );
}