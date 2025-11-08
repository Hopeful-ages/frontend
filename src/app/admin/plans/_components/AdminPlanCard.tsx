'use client';

import { Button } from '@/components/Button';
import { ScenarioResponseDTO } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Check, FileDown, Pencil, X } from 'lucide-react';

interface AdminPlanCardProps {
  plan: ScenarioResponseDTO;
  onEdit: (id: string) => void;
  onDownload: (scenario: ScenarioResponseDTO) => void;
  onPublish: (scenario: ScenarioResponseDTO) => void;
}

export const AdminPlanCard = ({
  plan,
  onEdit,
  onDownload,
  onPublish,
}: AdminPlanCardProps) => {
  const lastUpdated =
    plan.tasks && plan.tasks.length > 0
      ? plan.tasks.reduce((latest, current) => {
          const latestDate = new Date(latest.lastUpdateDate);
          const currentDate = new Date(current.lastUpdateDate);
          return currentDate > latestDate ? current : latest;
        }).lastUpdateDate
      : null;

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <div className="mb-2">
        <div className="mb-1">
          <span className="text-xs text-gray-500">Cidade</span>
          <p className="text-sm font-semibold text-gray-800">
            {plan.city ? `${plan.city.name} - ${plan.city.state}` : '—'}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Cobrade</span>
          <p className="text-sm text-gray-700">
            {`${plan.cobrade.code} - ${plan.cobrade.subType || plan.cobrade.type || plan.cobrade.subgroup}`}
          </p>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-gray-500">Última Atualização</span>
          <p className="text-sm font-medium text-gray-700">
            {lastUpdated ? formatDate(lastUpdated) : '—'}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Status</span>
          <p
            className={`text-sm font-semibold ${
              plan.published ? 'text-green-600' : 'text-yellow-700'
            }`}
          >
            {plan.published ? 'Publicado' : 'Não Publicado'}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(plan.id)}
          leftIcon={<Pencil size={16} />}
        >
          Editar
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => !plan.published && onPublish(plan)}
            disabled={plan.published}
            leftIcon={plan.published ? <Check size={16} /> : <X size={16} />}
          >
            {plan.published ? 'Publicado' : 'Publicar'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onDownload(plan)}
            disabled={!plan.published}
            leftIcon={<FileDown size={16} />}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
