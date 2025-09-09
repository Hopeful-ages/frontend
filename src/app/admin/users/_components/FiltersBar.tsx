'use client';
import { Dropdown } from '@/components/Dropdown';
import { UserPlus } from 'lucide-react';

type FiltersBarProps = {
  serviceNames: string[];
  cityNames: string[];
  onSelectService: (v: string | null) => void;
  onSelectCity: (v: string | null) => void;
  onCreate: () => void;
};

export function FiltersBar({
  serviceNames,
  cityNames,
  onSelectService,
  onSelectCity,
  onCreate,
}: FiltersBarProps) {
  return (
    <div className="mb-6 ml-5 flex flex-wrap items-center gap-3">
      <Dropdown
        label="Serviço"
        items={['Todos', ...serviceNames]}
        onSelect={(v) => onSelectService(v === 'Todos' ? null : v)}
        size="small"
        bgColor="white"
        border="gray"
      />
      <Dropdown
        label="Cidade"
        items={['Todos', ...cityNames]}
        onSelect={(v) => onSelectCity(v === 'Todos' ? null : v)}
        size="small"
        bgColor="white"
        border="gray"
      />
      <button
        onClick={onCreate}
        title="Criar usuário"
        className="mr-5 ml-auto inline-flex -translate-y-[4px] items-center justify-center rounded-sm border border-black bg-white px-8 py-1 hover:bg-gray-100"
      >
        <UserPlus className="h-5 w-5 fill-black align-middle text-black" />
      </button>
    </div>
  );
}
