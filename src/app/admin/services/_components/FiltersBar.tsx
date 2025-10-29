'use client';
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react';

type FiltersBarProps = {
  onCreateAction: () => void;
};

export function FiltersBar({
  onCreateAction,
}: FiltersBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 sm:mb-6 ml-0 sm:ml-5 flex items-end justify-between px-4 sm:px-0">
        <Button
          onClick={onCreateAction}
          title="Adicionar serviço"
          className="mt-4 sm:mt-8 mr-0 sm:mr-5 ml-auto items-center border border-black bg-white px-4 sm:px-8 py-1.5 sm:py-1 text-sm sm:text-base hover:bg-gray-100"
          variant="outline"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 align-middle" />
        </Button>
      </div>
    </form>
  );
}