import React from 'react';
import Header from './Header';
import { Button } from './Button';

const PlanCard: React.FC<{ plan: string }> = ({ plan }) => {
  const plans = [
    { id: 1, name: 'Plano A' },
    { id: 2, name: 'Plano B' },
  ];
  return (
    <main className="rounded-lg border border-gray-300 p-4 shadow-md">
      <Header />
      <h1 className="text-gray-600">Planos de contingência</h1>
      <div>
        <Button>Filtrar</Button>
        <Button>Buscar</Button>
      </div>

      <div>
        {plans.map((p) => (
          <div key={p.id}>
            <h3 className="mb-2 text-lg font-semibold">{p.name}</h3>
            <Button>Baixar</Button>
          </div>
        ))}
      </div>
    </main>
  );
};
export default PlanCard;
