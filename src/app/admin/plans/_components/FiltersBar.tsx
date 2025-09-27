'use client';
import { Dropdown } from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { Search, X } from 'lucide-react';

type FiltersBarProps = {
  cobradeOptions: string[];
  cityFilter: string;
  onCityChange: (value: string) => void;
  onSelectCobrade: (v: string | null) => void;
  onSearch: () => void;
  onClearFilters: () => void;
};

export function FiltersBar({
  cobradeOptions,
  cityFilter,
  onCityChange,
  onSelectCobrade,
  onSearch,
  onClearFilters,
}: FiltersBarProps) {
  return (
    <div className="mb-6 ml-5 flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-auto sm:flex-1">
        <label className="text-sm font-medium text-gray-700">Cidade:</label>
        <Input
          placeholder="Buscar cidade..."
          value={cityFilter}
          onChange={(e) => onCityChange(e.target.value)}
          icon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      <div className="w-full sm:w-auto sm:flex-1">
        <label className="text-sm font-medium text-gray-700">Cobrade:</label>
        <Dropdown
          label="Selecionar Cobrade"
          items={['Todos', ...cobradeOptions]}
          onSelect={(v) => onSelectCobrade(v === 'Todos' ? null : v)}
          size="medium"
          bgColor="gray"
          border="none"
          fullWidth
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onClearFilters}
          title="Limpar filtros"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
        >
          Limpar Filtro
        </button>
        <button
          onClick={onSearch}
          title="Buscar planos"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </button>
      </div>
    </div>
  );
}
