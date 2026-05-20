// app/page.jsx
'use client';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Testimonials from '@/components/sections/Testimonials';
import Blog from '@/components/sections/Blog';
import Navbar from '@/components/ui/Navbar';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Testimonials />
      <Blog />
      <Contact />
      <ScrollToTop />
      
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-secondary/50 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Bishal Chaudhary. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">GitHub</a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">LinkedIn</a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">Twitter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
