// components/ui/Card.jsx
'use client';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  variant = 'glass', // glass, solid, outline
  hover = true,
  padding = 'md', // none, sm, md, lg
  className = '',
  onClick,
  ...props
}, ref) => {
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Variant classes
  const variantClasses = {
    glass: 'glassmorphic',
    solid: 'bg-white dark:bg-gray-800 shadow-lg',
    outline: 'border-2 border-white/20 bg-transparent',
  };

  const baseClasses = `
    rounded-lg transition-all duration-300
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hover ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : ''}
    ${className}
  `;

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      onClick={onClick}
      whileHover={hover ? { y: -5 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Subcomponents
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-white/10 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold ${className}`}>
    {children}
  </h3>
);

Card.Description = ({ children, className = '' }) => (
  <p className={`text-gray-600 dark:text-gray-400 text-sm ${className}`}>
    {children}
  </p>
);

Card.Content = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-white/10 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;