// components/ui/Toast.jsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const toastStyles = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
  },
};

let toastId = 0;
let listeners = [];

// Toast manager
class ToastManager {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  add(toast) {
    const id = toastId++;
    this.toasts = [...this.toasts, { ...toast, id }];
    this.notify();

    if (toast.duration !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration || 5000);
    }

    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }
}

const toastManager = new ToastManager();

// Toast component
function ToastItem({ toast, onClose }) {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative mb-3 overflow-hidden rounded-lg shadow-xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-l-4 ${style.borderColor}`}
    >
      <div className="flex items-start p-4">
        {/* Icon */}
        <div className={`flex-shrink-0 mr-3 ${style.textColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {toast.title}
            </p>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      {toast.showProgress && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${style.bgColor}`}
        />
      )}
    </motion.div>
  );
}

// Toast container component
export function ToastContainer({ position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} space-y-2 pointer-events-none`}>
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={(id) => toastManager.remove(id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Toast functions
export const toast = {
  success: (message, options = {}) => {
    return toastManager.add({
      type: 'success',
      message,
      title: options.title || 'Success',
      duration: options.duration,
      showProgress: options.showProgress !== false,
    });
  },
  error: (message, options = {}) => {
    return toastManager.add({
      type: 'error',
      message,
      title: options.title || 'Error',
      duration: options.duration,
      showProgress: options.showProgress !== false,
    });
  },
  warning: (message, options = {}) => {
    return toastManager.add({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      duration: options.duration,
      showProgress: options.showProgress !== false,
    });
  },
  info: (message, options = {}) => {
    return toastManager.add({
      type: 'info',
      message,
      title: options.title || 'Info',
      duration: options.duration,
      showProgress: options.showProgress !== false,
    });
  },
  custom: (options) => {
    return toastManager.add(options);
  },
  dismiss: (id) => {
    if (id) {
      toastManager.remove(id);
    }
  },
  dismissAll: () => {
    // This would need to be implemented in the manager
  },
};

// Hook for using toast
export function useToast() {
  return toast;
}