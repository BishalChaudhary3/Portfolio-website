// components/sections/Testimonials.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-dark dark:text-light">What People </span>
          <span className="text-gradient">Say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Testimonials from clients and colleagues
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glassmorphic p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 italic">
                "{testimonials[currentIndex].content}"
              </p>
              <div>
                <p className="font-bold text-dark dark:text-light">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                </p>
              </div>
            </motion.div>
          </div>

          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 p-2 glassmorphic rounded-full hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-6 h-6 text-dark dark:text-light" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 p-2 glassmorphic rounded-full hover:bg-white/20 transition"
              >
                <ChevronRight className="w-6 h-6 text-dark dark:text-light" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}