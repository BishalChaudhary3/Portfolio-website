// app/(frontend)/contact/page.jsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
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
        toast.success('Message sent successfully!');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-dark dark:text-light">Get In </span>
          <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's work together and create something amazing!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glassmorphic p-6">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-dark dark:text-light">bishal3633@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-dark dark:text-light">+91 8299511771</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-semibold text-dark dark:text-light">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glassmorphic p-6">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">Follow Me</h2>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, y: -5 }}
                  href="https://github.com/BishalChaudhary3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <Github className="w-5 h-5 text-dark dark:text-light" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -5 }}
                  href="https://www.linkedin.com/in/bishal-chaudhary-459a4a309"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-dark dark:text-light" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -5 }}
                  href="https://x.com/BChaudhary76705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-dark dark:text-light" />
                </motion.a>
              </div>
            </div>

            <div className="glassmorphic p-6">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">Availability</h2>
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-dark dark:text-light">Available for work</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                I'm currently accepting new projects and freelance opportunities. Feel free to reach out!
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glassmorphic p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark dark:text-light mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-light mb-2">Name *</label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors text-dark dark:text-light placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-light mb-2">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors text-dark dark:text-light placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-light mb-2">Subject *</label>
                    <input
                      {...register('subject')}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none transition-colors text-dark dark:text-light placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Project Inquiry"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark dark:text-light mb-2">Message *</label>
                    <textarea
                      {...register('message')}
                      rows="6"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 focus:border-primary focus:outline-none resize-none transition-colors text-dark dark:text-light placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Tell me about your project..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-primary to-dark text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}