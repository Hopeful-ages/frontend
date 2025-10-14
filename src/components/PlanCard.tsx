import React from 'react';
import { Button } from './Button';

interface PlanCardProps {
  city: string;
  category: string;
  lastUpdate: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ city, category, lastUpdate }) => {
  return (
    <div className="w-full max-w-xs rounded-lg border border-gray-300 p-4 shadow-sm">
      <div className="flex w-full flex-col items-start gap-2">
        <span className="text-sm text-gray-500">Cidade</span>
        <h2 className="text-xl font-bold text-black">{city}</h2>
        <p className="text-black-400 text-sm font-bold">{category}</p>
        <span className="mt-4 text-sm text-gray-500">Última atualização</span>
        <p className="text-sm font-semibold text-gray-700">{lastUpdate}</p>
      </div>
      <div>
        <Button
          className="mt-6 w-full text-center text-black"
          variant="outline"
          size="lg"
        >
          Baixar
        </Button>
      </div>
    </div>
  );
};
export default PlanCard;
