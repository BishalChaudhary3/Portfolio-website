// components/ui/Navbar.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glassmorphic py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-gradient cursor-pointer"
          >
            Portfolio
          </motion.h1>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer text-dark dark:text-light hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="z-50">
            {isOpen ? (
              <X className="w-6 h-6 text-dark dark:text-light" />
            ) : (
              <Menu className="w-6 h-6 text-dark dark:text-light" />
            )}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glassmorphic md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="block py-2 text-dark dark:text-light hover:text-primary dark:hover:text-primary-light transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}