'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { ScenarioResponseDTO } from '@/lib/types';
import { Check, Upload, FileX, X } from 'lucide-react';

type ConfirmPublishModalProps = {
  open: boolean;
  loading: boolean;
  scenario: ScenarioResponseDTO | null;
  onConfirm: () => void;
  onClose: () => void;
};

const getLatestUpdateYear = (
  scenario: ScenarioResponseDTO | null,
): string | number => {
  if (!scenario || !scenario.tasks || scenario.tasks.length === 0) {
    return '';
  }
  const latestTask = scenario.tasks.reduce((latest, current) => {
    const latestDate = new Date(latest.lastUpdateDate);
    const currentDate = new Date(current.lastUpdateDate);
    return currentDate > latestDate ? current : latest;
  });
  return new Date(latestTask.lastUpdateDate).getFullYear();
};

export function ConfirmPublishModal({
  open,
  loading,
  scenario,
  onConfirm,
  onClose,
}: ConfirmPublishModalProps) {
  const scenarioYear = getLatestUpdateYear(scenario);
  const isPublished = scenario?.published ?? false;

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
              {isPublished ? 'Remover Publicação' : 'Publicar Plano'}
            </h2>

            <div className="mb-4 flex flex-col items-center justify-center sm:mb-6">
              {isPublished ? (
                <FileX className="mb-2 h-14 w-14 text-red-600 sm:h-16 sm:w-16 md:h-20 md:w-20" />
              ) : (
                <Upload className="mb-2 h-14 w-14 text-green-600 sm:h-16 sm:w-16 md:h-20 md:w-20" />
              )}
              <p className="mt-1 max-w-full px-2 text-xs break-words text-gray-600 sm:text-sm md:text-base">
                {isPublished
                  ? 'Tem certeza que deseja remover a publicação do plano '
                  : 'Tem certeza que deseja publicar o plano '}
                {scenario && (
                  <>
                    de{' '}
                    <span className="font-semibold">
                      {scenario.city.name} - {scenario.cobrade.code}
                    </span>
                    , {scenarioYear}
                  </>
                )}
                ?
              </p>
            </div>

            <div className="mt-3 flex flex-col justify-center gap-2 sm:mt-4 sm:flex-row sm:gap-3">
              <Button
                variant={isPublished ? 'danger' : 'secondary'}
                onClick={onConfirm}
                disabled={loading}
                size="md"
                leftIcon={<Check className="h-4 w-4" />}
              >
                {loading
                  ? isPublished
                    ? 'Removendo...'
                    : 'Publicando...'
                  : isPublished
                    ? 'Remover Publicação'
                    : 'Publicar'}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
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
