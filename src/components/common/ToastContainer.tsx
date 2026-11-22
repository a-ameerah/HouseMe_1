import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-brand-900 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-900 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-white shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-[360px] px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center justify-between gap-2.5 px-4 py-3 bg-ink-900 text-white rounded-xl shadow-float text-xs font-medium"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getIcon(toast.type)}
              <span className="leading-snug break-words">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-full text-white hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
