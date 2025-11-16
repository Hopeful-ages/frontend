'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { Check, X, AlertTriangle } from 'lucide-react';

type ConfirmToggleModalProps = {
  open: boolean;
  loading: boolean;
  isActive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmToggleModal({
  open,
  loading,
  isActive,
  onConfirm,
  onClose,
}: ConfirmToggleModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto w-full max-w-[90%] rounded-2xl bg-white p-5 text-center shadow-xl sm:max-w-md sm:p-6 md:p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl md:text-2xl">
              {isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
            </h2>

            <div className="mb-4 flex flex-col items-center justify-center sm:mb-6">
              <AlertTriangle className="mb-2 h-14 w-14 text-yellow-600 sm:h-16 sm:w-16 md:h-20 md:w-20" />
              <p className="mt-1 max-w-full px-2 text-xs break-words text-gray-600 sm:text-sm md:text-base">
                {isActive
                  ? 'Tem certeza que deseja desativar este usuário?'
                  : 'Tem certeza que deseja ativar este usuário?'}
              </p>
            </div>

            <div className="mt-3 flex flex-col justify-center gap-2 sm:mt-4 sm:flex-row sm:gap-3">
              <Button
                onClick={onConfirm}
                disabled={loading}
                variant={isActive ? 'danger' : 'secondary'}
                size="md"
                leftIcon={<Check className="h-4 w-4" />}
              >
                {loading
                  ? isActive
                    ? 'Desativando...'
                    : 'Ativando...'
                  : isActive
                    ? 'Desativar'
                    : 'Ativar'}
              </Button>
              <Button
                onClick={onClose}
                disabled={loading}
                variant="outline"
                size="md"
                leftIcon={<X className="h-4 w-4" />}
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
