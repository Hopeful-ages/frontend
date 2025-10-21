import React from 'react';
import { Button } from './Button';
import { formatDate } from '@/lib/utils';

interface PlanCardProps {
  city: string;
  cobrade: string;
  lastUpdate: string;
  onDownload?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  city,
  cobrade,
  lastUpdate,
  onDownload,
}) => {
  return (
    <div className="flex w-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-md">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Cidade</span>
        <h2 className="truncate text-lg font-semibold text-gray-800">{city}</h2>
        <p className="truncate text-sm text-gray-600">{cobrade}</p>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="text-gray-400">Última atualização:</span>
          <span className="text-gray-500">{formatDate(lastUpdate)}</span>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onDownload}
          className="w-full text-center text-gray-700"
          variant="outline"
          size="lg"
        >
          Baixar
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
