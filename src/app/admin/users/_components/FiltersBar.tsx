'use client';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { UserPlus } from 'lucide-react';

type FiltersBarProps = {
  serviceValue: string | null;
  cityValue: string | null;
  cityOptions: string[];
  serviceOptions: string[];
  onSearch: () => void;
  onClearFilters: () => void;
  onSelectCity: (value: string | null) => void;
  onSelectService: (value: string | null) => void;
  onCreate: () => void;
};

export function FiltersBar({
  cityValue,
  serviceValue,
  onClearFilters,
  cityOptions,
  serviceOptions,
  onSelectCity,
  onSelectService,
  onCreate,
  onSearch,
}: FiltersBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 ml-5 flex items-end justify-between gap-3">
        <div className="flex w-full max-w-lg gap-4">
          <div className="flex-1">
            <label
              htmlFor="service-select"
              className="mb-1 block text-sm font-medium"
            >
              Serviço:
            </label>
            <Dropdown
              label="Selecionar serviço"
              items={serviceOptions}
              value={serviceValue}
              onSelect={(value) => onSelectService(value)}
              fullWidth
              textSize="sm"
              border="none"
              bgColor="gray"
              textColor="gray"
              size="small"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="city-filter"
              className="mb-1 block text-sm font-medium"
            >
              Cidade:
            </label>
            <Dropdown
              label="Buscar cidade"
              items={cityOptions}
              value={cityValue}
              onSelect={(value) => onSelectCity(value)}
              onInputChange={(value) => onSelectCity(value)}
              fullWidth
              textSize="sm"
              border="none"
              bgColor="gray"
              textColor="gray"
              size="small"
              useAutoComplete
            />
          </div>
        </div>

        <div className="mt-6 ml-4 flex gap-2">
          <Button variant="terciary" onClick={onClearFilters} type="button">
            Limpar Filtro
          </Button>
          <Button variant="secondary" type="submit">
            Buscar
          </Button>
        </div>

        <Button
          onClick={onCreate}
          title="Criar usuário"
          className="mt-8 mr-5 ml-auto items-center border border-black bg-white px-8 py-1 hover:bg-gray-100"
          variant="outline"
        >
          <UserPlus className="h-5 w-5 align-middle" />
        </Button>
      </div>
    </form>
  );
}
