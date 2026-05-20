// components/forms/NewsletterForm.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const newsletterSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  name: z.string().optional(),
});

export default function NewsletterForm({ 
  variant = 'inline', // 'inline', 'modal', 'footer'
  className = '',
  onSubscribe = null 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubscribed(true);
        reset();
        toast.success('Successfully subscribed to newsletter!');
        if (onSubscribe) onSubscribe(data.email);
        
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4"
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-semibold">Subscribed!</p>
        <p className="text-xs text-gray-500">Check your email for confirmation</p>
      </motion.div>
    );
  }

  // Inline variant (for hero section)
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none transition"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Subscribe
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 absolute -bottom-6 left-0">
            {errors.email.message}
          </p>
        )}
      </form>
    );
  }

  // Footer variant (compact)
  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-2 ${className}`}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="Your email address"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-r from-primary to-dark rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </form>
    );
  }

  // Modal variant (full width with name field)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-semibold mb-2">Name (Optional)</label>
        <input
          {...register('name')}
          type="text"
          placeholder="Your name"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2">Email Address *</label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Bell className="w-4 h-4" />
            Subscribe to Newsletter
          </>
        )}
      </button>
    </form>
  );
}