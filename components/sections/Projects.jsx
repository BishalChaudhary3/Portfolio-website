// components/sections/Projects.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Github, ExternalLink, Eye } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const autoScrollSpeedRef = useRef(0.85);
  const isHoveringRef = useRef(false);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    fetchProjects();
  }, []);

  const parseJsonList = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      const parsedData = Array.isArray(data)
        ? data.map(project => ({
          ...project,
          techStack: parseJsonList(project.techStack),
          images: parseJsonList(project.images),
        }))
        : [];

      setProjects(parsedData);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || projects.length === 0) return;

    // Calculate the width of one set of projects
    const getSetWidth = () => {
      const firstCard = carousel.children[0];
      if (!firstCard) return 0;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6 = 24px
      return (cardWidth + gap) * projects.length;
    };

    // Set initial scroll position to the middle set
    const setWidth = getSetWidth();
    carousel.scrollLeft = setWidth;

    const animate = () => {
      if (!pausedRef.current && !draggingRef.current && !isHoveringRef.current && carousel.scrollWidth > carousel.clientWidth) {
        carousel.scrollLeft += autoScrollSpeedRef.current;
        
        // Infinite loop logic - smoothly wrap around
        const currentSetWidth = getSetWidth();
        if (carousel.scrollLeft >= currentSetWidth * 2) {
          carousel.scrollLeft -= currentSetWidth;
        } else if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft += currentSetWidth;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [projects]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.children[0];
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    
    carousel.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const pauseCarousel = () => {
    pausedRef.current = true;
  };

  const resumeCarousel = () => {
    if (!draggingRef.current && !isHoveringRef.current) {
      pausedRef.current = false;
    }
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    pausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (!draggingRef.current) {
      pausedRef.current = false;
    }
  };

  const handlePointerDown = (event) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    pauseCarousel();
    draggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = carousel.scrollLeft;
    carousel.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const carousel = carouselRef.current;
    if (!carousel || !draggingRef.current) return;

    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      didDragRef.current = true;
    }

    carousel.scrollLeft = dragStartScrollRef.current - deltaX;
    
    // Prevent infinite loop while dragging
    const firstCard = carousel.children[0];
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      const setWidth = (cardWidth + gap) * projects.length;
      
      if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft += setWidth;
        dragStartScrollRef.current += setWidth;
      } else if (carousel.scrollLeft >= setWidth * 2) {
        carousel.scrollLeft -= setWidth;
        dragStartScrollRef.current -= setWidth;
      }
    }
  };

  const handlePointerUp = (event) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    draggingRef.current = false;
    carousel.releasePointerCapture?.(event.pointerId);
    // Only resume if not hovering
    if (!isHoveringRef.current) {
      resumeCarousel();
    }
  };

  const handleCarouselClick = (event) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  // Triple the projects for infinite scroll effect
  const carouselProjects = projects.length > 0
    ? [...projects, ...projects, ...projects]
    : [];

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: Math.min(index, projects.length - 1) * 0.08 }}
      className="glassmorphic w-[82vw] sm:w-[420px] lg:w-[380px] shrink-0 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.images?.[0] || '/window.svg'}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 420px, 82vw"
          className="object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
              <Github className="w-5 h-5 text-white" />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-dark dark:text-light mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
          {(project.techStack || []).slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-1 text-xs bg-primary/20 text-primary-dark dark:text-primary-light rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{project.views || 0} views</span>
          </div>
          <Link href={`/projects/${project.slug}`}>
            <span className="text-primary dark:text-primary-light hover:text-primary-dark cursor-pointer text-sm font-semibold">
              Learn More →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glassmorphic p-6 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-dark dark:text-light">Featured </span>
           <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here are some of my best works. Each project is built with passion and attention to detail.
          </p>
        </motion.div>

        <div className="relative">
          <div className="mb-6 flex justify-center gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => scrollCarousel('prev')}
              onMouseEnter={pauseCarousel}
              onMouseLeave={resumeCarousel}
              className="h-11 w-11 rounded-full glassmorphic flex items-center justify-center hover:bg-primary hover:text-light transition"
              aria-label="Previous featured projects"
            >
              <ChevronLeft className="h-5 w-5 text-dark dark:text-light" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('next')}
              onMouseEnter={pauseCarousel}
              onMouseLeave={resumeCarousel}
              className="h-11 w-11 rounded-full glassmorphic flex items-center justify-center hover:bg-primary hover:text-light transition"
              aria-label="Next featured projects"
            >
              <ChevronRight className="h-5 w-5 text-dark dark:text-light" />
            </button>
          </div>

          <div
            ref={carouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={pauseCarousel}
            onBlur={resumeCarousel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClickCapture={handleCarouselClick}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {carouselProjects.map((project, index) => (
              <ProjectCard
                key={`${project.id}-${index}`}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <button className="px-8 py-3 glassmorphic rounded-full font-semibold text-dark dark:text-light hover:bg-white/20 transition">
              View All Projects →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}