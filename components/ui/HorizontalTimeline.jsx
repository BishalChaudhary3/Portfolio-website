// components/ui/HorizontalTimeline.jsx
'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TimelineNode from './TimelineNode';

export default function HorizontalTimeline({ 
  experiences, 
  onNodeClick, 
  onNodeHover, 
  onNodeLeave,
  selectedExp,
  hoveredExp,
  isInView,
  controls 
}) {
  const timelineRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isCenteredRef = useRef(false);

  // Center the timeline on load
  useEffect(() => {
    if (timelineRef.current && experiences.length > 0 && !isCenteredRef.current) {
      const container = timelineRef.current;
      // Scroll to show the first node with some margin
      container.scrollLeft = 200;
      isCenteredRef.current = true;
    }
  }, [experiences]);

  // Drag to scroll functionality
  const handleMouseDown = (e) => {
    if (!timelineRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - timelineRef.current.offsetLeft;
    scrollLeftRef.current = timelineRef.current.scrollLeft;
    timelineRef.current.style.cursor = 'grabbing';
    timelineRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (!timelineRef.current) return;
    isDraggingRef.current = false;
    timelineRef.current.style.cursor = 'grab';
    timelineRef.current.style.userSelect = 'auto';
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (timelineRef.current) {
      timelineRef.current.style.cursor = 'grab';
      timelineRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !timelineRef.current) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    timelineRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const scrollTo = (direction) => {
    if (!timelineRef.current) return;
    const scrollAmount = direction === 'left' ? -250 : 250;
    timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Return null AFTER all hooks are called
  if (experiences.length === 0) return null;

  // Calculate positions with equal spacing - REDUCED GAP (160px between nodes)
  const getNodePosition = (index) => {
    return index * 160; // Pixels from left instead of percentage
  };

  const totalWidth = (experiences.length - 1) * 160;

  return (
    <div className="relative mt-20 mb-20">
      {/* Navigation Buttons */}
      <button
        onClick={() => scrollTo('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full glassmorphic flex items-center justify-center hover:bg-primary hover:text-white transition shadow-lg"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-dark dark:text-light" />
      </button>
      
      <button
        onClick={() => scrollTo('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full glassmorphic flex items-center justify-center hover:bg-primary hover:text-white transition shadow-lg"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-dark dark:text-light" />
      </button>

      {/* Draggable Timeline Container */}
      <div
        ref={timelineRef}
        className="overflow-x-auto overflow-y-visible cursor-grab select-none"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Container with proper padding to show first and last nodes */}
        <div 
          className="relative"
          style={{ 
            width: `${totalWidth + 400}px`, // Extra width for padding
            height: '350px',
            paddingLeft: '200px',  // Ensures first node is visible
            paddingRight: '200px', // Ensures last node is visible
          }}
        >
          {/* MAIN HORIZONTAL BRANCH (TRUNK) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={controls}
            variants={{
              hidden: { scaleX: 0 },
              visible: { 
                scaleX: 1,
                transition: { duration: 1, ease: "easeOut" }
              }
            }}
            className="absolute top-1/2 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 -translate-y-1/2 rounded-full"
            style={{ 
              transformOrigin: 'left',
              left: '200px',
              right: '200px',
              width: `${totalWidth}px`
            }}
          />
          
          {/* Glowing effect on main branch */}
          <div 
            className="absolute top-1/2 h-16 -translate-y-1/2 bg-primary/5 blur-xl pointer-events-none"
            style={{ 
              left: '200px',
              width: `${totalWidth}px`
            }}
          />

          {/* Timeline Nodes with branches COMING OUT from main branch */}
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="absolute -translate-x-1/2"
              style={{ 
                left: `${200 + getNodePosition(index)}px`, 
                top: '50%'
              }}
            >
              <TimelineNode
                experience={exp}
                index={index}
                total={experiences.length}
                position={50} // Not used when using absolute positioning
                isActive={selectedExp?.id === exp.id}
                isHovered={hoveredExp?.id === exp.id}
                onClick={() => onNodeClick(exp)}
                onHover={() => onNodeHover(exp)}
                onLeave={onNodeLeave}
                isInView={isInView}
                controls={controls}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}