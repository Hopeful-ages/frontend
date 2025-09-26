import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import ProtocolList from '@/components/ProtocolList';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Plus, Save } from 'lucide-react';
import { useState } from 'react';

const ETAPAS_DO_PLANO = ['Informações Gerais', 'Protocolos'];
export default function CreateScenario() {
  const [etapaAtual, setEtapaAtual] = useState(ETAPAS_DO_PLANO[0]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl p-4">
        <div>Cadastrar Cenário</div>
        <div>
          <label className="text-sm font-medium">Cidade (lg)</label>
          <Input
            name="city"
            size="lg"
            placeholder="Cidade"
            defaultValue="Porto Alegre - RS"
          />
        </div>
        <div>
          <Input
            className="text-sm font-medium"
            name="cobrade"
            size="lg"
            placeholder="Selecione a COBRADE"
          />
        </div>

        <PlanStepsTabs
          steps={ETAPAS_DO_PLANO}
          currentStep={etapaAtual}
          onChange={(novaEtapa) => setEtapaAtual(novaEtapa)}
          size="md"
        />
        <div>
          <label className="text-sm font-medium">Parâmetro</label>
          <Input name="task" placeholder="Digite aqui ao parâmetro" />
        </div>

        <div>
          <label className="text-sm font-medium">Ação</label>
          <Input name="task" placeholder="Digite aqui a Ação" />
        </div>
        <ProtocolList protocols={[]} onEdit={() => {}} onRemove={() => {}} />
        <Button variant="outline" className="my-4">
          <Plus size={16} /> Adicionar Protocolo
        </Button>
        <div className="flex justify-end">
          <Button>
            <Save size={16} /> Salvar Cenário
          </Button>
        </div>
      </main>
    </div>
  );
}
