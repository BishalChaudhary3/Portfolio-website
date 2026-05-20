// components/ui/ThemeToggle.jsx
'use client';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full glassmorphic flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-light dark:focus:ring-offset-dark"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-primary dark:text-primary-light" />
      ) : (
        <Moon className="w-5 h-5 text-primary dark:text-primary-light" />
      )}
    </motion.button>
  );
}