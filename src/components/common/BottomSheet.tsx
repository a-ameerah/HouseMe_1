import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[90vh]',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/50"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative z-10 w-full max-w-xl bg-surface rounded-t-2xl shadow-xl border-t border-line overflow-hidden flex flex-col ${maxHeight}`}
          >
            {/* Drag Handle Bar */}
            <div className="pt-3 pb-2 flex flex-col items-center shrink-0 cursor-grab">
              <div className="w-12 h-1.5 rounded-full bg-line" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 py-3 flex items-center justify-between border-b border-line shrink-0">
                <h3 className="text-lg font-bold text-ink-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-700 hover:bg-brand-50 hover:text-ink-900 transition-colors"
                  aria-label="Close sheet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto overscroll-contain no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
