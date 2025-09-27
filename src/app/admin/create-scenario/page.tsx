'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import ProtocolList, { Protocol } from '@/components/ProtocolList';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Dropdown } from '@/components/Dropdown';
import { Plus, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { CobradeResponseDTO } from '@/lib/types';
import { CityResponseDTO } from '@/lib/types';

const PLAN_STEPS = ['Antes', 'Durante', 'Depois'];

export default function CreateScenario() {
  const [currentStep, setCurrentStep] = useState(PLAN_STEPS[0]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [city, setCity] = useState<CityResponseDTO | null>(null);
  const [cobrades, setCobrades] = useState<CobradeResponseDTO[]>([]);
  const [cobrade, setCobrade] = useState<CobradeResponseDTO | null>(null);
  const [parameter, setParameter] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    const fetchCobrades = async () => {
      try {
        const data = await api.getAllCobrades();
        setCobrades(data);
      } catch (err) {
        console.error('Erro ao buscar COBRADES', err);
      }
    };
    const fetchCities = async () => {
      try {
        const data = await api.getAllCities();
        setCities(data);
      } catch (err) {
        console.error('Erro ao buscar citiess', err);
      }
    };
    fetchCities();
    fetchCobrades();
  }, []);

  const handleRemoveProtocol = (protocolToRemove: Protocol) => {
    setProtocols(
      protocols.filter((protocol) => protocol.id !== protocolToRemove.id),
    );
  };

  const handleEditProtocol = (protocolToEdit: Protocol) => {
    const newDescription = prompt(
      'Edite a descrição do protocolo:',
      protocolToEdit.description,
    );

    if (newDescription && newDescription.trim() !== '') {
      setProtocols(
        protocols.map((protocol) =>
          protocol.id === protocolToEdit.id
            ? { ...protocol, description: newDescription }
            : protocol,
        ),
      );
    }
  };

  const handleAddTask = () => {
    if (parameter.trim() === '' || action.trim() === '') {
      alert('Por favor, preencha os campos "Parâmetro" e "Ação".');
      return;
    }

    const newProtocol: Protocol = {
      id: Date.now().toString(),
      description: `${parameter.trim()} - ${action.trim()}`,
    };

    setProtocols([...protocols, newProtocol]);
    setParameter('');
    setAction('');
  };

  const handleSave = () => {
    if (!cobrade) {
      alert('Por favor, selecione um COBRADE.');
      return;
    }

    if (!city) {
      alert('Por favor, selecione uma cidade.');
      return;
    }

    const scenarioData = {
      city,
      cobrade,
      step: currentStep,
      protocols,
    };

    console.log('--- DADOS A SEREM SALVOS ---', scenarioData);
    alert(
      `Cenário para a cidade ${city.name} - ${city.state} foi salvo com sucesso!`,
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
          <div className="flex-1">
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Cidade
            </label>
            <Dropdown
              label="Selecione a cidade"
              items={cities.map((c) => `${c.name} - ${c.state}`)}
              size="large"
              value={city ? `${city.name} - ${city.state}` : ''}
              onSelect={(cityString) => {
                const cityName = cityString.split(' - ')[0];
                const selectedCity =
                  cities.find((c) => c.name === cityName) || null;
                setCity(selectedCity);
              }}
              useAutoComplete
            />
          </div>

          <div className="mt-6 ml-4 flex-1">
            <Dropdown
              label="Selecione a COBRADE"
              items={cobrades.map((c) => c.subgroup)}
              size="large"
              border="gray"
              value={cobrade?.subgroup ?? ''}
              onSelect={(desc) => {
                const selected =
                  cobrades.find((c) => c.description === desc) || null;
                setCobrade(selected);
              }}
              useAutoComplete
            />
          </div>
        </div>

        {/* Etapas */}
        <PlanStepsTabs
          steps={PLAN_STEPS}
          currentStep={currentStep}
          onChange={(newStep) => setCurrentStep(newStep)}
          size="md"
        />

        {/* Inputs */}
        <div className="mt-6 mb-4 flex items-center gap-4">
          <label className="w-24 text-lg font-medium">Parâmetro</label>
          <Input
            name="parameter"
            placeholder="Digite aqui o parâmetro"
            value={parameter}
            onChange={(e) => setParameter(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="w-24 text-lg font-medium">Ação</label>
          <Input
            name="action"
            placeholder="Digite aqui a ação"
            className="flex-1"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        {/* Lista de protocolos */}
        <ProtocolList
          protocols={protocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />

        {/* Botões */}
        <div className="mt-8 mr-4 flex items-center justify-end gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleAddTask}
            leftIcon={<Plus size={16} />}
          >
            Adicionar Tarefa
          </Button>

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
