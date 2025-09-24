'use client';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';
import { Toast } from './Toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 left-4 z-200 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: index * -4,
            opacity: 1,
            scale: 1 - index * 0.02,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            delay: index * 0.05,
          }}
          style={{
            zIndex: 50 - index,
          }}
        >
          <Toast {...toast} onClose={() => dismiss(toast.id)} />
        </motion.div>
      ))}
    </div>
  );
}
