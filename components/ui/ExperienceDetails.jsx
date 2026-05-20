// components/ui/ExperienceDetails.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, X, ExternalLink } from 'lucide-react';

export default function ExperienceDetails({ experience, onClose, isPinned }) {
  if (!experience) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <div className="glassmorphic p-6 md:p-8 relative overflow-hidden">
          {/* Background Gradient Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
          
          {/* Close Button (only for pinned items) */}
          {isPinned && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5 text-dark dark:text-light" />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Icon Section */}
            <div className="flex-shrink-0">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Briefcase className="w-8 h-8 text-primary dark:text-primary-light" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-dark dark:text-light">
                    {experience.title}
                  </h3>
                  <p className="text-lg text-primary dark:text-primary-light font-semibold mt-1">
                    {experience.company}
                  </p>
                </div>
                
                {/* Duration Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                  <Calendar className="w-4 h-4 text-primary dark:text-primary-light" />
                  <span className="text-sm font-medium text-dark dark:text-light">
                    {new Date(experience.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })} - 
                    {experience.current 
                      ? 'Present' 
                      : new Date(experience.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                  </span>
                </div>
              </div>

              {/* Location */}
              {experience.location && (
                <div className="flex items-center gap-2 mt-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{experience.location}</span>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Responsibilities/Achievements (if available) */}
              {experience.responsibilities && experience.responsibilities.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-dark dark:text-light mb-2">
                    Key Responsibilities:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {experience.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {experience.technologies && experience.technologies.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-dark dark:text-light mb-3">
                    Technologies & Tools:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map(tech => (
                      <motion.span
                        key={tech}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary-dark dark:text-primary-light rounded-full font-medium"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Link to learn more (if available) */}
              {experience.link && (
                <div className="mt-6">
                  <a
                    href={experience.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary dark:text-primary-light hover:text-primary-dark transition-colors"
                  >
                    Learn more about this role
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}