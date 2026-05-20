// components/forms/LoginForm.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm({ redirectUrl = '/admin/dashboard', className = '' }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', result.token);
        toast.success('Login successful! Redirecting...');
        
        // Add a small delay before redirect for better UX
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      } else {
        setError('root', { message: result.error || 'Invalid email or password' });
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' });
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none transition-all duration-200 text-white placeholder-gray-400";
  const labelClasses = "block text-sm font-semibold mb-2 text-gray-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      {/* Email Field */}
      <div>
        <label className={labelClasses}>
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            className={`${inputClasses} pl-10 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="admin@example.com"
            autoComplete="email"
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password Field */}
      <div>
        <label className={labelClasses}>
          <Lock className="w-4 h-4 inline mr-2" />
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className={`${inputClasses} pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Root Error (general login error) */}
      <AnimatePresence>
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.root.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Login
          </>
        )}
      </motion.button>

      {/* Demo Credentials Hint */}
      <div className="text-center text-sm text-gray-400">
        <p>Demo credentials:</p>
        <p className="font-mono text-xs">admin@example.com / admin123</p>
      </div>
    </form>
  );
}