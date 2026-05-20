// app/(frontend)/about/page.jsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Users, Code, Coffee, Download, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { icon: Award, label: 'Years Experience', value: '5+' },
    { icon: Users, label: 'Happy Clients', value: '50+' },
    { icon: Code, label: 'Projects Completed', value: '100+' },
    { icon: Coffee, label: 'Coffee Consumed', value: '1000+' },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-dark dark:text-light">About </span>
          <span className="text-gradient">Me</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get to know me, my journey, and what drives me to create amazing digital experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-dark rounded-lg blur-2xl opacity-30"></div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/images/profile/IMG_8256.PNG"
                  alt="Profile"
                  width={600}
                  height={600}
                  className="object-cover w-full"
                />
              </div>
            </div>
            
            <div className="glassmorphic p-6">
              <h3 className="text-xl font-bold text-dark dark:text-light mb-4">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-8 h-8 text-primary dark:text-primary-light mx-auto mb-2" />
                    <div className="text-2xl font-bold text-dark dark:text-light">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glassmorphic p-6">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">Who Am I?</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                I'm a passionate Full Stack Developer with over 5 years of experience building web applications. 
                I love creating beautiful, performant, and user-friendly digital experiences that solve real-world problems.
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                My journey in web development started when I built my first website in college. Since then, 
                I've worked with startups, agencies, and enterprises to deliver high-quality software solutions.
              </p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                When I'm not coding, you can find me contributing to open source, writing technical blogs, 
                or exploring new technologies that push the boundaries of what's possible on the web.
              </p>
            </div>

            <div className="glassmorphic p-6">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">My Approach</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-dark dark:text-light mb-2">✨ User-Centric Design</h3>
                  <p className="text-gray-600 dark:text-gray-300">I prioritize user experience and accessibility in every project.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark dark:text-light mb-2">⚡ Performance First</h3>
                  <p className="text-gray-600 dark:text-gray-300">Optimized code and fast loading times are non-negotiable.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark dark:text-light mb-2">📚 Continuous Learning</h3>
                  <p className="text-gray-600 dark:text-gray-300">I constantly update my skills with the latest technologies.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark dark:text-light mb-2">🤝 Collaboration</h3>
                  <p className="text-gray-600 dark:text-gray-300">I believe the best results come from working closely with clients.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link href="/contact">
                <button className="px-6 py-3 bg-gradient-to-r from-primary to-dark text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition">
                  <Mail className="w-4 h-4" />
                  Contact Me
                </button>
              </Link>
              <a href="/resume.pdf" download>
                <button className="px-6 py-3 glassmorphic rounded-lg font-semibold text-dark dark:text-light flex items-center gap-2 hover:bg-white/20 transition">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}