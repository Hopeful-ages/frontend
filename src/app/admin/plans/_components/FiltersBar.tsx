'use client';
import { Dropdown } from '@/components/Dropdown';

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
    <div className="mb-6 ml-5 flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-auto sm:flex-1">
        <label className="text-sm font-medium text-gray-700">Cidade</label>
        <Dropdown
          label="Todas as Cidades"
          items={['Todos', ...cityOptions]}
          onSelect={(v) => onSelectCity(v === 'Todos' ? null : v)}
          size="medium"
          bgColor="gray"
          border="none"
          fullWidth
        />
      </div>

      <div className="w-full sm:w-auto sm:flex-1">
        <label className="text-sm font-medium text-gray-700">Serviço</label>
        <Dropdown
          label="Todos os Serviços"
          items={['Todos', ...serviceOptions]}
          onSelect={(v) => onSelectService(v === 'Todos' ? null : v)}
          size="medium"
          bgColor="gray"
          border="none"
          fullWidth
        />
      </div>

      <div className="w-full sm:w-auto sm:flex-1">
        <label className="text-sm font-medium text-gray-700">Cobrade</label>
        <Dropdown
          label="Todos os Cobrades"
          items={['Todos', ...cobradeOptions]}
          onSelect={(v) => onSelectCobrade(v === 'Todos' ? null : v)}
          size="medium"
          bgColor="gray"
          border="none"
          fullWidth
        />
      </div>

      <div className="ml-auto">
        <button
          onClick={onSearch}
          title="Buscar planos"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          <span>Buscar</span>
        </button>
      </div>
    </div>
  );
}
