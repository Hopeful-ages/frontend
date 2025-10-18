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
        <span className="text-black-500 text-sm">Cidade</span>
        <h2 className="text-black-700 w-837 text-xl font-bold">{city}</h2>
        <p className="text-black-400 font-bold- text-sm">{category}</p>
        <span className="text-black-500 mt-4 text-sm">Última atualização</span>
        <p className="text-black-500 text-sm font-bold">{lastUpdate}</p>
      </div>
      <div>
        <Button
          className="text-black-600 mt-6 w-full text-center"
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
