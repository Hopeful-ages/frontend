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

const initialProtocols: Protocol[] = [
  {
    id: '1',
    description:
      'Realizar simulações periódicas de evacuação para trabalhadores e comunidades vizinhas em caso de acidente químico. (Bombeiros, 2025)',
  },
  {
    id: '2',
    description:
      'Definir rotas de transporte seguro para resíduos químicos e estabelecer procedimentos para descarte adequado. (Polícia Rodoviária, 2025)',
  },
  {
    id: '3',
    description:
      'Estabelecer protocolos para a contenção de vazamentos de produtos químicos em indústrias, com medidas de isolamento da área e neutralização da substância. (Defesa Civil, 2025)',
  },
];

export default function CreateScenario() {
  const [etapaAtual, setEtapaAtual] = useState(ETAPAS_DO_PLANO[0]);
  const [protocols, setProtocols] = useState<Protocol[]>(initialProtocols);

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

  return (
    <div className="b-l b-r min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl border p-4 pt-24">
        <h1 className="text-gray-850 my-1 text-center text-3xl">
          Cadastrar Cenário
        </h1>
        <div className="mb-6 ml-4 flex w-full gap-8">
          <div className="flex-1">
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Cidade
            </label>
            <Input
              id="city"
              name="city"
              size="md"
              placeholder="Cidade"
              defaultValue="Porto Alegre - RS"
            />
          </div>
          <div className="mt-6 ml-4 flex-1">
            <Dropdown
              label="Selecione a COBRADE"
              items={['COBRADE 1', 'COBRADE 2', 'COBRADE 3']}
              size="large"
              border="gray"
              onSelect={(item) => console.log('Selected item:', item)}
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
          <label className="w-24 text-lg font-medium">Parâmetro</label>
          <Input
            name="task"
            placeholder="Digite aqui o parâmetro"
            className="flex-1"
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="w-24 text-lg font-medium">Ação</label>
          <Input
            name="task"
            placeholder="Digite aqui a Ação"
            className="flex-1"
          />
        </div>
        <ProtocolList
          protocols={protocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />
        <div className="mt-8 mr-4 flex items-center justify-end gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              console.log('Adicionar nova tarefa');
            }}
            leftIcon={<Plus size={16} />}
          >
            Adicionar Tarefa
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              console.log('Salvar');
            }}
            leftIcon={<Save size={16} />}
          >
            Salvar
          </Button>
        </div>
      </main>
    </div>
  );
}
