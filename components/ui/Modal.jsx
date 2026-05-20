// components/ui/Modal.jsx
'use client';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl, full
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer = null,
  className = '',
}) {
  const modalRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] w-full',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`${sizeClasses[size]} w-full ${className}`}
            >
              <div className="glassmorphic-heavy relative overflow-hidden">
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    {title && (
                      <h2 className="text-2xl font-bold">{title}</h2>
                    )}
                    {showCloseButton && (
                     <button
                     onClick={onClose}
                     className="p-1 rounded-lg hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-primary"
                   >
                     <X className="w-5 h-5" />
                   </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="p-6 border-t border-white/10">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Predefined modal types
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Action'}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-600 dark:text-gray-400">{message || 'Are you sure you want to proceed?'}</p>
    </Modal>
  );
}

export function AlertModal({ isOpen, onClose, title, message, buttonText = 'OK' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Alert'}
      size="sm"
      footer={
        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>
            {buttonText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  );
}

export function LoadingModal({ isOpen, message = 'Loading...' }) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false} size="sm">
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </Modal>
  );
}