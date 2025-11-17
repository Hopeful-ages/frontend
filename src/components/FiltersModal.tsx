'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { useModal } from '@/hooks/useModal';
import { useRef } from 'react';

type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cityOptions: string[];
  cobradeOptions: string[];
  cityValue: string | null;
  cobradeValue: string | null;
  onSelectCity: (value: string | null) => void;
  onSelectCobrade: (value: string | null) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  publishedOptions?: string[];
  publishedValue?: string | null;
  onSelectPublished?: (value: string | null) => void;
};

export default function FiltersModal({
  isOpen,
  onClose,
  cityOptions,
  cobradeOptions,
  cityValue,
  cobradeValue,
  onSelectCity,
  onSelectCobrade,
  onApplyFilters,
  onClearFilters,
  publishedOptions,
  publishedValue,
  onSelectPublished,
}: FiltersModalProps) {
  const { modalRef } = useModal({ isOpen, onClose });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-modal-title"
            className="mx-auto w-full max-w-[90%] rounded-2xl bg-white p-5 shadow-xl sm:max-w-md sm:p-6 md:p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="filters-modal-title"
                className="text-xl font-semibold sm:text-2xl"
              >
                Filtros
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="rounded-full p-1 transition hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                aria-label="Fechar modal de filtros"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label
                  htmlFor="city-dropdown"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Cidade:
                </label>
                <Dropdown
                  label="Selecione Cidade"
                  items={cityOptions}
                  onSelect={onSelectCity}
                  value={cityValue}
                  fullWidth
                  size="long"
                  useAutoComplete
                />
              </div>

              <div>
                <label
                  htmlFor="cobrade-dropdown"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Cobrade:
                </label>
                <Dropdown
                  label="Selecione COBRADE"
                  items={cobradeOptions}
                  onSelect={onSelectCobrade}
                  value={cobradeValue}
                  fullWidth
                  size="long"
                  useAutoComplete
                />
              </div>

              {publishedOptions && onSelectPublished && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status de Publicação:
                  </label>
                  <Dropdown
                    label="Selecione o Status"
                    items={publishedOptions}
                    onSelect={onSelectPublished}
                    value={publishedValue}
                    fullWidth
                    size="long"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleClear}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:text-base"
              >
                Limpar Filtros
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:text-base"
              >
                Filtrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
