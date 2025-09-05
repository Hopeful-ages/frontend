'use client';
import type { ToastProps, ToastType } from '@/hooks/useToast';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface ToastComponentProps extends ToastProps {
  onClose: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  default: 'bg-white border-gray-200 text-gray-800',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  default: 'text-gray-500',
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconClass = `w-5 h-5 ${iconStyles[type]}`;

  switch (type) {
    case 'success':
      return <CheckCircle className={iconClass} />;
    case 'error':
      return <XCircle className={iconClass} />;
    case 'warning':
      return <AlertTriangle className={iconClass} />;
    case 'info':
      return <Info className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
};

export function Toast({
  title,
  description,
  type = 'default',
  open = true,
  onClose,
}: ToastComponentProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className={`relative flex transform items-start gap-3 rounded-lg border p-4 shadow-lg ${toastStyles[type]} `}
        >
          <ToastIcon type={type} />

          <div className="min-w-0 flex-1">
            {title && (
              <div className="text-sm leading-5 font-medium">{title}</div>
            )}
            {description && (
              <div className="mt-1 text-sm leading-5 opacity-90">
                {description}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5"
            aria-label="Fechar notificação"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
