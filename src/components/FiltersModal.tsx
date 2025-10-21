import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Dropdown } from './Dropdown';

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
}: FiltersModalProps) {
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
            className="mx-auto w-full max-w-[90%] rounded-2xl bg-white p-5 shadow-xl sm:max-w-md sm:p-6 md:p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">Filtros</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleClear}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:text-base"
              >
                Limpar Filtros
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:text-base"
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
