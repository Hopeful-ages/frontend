'use client';
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react';

type FiltersBarProps = {
  onCreateAction: () => void;
};

export function FiltersBar({ onCreateAction }: FiltersBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 ml-5 flex items-end justify-start">
        <Button
          onClick={onCreateAction}
          variant="outline"
          size={'sm'}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Adicionar Serviço
        </Button>
      </div>
    </form>
  );
}
