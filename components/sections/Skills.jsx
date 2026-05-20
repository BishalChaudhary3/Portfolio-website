// components/sections/Skills.jsx
'use client';
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const skillsData = [
  { name: 'React', color: '#61DAFB', logo: '/images/icons/react-original.svg', description: 'Frontend library for building user interfaces' },
  { name: 'Next.js', color: '#000000', logo: '/images/icons/nextjs-plain.svg', description: 'React framework for production' },
  { name: 'JavaScript', color: '#F7DF1E', logo: '/images/icons/javascript-original.svg', description: 'Programming language of the web' },
  { name: 'TypeScript', color: '#3178C6', logo: '/images/icons/typescript-original.svg', description: 'Typed JavaScript superset' },
  { name: 'Tailwind CSS', color: '#06B6D4', logo: '/images/icons/tailwindcss-original.svg', description: 'Utility-first CSS framework' },
  { name: 'HTML5', color: '#E34F26', logo: '/images/icons/html5-original.svg', description: 'Markup language for the web' },
  { name: 'CSS3', color: '#1572B6', logo: '/images/icons/css3-original.svg', description: 'Styling language' },
  { name: 'Node.js', color: '#339933', logo: '/images/icons/nodejs-original-wordmark.svg', description: 'JavaScript runtime' },
  { name: 'Python', color: '#3776AB', logo: '/images/icons/python-original.svg', description: 'Versatile programming language' },
  { name: 'Express.js', color: '#000000', logo: '/images/icons/express-original.svg', description: 'Web framework for Node.js' },
  { name: 'GraphQL', color: '#E10098', logo: '/images/icons/graphql-plain.svg', description: 'API query language' },
  { name: 'PostgreSQL', color: '#4169E1', logo: '/images/icons/postgresql-original.svg', description: 'Advanced relational database' },
  { name: 'MongoDB', color: '#47A248', logo: '/images/icons/mongodb-original.svg', description: 'NoSQL database' },
  { name: 'Git', color: '#F05032', logo: '/images/icons/git-original.svg', description: 'Version control system' },
  { name: 'Docker', color: '#2496ED', logo: '/images/icons/docker-original.svg', description: 'Container platform' },
  { name: 'AWS', color: '#FF9900', logo: '/images/icons/amazonwebservices-plain-wordmark.svg', description: 'Cloud computing platform' },
  { name: 'Figma', color: '#F24E1E', logo: '/images/icons/figma-original.svg', description: 'Design tool' },
  { name: 'VS Code', color: '#007ACC', logo: '/images/icons/vscode-original.svg', description: 'Code editor' },
];

