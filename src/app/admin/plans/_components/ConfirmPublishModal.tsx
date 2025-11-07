'use client';
import { Modal } from '@/components/Modal';
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
    <Modal
      isOpen={open}
      onClose={onClose}
      title=""
      size="sm"
      hideCloseIcon
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onConfirm}
            disabled={loading}
            leftIcon={<Check size={16} />}
          >
            {isPublished ? 'Remover Publicação' : 'Publicar Plano'}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            leftIcon={<X size={16} />}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center px-2 py-4 text-center">
        <h2 className="text-2xl font-bold text-black">
          {isPublished ? 'Remover a Publicação do Plano' : 'Publicar plano'}
        </h2>
        {isPublished ? (
          <FileX className="text-black-600 my-4 h-16 w-16" />
        ) : (
          <Upload className="text-black-600 my-4 h-16 w-16" />
        )}
        {scenario && (
          <p className="text-gray-600">
            Deseja{' '}
            {isPublished ? 'Remover a Publicação do Plano' : 'Publicar Plano'} o
            plano de{' '}
            <strong>
              {scenario.city.name} - {scenario.cobrade.code}
            </strong>
            , {scenarioYear}?
          </p>
        )}
      </div>
    </Modal>
  );
}
