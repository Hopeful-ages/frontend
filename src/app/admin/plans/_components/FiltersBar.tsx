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
  publishedSearchable?: boolean;
  publishedValue?: string | null;
  onSelectPublished?: (value: string | null) => void;
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
  publishedSearchable = false,
  publishedValue,
  onSelectPublished,
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
              onSelect={(v) => onSelectCity(v || null)}
              onInputChange={(v) => onSelectCity(v || null)}
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
              COBRADE:
            </label>
            <Dropdown
              label="Selecionar COBRADE"
              items={cobradeOptions}
              onSelect={(value) => onSelectCobrade(value || null)}
              value={cobradeValue}
              fullWidth
              textSize="sm"
              border="none"
              bgColor="gray"
              textColor="gray"
              size="small"
            />
          </div>

          {publishedSearchable && (
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Publicação:
              </label>
              <Dropdown
                label="Status de Publicação"
                items={['Publicado', 'Não publicado']}
                value={publishedValue}
                onSelect={(v) => onSelectPublished?.(v || null)}
                fullWidth
                textSize="sm"
                border="none"
                bgColor="gray"
                textColor="gray"
                size="small"
              />
            </div>
          )}
        </div>

        <div
          className={`flex w-full flex-col items-start gap-5 px-6 md:flex-row ${
            publishedSearchable ? 'md:items-center' : 'md:items-end'
          }`}
        >
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