export default function Skills() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.4
      }
    }
  };

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-dark dark:text-light">My </span>
          <span className="text-gradient">Skills</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-2 sm:gap-3 md:gap-4"
        >
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="skill-card-wrapper"
            >
              <div 
                className="skill-card"
                style={{ '--skill-color': skill.color }}
              >
                {/* Icon that breaks out of the card */}
                <div className="skill-icon-container">
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="skill-icon"
                    style={{ width: '48px', height: '48px' }}
                  />
                </div>
                
                <div className="skill-info">
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-desc">{skill.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .skill-card-wrapper {
          aspect-ratio: 1;
          overflow: visible;
        }
        
        .skill-card {
          width: 100%;
          height: 100%;
          /* Light mode compatible background */
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          /* Light mode border */
          border: 1px solid rgba(0, 0, 0, 0.1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          position: relative;
          overflow: visible;
          /* Dark mode override */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .skill-card {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;
          }
        }
        
        /* Manual dark mode class support */
        :global(.dark) .skill-card {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
        }
        
        /* Glow effect on hover */
        .skill-card::before {
          content: '';
          position: absolute;
          inset: -15px;
          background: radial-gradient(circle at center, var(--skill-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 50%;
          z-index: 0;
        }
        
        .skill-icon-container {
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        /* LARGER LOGO SIZE - Same across all devices */
        .skill-icon {
          width: 48px !important;
          height: 48px !important;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }
        
        /* Fix for dark icons (Next.js, Express.js) in light mode */
        .skill-card img[alt="Next.js"],
        .skill-card img[alt="Express.js"] {
          filter: brightness(0) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }
        
        /* Dark mode fix for dark icons */
        @media (prefers-color-scheme: dark) {
          .skill-card img[alt="Next.js"],
          .skill-card img[alt="Express.js"] {
            filter: brightness(0) invert(1) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
          }
        }
        
        :global(.dark) .skill-card img[alt="Next.js"],
        :global(.dark) .skill-card img[alt="Express.js"] {
          filter: brightness(0) invert(1) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }
        
        .skill-info {
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        
        .skill-name {
          font-size: 11px;
          font-weight: 600;
          /* Light mode text color */
          color: #1a1a1a;
          margin-bottom: 2px;
        }
        
        /* Dark mode text color */
        @media (prefers-color-scheme: dark) {
          .skill-name {
            color: #ffffff;
          }
        }
        
        :global(.dark) .skill-name {
          color: #ffffff;
        }
        
        .skill-desc {
          font-size: 9px;
          /* Light mode text color */
          color: rgba(0, 0, 0, 0.6);
          max-width: 100px;
          margin: 0 auto;
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        /* Dark mode description color */
        @media (prefers-color-scheme: dark) {
          .skill-desc {
            color: rgba(255, 255, 255, 0.6);
          }
        }
        
        :global(.dark) .skill-desc {
          color: rgba(255, 255, 255, 0.6);
        }
        
        /* Hover effects - Icon BREAKS OUT of card */
        .skill-card:hover {
          transform: translateY(-6px);
          border-color: var(--skill-color);
          background: rgba(255, 255, 255, 0.95);
        }
        
        /* Dark mode hover background */
        @media (prefers-color-scheme: dark) {
          .skill-card:hover {
            background: rgba(0, 0, 0, 0.7);
          }
        }
        
        :global(.dark) .skill-card:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        
        .skill-card:hover::before {
          opacity: 0.4;
          inset: -30px;
        }
        
        /* Icon flies OUT and ABOVE the card */
        .skill-card:hover .skill-icon-container {
          transform: translateY(-50px) scale(1.35);
        }
        
        .skill-card:hover .skill-icon {
          filter: drop-shadow(0 0 25px var(--skill-color));
        }
        
        /* Fix for dark icons on hover */
        .skill-card:hover img[alt="Next.js"],
        .skill-card:hover img[alt="Express.js"] {
          filter: brightness(0) drop-shadow(0 0 25px var(--skill-color));
        }
        
        @media (prefers-color-scheme: dark) {
          .skill-card:hover img[alt="Next.js"],
          .skill-card:hover img[alt="Express.js"] {
            filter: brightness(0) invert(1) drop-shadow(0 0 25px var(--skill-color));
          }
        }
        
        /* Info stays on card */
        .skill-card:hover .skill-info {
          transform: translateY(-8px);
        }
        
        .skill-card:hover .skill-desc {
          opacity: 1;
          max-height: 50px;
          margin-top: 6px;
        }
        
        /* Mobile responsive - 4 cards per row, larger logos */
        @media (max-width: 640px) {
          .skill-card {
            gap: 8px;
            border-radius: 12px;
          }
          
          .skill-icon {
            width: 40px !important;
            height: 40px !important;
          }
          
          .skill-name {
            font-size: 10px;
          }
          
          .skill-desc {
            font-size: 8px;
            max-width: 80px;
          }
          
          .skill-card:hover .skill-icon-container {
            transform: translateY(-40px) scale(1.25);
          }
          
          .skill-card:hover .skill-info {
            transform: translateY(-6px);
          }
          
          .skill-card:hover .skill-desc {
            max-height: 45px;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 480px) {
          .skill-icon {
            width: 36px !important;
            height: 36px !important;
          }
          
          .skill-name {
            font-size: 9px;
          }
          
          .skill-desc {
            font-size: 7px;
            max-width: 70px;
          }
          
          .skill-card {
            gap: 6px;
            border-radius: 10px;
          }
          
          .skill-card:hover .skill-icon-container {
            transform: translateY(-35px) scale(1.2);
          }
        }
      `}</style>
    </section>
  );
}