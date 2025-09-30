'use client';

import { CreateScenarioBase } from '../_components/CreateScenarioBase';

// A tipagem correta de params em rotas dinâmicas do App Router é síncrona.
// O uso anterior de Promise + use() fazia o id ficar indefinido e causava
// chamadas ao backend com ID nulo.
export default function Page({ params }: { params: { id: string } }) {
  const scenarioId = params.id;

  if (!scenarioId) {
    // Fallback defensivo (não deve ocorrer em rota válida)
    return (
      <div className="p-6 text-center text-red-600">
        ID do cenário não informado na rota.
      </div>
    );
  }

  return <CreateScenarioBase scenarioId={scenarioId} />;
}
