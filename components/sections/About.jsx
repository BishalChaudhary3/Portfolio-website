// components/sections/About.jsx
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Code, Coffee } from 'lucide-react';

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    { icon: Award, label: 'Years Experience', value: '5+' },
    { icon: Users, label: 'Happy Clients', value: '50+' },
    { icon: Code, label: 'Projects', value: '100+' },
    { icon: Coffee, label: 'Coffee', value: '1000+' },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark dark:text-light">About </span>
            <span className="text-gradient">Me</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get to know me, my journey, and what drives me
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glassmorphic p-6">
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                I'm a passionate Full Stack Developer with over 5 years of experience building web applications. 
                I love creating beautiful, performant, and user-friendly digital experiences that solve real-world problems.
              </p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                My journey in web development started when I built my first website in college. Since then, 
                I've worked with startups, agencies, and enterprises to deliver high-quality software solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="glassmorphic p-4 text-center">
                  <stat.icon className="w-8 h-8 text-primary dark:text-primary-light mx-auto mb-2" />
                  <div className="text-2xl font-bold text-dark dark:text-light">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glassmorphic p-6"
          >
            <h3 className="text-2xl font-bold text-dark dark:text-light mb-4">What I Do</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dark dark:text-light mb-2">💻 Web Development</h4>
                <p className="text-gray-600 dark:text-gray-300">Building responsive, performant web applications with modern frameworks.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark dark:text-light mb-2">🎨 UI/UX Design</h4>
                <p className="text-gray-600 dark:text-gray-300">Creating beautiful, intuitive interfaces that users love.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark dark:text-light mb-2">🚀 Performance Optimization</h4>
                <p className="text-gray-600 dark:text-gray-300">Making websites lightning fast and SEO-friendly.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}