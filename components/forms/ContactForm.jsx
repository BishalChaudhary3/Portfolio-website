// components/forms/ContactForm.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, User, Mail, FileText, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email is too long'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject is too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
});

export default function ContactForm({ onSubmitSuccess, className = '' }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        toast.success('Message sent successfully! I will get back to you soon.');
        if (onSubmitSuccess) onSubmitSuccess();
        
        // Reset submitted status after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/5 border focus:outline-none transition-all duration-200";
  const errorClasses = "text-red-500 text-sm mt-1 flex items-center gap-1";
  const labelClasses = "block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphic p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thank you for reaching out. I'll get back to you within 24-48 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-gradient-to-r from-primary to-dark text-white rounded-lg hover:shadow-lg transition"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label className={labelClasses}>
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            {...register('name')}
            className={`${inputClasses} ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-primary'}`}
            placeholder="John Doe"
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={errorClasses}
              >
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email Field */}
        <div>
          <label className={labelClasses}>
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`${inputClasses} ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'}`}
            placeholder="john@example.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={errorClasses}
              >
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subject Field */}
      <div>
        <label className={labelClasses}>
          <FileText className="w-4 h-4 inline mr-2" />
          Subject *
        </label>
        <input
          {...register('subject')}
          className={`${inputClasses} ${errors.subject ? 'border-red-500' : 'border-white/10 focus:border-primary'}`}
          placeholder="Project Inquiry / Collaboration / Question"
        />
        <AnimatePresence>
          {errors.subject && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorClasses}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.subject.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Message Field */}
      <div>
        <label className={labelClasses}>
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Message *
        </label>
        <textarea
          {...register('message')}
          rows="6"
          className={`${inputClasses} resize-none ${errors.message ? 'border-red-500' : 'border-white/10 focus:border-primary'}`}
          placeholder="Tell me about your project, ideas, or just say hello..."
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={errorClasses}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-primary to-dark text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </motion.button>

      {/* Character Counter for Message */}
      <div className="text-right">
        <p className="text-xs text-gray-500">
          {register('message').value?.length || 0} / 1000 characters
        </p>
      </div>
    </form>
  );
}