'use client';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { Search } from 'lucide-react';

type FiltersBarProps = {
  cityFilter: string;
  onCityChange: (value: string) => void;
  cobradeOptions: string[];
  onSelectCobrade: (value: string | null) => void;
  onSearch: () => void;
  onClearFilters: () => void;
};

export function FiltersBar({
  cityFilter,
  onCityChange,
  cobradeOptions,
  onSelectCobrade,
  onSearch,
  onClearFilters,
}: FiltersBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-start"
    >
      <div className="flex-1 md:flex-grow-0 md:basis-1/3">
        <label htmlFor="city-search" className="mb-1 block text-sm font-medium">
          Cidade:
        </label>
        <Input
          id="city-search"
          type="text"
          placeholder="Buscar cidade..."
          value={cityFilter}
          onChange={(e) => onCityChange(e.target.value)}
          icon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>
      <div className="flex-1 md:flex-grow-0 md:basis-1/3">
        <label
          htmlFor="cobrade-select"
          className="mb-1 block text-sm font-medium"
        >
          Cobrade:
        </label>
        <Dropdown
          label="Selecionar Cobrade"
          items={cobradeOptions}
          onSelect={(value) => onSelectCobrade(value)}
          fullWidth
        />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onClearFilters} type="button">
          Limpar Filtro
        </Button>
        <Button variant="primary" type="submit">
          Buscar
        </Button>
      </div>
    </form>
  );
}