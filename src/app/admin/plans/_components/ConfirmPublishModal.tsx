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
      title={isPublished ? 'Remover Publicação' : 'Publicar Plano'}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            variant={isPublished ? 'danger' : 'secondary'}
            onClick={onConfirm}
            disabled={loading}
            leftIcon={<Check />}
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
            leftIcon={<X />}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2">
        {isPublished ? (
          <FileX className="h-7 w-7 text-red-600" />
        ) : (
          <Upload className="h-7 w-7 text-green-600" />
        )}
        <div className="text-center">
          <p className="text-sm text-gray-900">
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
      </div>
    </Modal>
  );
}
