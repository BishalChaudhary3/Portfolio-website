// components/ui/Footer.jsx
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/50 dark:bg-black/30 backdrop-blur-sm border-t border-gray-200 dark:border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h1 className="text-xl font-bold text-gradient mb-4">Portfolio</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Building amazing web experiences with modern technologies.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-dark dark:text-light mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Home</Link></li>
              <li><Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Projects</Link></li>
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Contact</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-dark dark:text-light mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Blog</a></li>
              <li><a href="/resume.pdf" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Resume</a></li>
              <li><a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="font-semibold text-dark dark:text-light mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="p-2 glassmorphic rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition">
                <Github className="w-5 h-5 text-dark dark:text-light" />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="p-2 glassmorphic rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition">
                <Linkedin className="w-5 h-5 text-dark dark:text-light" />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="p-2 glassmorphic rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition">
                <Twitter className="w-5 h-5 text-dark dark:text-light" />
              </a>
              <a href="mailto:john@example.com" className="p-2 glassmorphic rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition">
                <Mail className="w-5 h-5 text-dark dark:text-light" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 dark:text-gray-500 text-sm pt-8 border-t border-gray-200 dark:border-white/10">
          <p>© {new Date().getFullYear()} Bishal Chaudhary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}