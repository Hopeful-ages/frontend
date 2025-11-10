'use client';

import { DepartmentResponseDTO } from '@/lib/types';
import { Hammer, X } from 'lucide-react';

type ServiceCardProps = {
  service: DepartmentResponseDTO;
  onDelete: (id: string) => void;
};

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Hammer className="h-5 w-5 text-gray-600" />
          </div>
          <span className="font-medium text-gray-800">{service.name}</span>
        </div>
        <button
          type="button"
          title="Excluir"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          onClick={() => onDelete(service.id)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
