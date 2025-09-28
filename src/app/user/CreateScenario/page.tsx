'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import ProtocolList from '@/components/ProtocolList';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Dropdown } from '@/components/Dropdown';
import { Save, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ETAPAS_DO_PLANO = ['Antes', 'Durante', 'Depois'];

type Protocol = {
  id: string;
  description: string;
};

export default function CreateScenario() {
  const [etapaAtual, setEtapaAtual] = useState(ETAPAS_DO_PLANO[0]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [cidade, setCidade] = useState('Porto Alegre - RS');
  const [cobrade, setCobrade] = useState<string | null>(null);
  const [parametro, setParametro] = useState('');
  const [servico, setServico] = useState('Bombeiro');

  const handleRemoveProtocol = (protocolToRemove: Protocol) => {
    const updatedProtocols = protocols.filter(
      (protocol) => protocol.id !== protocolToRemove.id,
    );
    setProtocols(updatedProtocols);
  };

  const handleEditProtocol = (protocolToEdit: Protocol) => {
    if (!protocolToEdit) {
      console.error('Protocolo não encontrado!');
      return;
    }

    const newDescription = prompt(
      'Edite a descrição do protocolo:',
      protocolToEdit.description,
    );

    if (newDescription && newDescription.trim() !== '') {
      const updatedProtocols = protocols.map((protocol) =>
        protocol.id === protocolToEdit.id
          ? { ...protocol, description: newDescription }
          : protocol,
      );
      setProtocols(updatedProtocols);
    }
  };

  const handleSave = () => {
    if (!cobrade) {
      alert('Por favor, selecione um COBRADE.');
      return;
    }

    const scenarioData = {
      cidade,
      cobrade,
      etapa: etapaAtual,
      protocols,
    };

    console.log('--- DADOS A SEREM SALVOS ---', scenarioData);
    alert(
      `Cenário para a cidade de ${cidade} foi salvo com sucesso! (Verifique o console para ver os dados)`,
    );
  };

  return (
    <div className="b-l b-r min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl border p-4 pt-24">
        <h1 className="text-gray-850 mt-1 mb-4 text-center text-3xl">
          Cadastrar Cenário
        </h1>

        <div className="mt-4 mb-6 ml-4 w-full">
          <div className="mb-2 flex items-center justify-between pr-20 text-sm text-gray-400">
            <span>Cidade: {cidade}</span>
            <span>Serviço: {servico}</span>
          </div>

          <div className="mt-4 flex w-full gap-4 pr-4">
            <Dropdown
              label="Selecione a COBRADE"
              items={['COBRADE 1', 'COBRADE 2', 'COBRADE 3']}
              size="long"
              border="gray"
              fullWidth={true}
              onSelect={(item) => setCobrade(item)}
              useAutoComplete
            />
          </div>
        </div>

        <PlanStepsTabs
          steps={ETAPAS_DO_PLANO}
          currentStep={etapaAtual}
          onChange={(novaEtapa) => setEtapaAtual(novaEtapa)}
          size="sm"
        />

        <div className="mt-6 mb-4 flex items-center gap-2">
          {' '}
          {/* Borda e padding removidos daqui */}
          <Input
            name="task"
            placeholder="Digite aqui a tarefa..."
            value={parametro}
            onChange={(e) => setParametro(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-0" // Borda e padding adicionados aqui
            size={'lg'}
          />
          <button
            type="button"
            className="rounded-md bg-gray-800 p-2 text-white transition-colors hover:bg-gray-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <ProtocolList
          protocols={protocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />
        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            size="md"
            onClick={handleSave}
            leftIcon={<Save size={16} />}
          >
            Salvar
          </Button>
        </div>
      </main>
    </div>
  );
}
