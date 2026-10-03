import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-medium">
        <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
