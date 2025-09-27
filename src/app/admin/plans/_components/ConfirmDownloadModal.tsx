'use client';
import { Modal } from '@/components/Modal';
import { ScenarioResponseDTO } from '@/lib/types';
import { Check, FileText, X } from 'lucide-react';

type ConfirmDownloadModalProps = {
  open: boolean;
  loading: boolean;
  scenario: ScenarioResponseDTO | null;
  onConfirm: () => void;
  onClose: () => void;
};

const getLatestUpdateYear = (
  scenario: ScenarioResponseDTO | null
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

export function ConfirmDownloadModal({
  open,
  loading,
  scenario,
  onConfirm,
  onClose,
}: ConfirmDownloadModalProps) {
  const scenarioYear = getLatestUpdateYear(scenario);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title=""
      size="sm"
      hideCloseIcon
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-5 py-2 text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>Baixar</span>
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-red-600 bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center px-2 py-4 text-center">
        <h2 className="text-2xl font-bold text-black">Confirmar download</h2>
        <FileText className="my-4 h-16 w-16 text-black-600" />
        {scenario && (
          <p className="text-gray-600">
            {scenario.city.name ?? ''}, {scenarioYear}
          </p>
        )}
      </div>
    </Modal>
  );
}