'use client';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';

type FiltersBarProps = {
  cityOptions: string[];
  cityValue: string | null;
  onSelectCity: (value: string | null) => void;
  cobradeOptions: string[];
  cobradeValue: string | null;
  onSelectCobrade: (value: string | null) => void;
  onSearch: () => void;
  onClearFilters: () => void;
};

export function FiltersBar({
  cityOptions,
  cityValue,
  onSelectCity,
  cobradeOptions,
  cobradeValue,
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
      className="mb-6 flex flex-col gap-4 md:flex-row md:items-end"
    >
      <div className="flex w-full flex-col items-start gap-5 px-6 md:flex-row md:items-end">
        <div className="flex w-full max-w-lg gap-4">
          <div className="flex-1">
            <label
              htmlFor="city-search"
              className="mb-1 block text-sm font-medium"
            >
              Cidade:
            </label>
            <Dropdown
              label="Buscar cidade"
              items={cityOptions}
              value={cityValue}
              onSelect={(v) => onSelectCity(v)}
              fullWidth
              textSize="sm"
              border="none"
              bgColor="gray"
              textColor="gray"
              size="small"
              useAutoComplete
            />
          </div>
          <div className="flex-1">
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
              value={cobradeValue}
              fullWidth
              textSize="sm"
              border="none"
              bgColor="gray"
              textColor="gray"
              size="small"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="terciary" onClick={onClearFilters} type="button">
            Limpar Filtro
          </Button>
          <Button variant="secondary" type="submit">
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
}
