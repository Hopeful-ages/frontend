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
import {
  CobradeDTO,
  ServiceSummaryDTO,
  ScenarioResponseDTO,
  ScenarioRequestDTO,
} from '@/lib/types';
import { CityResponseDTO } from '@/lib/types';
import { CreateTask } from './_components/CreateTask';

const PLAN_STEPS = ['Antes', 'Durante', 'Depois'];

export default function CreateScenario() {
  const [currentStep, setCurrentStep] = useState(PLAN_STEPS[0]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [city, setCity] = useState<CityResponseDTO | null>(null);
  const [cobrades, setCobrades] = useState<CobradeDTO[]>([]);
  const [cobrade, setCobrade] = useState<CobradeDTO | null>(null);
  const [parameter, setParameter] = useState('');
  const [action, setAction] = useState('');
  const [services, setServices] = useState<ServiceSummaryDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Protocol | null>(null);
  const [existingScenario, setExistingScenario] =
    useState<ScenarioResponseDTO | null>(null);

  // Buscar cenário existente quando cidade e COBRADE são selecionados
  useEffect(() => {
    const fetchExistingScenario = async () => {
      if (city && cobrade) {
        try {
          const scenario = await api.getScenarioByIdAndCobrade(
            city.id,
            cobrade.id,
          );
          setExistingScenario(scenario);

          // Converter tasks do cenário para protocols
          const tasksAsProtocols: Protocol[] = scenario.tasks.map((task) => ({
            id: task.id,
            description: `${task.description} (${task.service?.name || 'Sem serviço'}, ${new Date().getFullYear()})`,
          }));

          setProtocols(tasksAsProtocols);

          // Preencher parâmetros se existirem
          if (scenario.parameters.length > 0) {
            const firstParam = scenario.parameters[0];
            setParameter(firstParam.description);
            setAction(firstParam.action);
          }
        } catch {
          console.log(
            'Nenhum cenário encontrado para esta combinação cidade/COBRADE',
          );
          // Limpar dados se não encontrar cenário
          setExistingScenario(null);
          setProtocols([]);
          setParameter('');
          setAction('');
        }
      }
    };

    fetchExistingScenario();
  }, [city, cobrade]);

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
        console.error('Erro ao buscar CIDADES', err);
      }
    };
    const fetchServices = async () => {
      try {
        const data = await api.getAllServices();
        setServices(data);
      } catch (err) {
        console.error('Erro ao buscar SERVIÇOS', err);
      }
    };
    fetchCities();
    fetchCobrades();
    fetchServices();
  }, []);

  const handleEditProtocol = (protocolToEdit: Protocol) => {
    setEditTask(protocolToEdit);
    setIsTaskModalOpen(true);
  };

  const handleRemoveProtocol = (protocolToRemove: Protocol) => {
    setProtocols(
      protocols.filter((protocol) => protocol.id !== protocolToRemove.id),
    );
  };

  const handleSave = async () => {
    if (!cobrade) {
      alert('Por favor, selecione um COBRADE.');
      return;
    }

    if (!city) {
      alert('Por favor, selecione uma cidade.');
      return;
    }

    if (protocols.length === 0) {
      alert('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    try {
      // Mapear fases do português para inglês
      const phaseMap: Record<string, 'ANTES' | 'DURANTE' | 'DEPOIS'> = {
        Antes: 'ANTES',
        Durante: 'DURANTE',
        Depois: 'DEPOIS',
      };

      // Preparar dados das tasks
      const tasks = protocols.map((protocol) => {
        // Extrair descrição sem o serviço e ano
        const description = protocol.description.split(' (')[0];

        // Extrair serviceId se possível (você pode implementar uma lógica mais robusta)
        const serviceMatch = protocol.description.match(/\(([^,]+),/);
        const serviceName = serviceMatch?.[1];
        const service = services.find((s) => s.name === serviceName);

        return {
          description,
          phase: phaseMap[currentStep],
          serviceId: service?.id || null,
        };
      });

      // Preparar parâmetros (se existirem)
      const parameters = [];
      if (parameter.trim() && action.trim()) {
        parameters.push({
          description: parameter.trim(),
          action: action.trim(),
          phase: phaseMap[currentStep],
        });
      }

      const scenarioData: ScenarioRequestDTO = {
        description: existingScenario?.description || null,
        origin:
          existingScenario?.origin ||
          `Plano de contingência para ${cobrade.subgroup || cobrade.type || 'emergências'} em ${city.name}`,
        cityId: city.id,
        cobradeId: cobrade.id,
        tasks,
        parameters,
      };

      if (existingScenario) {
        // Atualizar cenário existente
        await api.editScenario(existingScenario.id, scenarioData);
        alert(
          `Cenário atualizado com sucesso para ${city.name} - ${city.state}!`,
        );
      } else {
        // Criar novo cenário
        const newScenario = await api.createScenario(scenarioData);
        alert(`Cenário criado com sucesso para ${city.name} - ${city.state}!`);
        setExistingScenario(newScenario);
      }
    } catch (error) {
      console.error('Erro ao salvar cenário:', error);
      alert('Erro ao salvar o cenário. Tente novamente.');
    }
  };

  return (
    <div className="b-l b-r min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl border p-4 pt-24">
        <h1 className="text-gray-850 my-1 mb-10 text-center text-3xl">
          {'Cadastrar Cenário'}
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

          <div className="mb-6 ml-4 flex w-full gap-8">
            <div className="flex-1">
              <label
                htmlFor="cobrades"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                COBRADE
              </label>
              <Dropdown
                label="Selecione a COBRADE"
                items={cobrades.map(
                  (c) => `${c.code} - ${c.subType || c.type || c.subgroup}`,
                )}
                size="large"
                value={
                  cobrade
                    ? `${cobrade.code} - ${cobrade.subType || cobrade.type || cobrade.subgroup}`
                    : ''
                }
                onSelect={(desc) => {
                  const selectedCobrade =
                    cobrades.find(
                      (c) =>
                        `${c.code} - ${c.subType || c.type || c.subgroup}` ===
                        desc,
                    ) || null;
                  setCobrade(selectedCobrade);
                }}
                useAutoComplete
              />
            </div>
          </div>
        </div>

        <PlanStepsTabs
          steps={PLAN_STEPS}
          currentStep={currentStep}
          onChange={(newStep) => setCurrentStep(newStep)}
          size="md"
        />

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

        <ProtocolList
          protocols={protocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />

        <div className="mt-8 mr-4 flex items-center justify-end gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsTaskModalOpen(true)}
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

      <CreateTask
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditTask(null);
        }}
        onSave={(taskData) => {
          if (taskData.id) {
            // Editando tarefa existente
            setProtocols((prev) =>
              prev.map((p) =>
                p.id === taskData.id
                  ? {
                      ...p,
                      description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
                    }
                  : p,
              ),
            );
          } else {
            // Criando nova tarefa
            const newProtocol: Protocol = {
              id: Date.now().toString(),
              description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
            };
            setProtocols((prev) => [...prev, newProtocol]);
          }
        }}
        serviceNames={services.map((s) => s.name)}
        currentPhase={currentStep}
        editingTask={
          editTask
            ? {
                id: String(editTask.id),
                description: editTask.description.split(' (')[0], // Remove service e ano da description
                service:
                  editTask.description.match(/\(([^,]+),/)?.[1] || undefined,
              }
            : null
        }
      />
    </div>
  );
}
