'use client';
import { Dropdown } from '@/components/Dropdown';
import { LocateIcon, LocationEdit, MapPin, Search } from 'lucide-react';

type FiltersBarProps = {
  serviceOptions: string[];
  cobradeOptions: string[];
  cityOptions: string[];
  onSelectCity: (v: string | null) => void;
  onSelectService: (v: string | null) => void;
  onSelectCobrade: (v: string | null) => void;
  onSearch: () => void;
};

export function FiltersBar({
  serviceOptions,
  cobradeOptions,
  cityOptions,
  onSelectCity,
  onSelectService,
  onSelectCobrade,
  onSearch,
}: FiltersBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-8">
      <div className="flex w-full flex-col sm:w-auto sm:flex-1">
        <label className="mb-1 text-sm font-medium text-gray-700">Cidade</label>
        <Dropdown
          label="Buscar por cidade"
          items={['Todos', ...cityOptions]}
          onSelect={(v) => onSelectCity(v === 'Todos' ? null : v)}
          size="small"
          bgColor="white"
          border="gray"
          maxItemsVisible={3}
          icon={<Search className="h-4 w-4 text-gray-500" />}
          fullWidth
          useAutoComplete
        />
      </div>

      <div className="flex w-full flex-col sm:w-auto sm:flex-1">
        <label className="mb-1 text-sm font-medium text-gray-700">
          Serviço
        </label>
        <Dropdown
          label="Todos os Serviços"
          items={['Todos', ...serviceOptions]}
          onSelect={(v) => onSelectService(v === 'Todos' ? null : v)}
          size="small"
          bgColor="white"
          border="gray"
          fullWidth
          useAutoComplete
        />
      </div>

      <div className="flex w-full flex-col sm:w-auto sm:flex-1">
        <label className="mb-1 text-sm font-medium text-gray-700">
          Cobrade
        </label>
        <Dropdown
          label="Todos os Cobrades"
          items={['Todos', ...cobradeOptions]}
          onSelect={(v) => onSelectCobrade(v === 'Todos' ? null : v)}
          size="small"
          bgColor="white"
          useAutoComplete
          border="gray"
          fullWidth
        />
      </div>

      <div className="ml-auto flex items-end">
        <button
          onClick={onSearch}
          title="Buscar planos"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
