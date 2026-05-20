// components/sections/Experience.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HorizontalTimeline from '../ui/HorizontalTimeline';
import ExperienceDetails from '../ui/ExperienceDetails';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [hoveredExp, setHoveredExp] = useState(null);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (inView && !animationCompleted) {
      controls.start('visible');
      setAnimationCompleted(true);
    }
  }, [inView, controls, animationCompleted]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience');
      const data = await response.json();
      
      const parsedData = data.map(exp => ({
        ...exp,
        technologies: typeof exp.technologies === 'string' 
          ? JSON.parse(exp.technologies) 
          : (exp.technologies || [])
      }));
      
      setExperiences(parsedData);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const handleNodeClick = (exp) => {
    setSelectedExp(selectedExp?.id === exp.id ? null : exp);
  };

  const handleNodeHover = (exp) => {
    setHoveredExp(exp);
  };

  const handleNodeLeave = () => {
    setHoveredExp(null);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark dark:text-light">Career </span>
            <span className="text-gradient">Timeline</span>
          </h2>
        </motion.div>

        {/* Horizontal Timeline */}
        <HorizontalTimeline 
          experiences={experiences}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onNodeLeave={handleNodeLeave}
          selectedExp={selectedExp}
          hoveredExp={hoveredExp}
          isInView={inView}
          controls={controls}
        />

        {/* Description Box */}
        <ExperienceDetails 
          experience={hoveredExp || selectedExp}
          onClose={() => setSelectedExp(null)}
          isPinned={!!selectedExp}
        />
      </div>
    </section>
  );
}