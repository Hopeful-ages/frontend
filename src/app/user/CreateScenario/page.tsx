'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import ProtocolList from '@/components/ProtocolList';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Dropdown } from '@/components/Dropdown';
import { Plus, Save } from 'lucide-react';
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
  const [acao, setAcao] = useState('');
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

  const handleAddTask = () => {
    if (parametro.trim() === '' || acao.trim() === '') {
      alert('Por favor, preencha os campos "Parâmetro" e "Ação".');
      return;
    }

    const newProtocol: Protocol = {
      id: Date.now().toString(),
      description: `${parametro.trim()} - ${acao.trim()}`,
    };

    setProtocols([...protocols, newProtocol]);
    setParametro('');
    setAcao('');
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
        <h1 className="text-gray-850 my-1 text-center text-3xl">
          Cadastrar Cenário
        </h1>
        <div className="mb-6 ml-4 flex w-full gap-8">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Cidade: {cidade}</span>
            <span>Serviço: {servico}</span>
          </div>

          <div className="max-width mt-6 ml-4 flex-1">
            <Dropdown
              label="Selecione a COBRADE"
              items={['COBRADE 1', 'COBRADE 2', 'COBRADE 3']}
              size="long"
              border="gray"
              onSelect={(item) => setCobrade(item)}
              useAutoComplete
            />
          </div>
        </div>

        <PlanStepsTabs
          steps={ETAPAS_DO_PLANO}
          currentStep={etapaAtual}
          onChange={(novaEtapa) => setEtapaAtual(novaEtapa)}
          size="md"
        />

        <div className="mt-6 mb-4 flex items-center gap-4">
          <Input
            name="task"
            placeholder="Digite aqui a tarefa..."
            value={parametro}
            onChange={(e) => setParametro(e.target.value)}
            className="flex-1"
            size={'lg'}
          />
        </div>

        <ProtocolList
          protocols={protocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />
        <div className="mt-8 mr-4 flex items-center gap-4">
          <Button
            variant="secondary"
            size="lg"
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
