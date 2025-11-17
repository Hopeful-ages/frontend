'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, X, FileText } from 'lucide-react';
import { Button } from './Button';
import { useModal } from '@/hooks/useModal';
import { useRef } from 'react';

type DownloadModalProps = {
  isOpen: boolean;
  city: string;
  year: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DownloadModal({
  isOpen,
  city,
  year,
  onConfirm,
  onCancel,
}: DownloadModalProps) {
  const { modalRef } = useModal({ isOpen, onClose: onCancel });
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            ref={modalRef}
            className="mx-auto w-full max-w-[90%] rounded-2xl bg-white p-5 text-center shadow-xl sm:max-w-md sm:p-6 md:p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="download-modal-title"
              className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl md:text-2xl"
            >
              Confirmar download
            </h2>

            <div className="mb-4 flex flex-col items-center justify-center sm:mb-6">
              <FileText
                className="mb-2 h-14 w-14 text-black sm:h-16 sm:w-16 md:h-20 md:w-20"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-gray-800 sm:text-base md:text-lg">
                PDF
              </p>
              <p className="mt-1 max-w-full px-2 text-xs break-words text-gray-600 sm:text-sm md:text-base">
                {city}, {year}
              </p>
            </div>

            <div className="mt-3 flex flex-col justify-center gap-2 sm:mt-4 sm:flex-row sm:gap-3">
              <Button
                ref={confirmButtonRef}
                onClick={onConfirm}
                variant="primary"
                size="md"
                leftIcon={<FileDown className="h-4 w-4" aria-hidden="true" />}
                aria-label={`Baixar PDF de ${city}, ${year}`}
              >
                Baixar
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="md"
                leftIcon={<X className="h-4 w-4" aria-hidden="true" />}
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
