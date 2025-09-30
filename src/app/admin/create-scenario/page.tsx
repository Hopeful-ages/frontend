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
import { useToast } from '@/hooks/useToast';
import { Toaster } from '@/components/Toaster';
import { useRouter } from 'next/navigation';
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
  const { success, error: toastError, warning } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(PLAN_STEPS[0]);

  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [city, setCity] = useState<CityResponseDTO | null>(null);
  const [cobrades, setCobrades] = useState<CobradeDTO[]>([]);
  const [cobrade, setCobrade] = useState<CobradeDTO | null>(null);

  const [paramByPhase, setParamByPhase] = useState<
    Record<
      'ANTES' | 'DURANTE' | 'DEPOIS',
      { description: string; action: string }
    >
  >({
    ANTES: { description: '', action: '' },
    DURANTE: { description: '', action: '' },
    DEPOIS: { description: '', action: '' },
  });
  const [services, setServices] = useState<ServiceSummaryDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Protocol | null>(null);
  const [existingScenario, setExistingScenario] =
    useState<ScenarioResponseDTO | null>(null);

  useEffect(() => {
    const fetchExistingScenario = async () => {
      if (city && cobrade) {
        try {
          const scenario = await api.getScenarioByIdAndCobrade(
            city.id,
            cobrade.id,
          );
          setExistingScenario(scenario);

          const tasksAsProtocols: Protocol[] = scenario.tasks.map((task) => {
            const lastUpdateYear = task.lastUpdateDate
              ? new Date(task.lastUpdateDate).getFullYear()
              : new Date().getFullYear();

            return {
              id: task.id,
              description: `${task.description} (${task.service?.name || 'Sem serviço'}, ${lastUpdateYear})`,
              phase: task.phase,
              isExisting: true,
              canEdit: true,
            };
          });

          setProtocols(tasksAsProtocols);

          if (scenario.parameters.length > 0) {
            setParamByPhase((prev) => {
              const clone = { ...prev };
              scenario.parameters.forEach((p) => {
                const phase = p.phase as 'ANTES' | 'DURANTE' | 'DEPOIS';
                clone[phase] = { description: p.description, action: p.action };
              });
              return clone;
            });
          } else {
            setParamByPhase({
              ANTES: { description: '', action: '' },
              DURANTE: { description: '', action: '' },
              DEPOIS: { description: '', action: '' },
            });
          }
        } catch {
          console.log(
            'Nenhum cenário encontrado para esta combinação cidade/COBRADE',
          );

          setExistingScenario(null);
          setProtocols([]);
          setParamByPhase({
            ANTES: { description: '', action: '' },
            DURANTE: { description: '', action: '' },
            DEPOIS: { description: '', action: '' },
          });
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
    setProtocols((prev) => prev.filter((p) => p.id !== protocolToRemove.id));
  };

  const handleSave = async () => {
    if (!cobrade) {
      warning('Por favor, selecione um COBRADE.');
      return;
    }

    if (!city) {
      warning('Por favor, selecione uma cidade.');
      return;
    }

    const currentPhaseProtocols = protocols.filter(
      (p) => mapStepToPhase(p.phase) === phaseMap[currentStep],
    );

    if (currentPhaseProtocols.length === 0) {
      warning('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    try {
      const tasks = protocols.map((protocol) => {
        const description = protocol.description.split(' (')[0];

        const serviceMatch = protocol.description.match(/\(([^,]+),/);
        const serviceName = serviceMatch?.[1];
        const service = services.find((s) => s.name === serviceName);

        return {
          description,

          phase: mapStepToPhase(protocol.phase) || phaseMap[currentStep],
          serviceId: service?.id || null,
        };
      });

      const parameters: ScenarioRequestDTO['parameters'] = Object.entries(
        paramByPhase,
      ).flatMap(([phase, value]) =>
        value.description.trim() && value.action.trim()
          ? [
              {
                description: value.description.trim(),
                action: value.action.trim(),
                phase: phase as 'ANTES' | 'DURANTE' | 'DEPOIS',
              },
            ]
          : [],
      );

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
        await api.editScenario(existingScenario.id, scenarioData);
        success(
          'Cenário atualizado com sucesso',
          `${city.name} - ${city.state}`,
        );
        router.push('/admin/plans');
      } else {
        const newScenario = await api.createScenario(scenarioData);
        success('Cenário criado com sucesso', `${city.name} - ${city.state}`);
        setExistingScenario(newScenario);
        router.push('/admin/plans');
      }
    } catch (error) {
      console.error('Erro ao salvar cenário:', error);
      toastError('Erro ao salvar o cenário', 'Tente novamente.');
    }
  };

  const phaseMap: Record<string, 'ANTES' | 'DURANTE' | 'DEPOIS'> = {
    Antes: 'ANTES',
    Durante: 'DURANTE',
    Depois: 'DEPOIS',
  };

  const mapStepToPhase = (
    value?: string,
  ): 'ANTES' | 'DURANTE' | 'DEPOIS' | undefined => {
    if (!value) return undefined;
    const upper = value.toUpperCase();
    if (upper.includes('ANTES')) return 'ANTES';
    if (upper.includes('DURANTE')) return 'DURANTE';
    if (upper.includes('DEPOIS')) return 'DEPOIS';
    return undefined;
  };

  const filteredProtocols = protocols
    .filter(
      (p) =>
        (mapStepToPhase(p.phase) || phaseMap[currentStep]) ===
        phaseMap[currentStep],
    )
    .filter((p) => mapStepToPhase(p.phase) === phaseMap[currentStep]);

  const displayProtocols =
    filteredProtocols.length > 0
      ? filteredProtocols
      : protocols.filter((p) => !p.phase);

  return (
    <div className="b-l b-r min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl border p-4 pt-24">
        <h1 className="text-gray-850 my-1 mb-10 text-center text-3xl">
          {'Cadastrar Cenário'}
        </h1>

        <div className="mb-6 ml-4 flex w-full gap-8">
          <div className="flex-1">
            <Dropdown
              label="Cidade"
              items={cities.map((c) => `${c.name} - ${c.state}`)}
              size="large"
              value={city ? `${city.name} - ${city.state}` : null}
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
              <Dropdown
                label="Cobrade"
                items={cobrades.map(
                  (c) => `${c.code} - ${c.subType || c.type || c.subgroup}`,
                )}
                size="large"
                value={
                  cobrade
                    ? `${cobrade.code} - ${cobrade.subType || cobrade.type || cobrade.subgroup}`
                    : null
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

        <div className="mt-6 mr-4 mb-4 ml-4 flex items-start gap-4">
          <label className="w-24 pt-2 text-lg font-medium">Parâmetro</label>
          <Input
            name="parameter"
            placeholder={`Parâmetro - ${currentStep}`}
            value={paramByPhase[phaseMap[currentStep]].description}
            onChange={(e) =>
              setParamByPhase((prev) => ({
                ...prev,
                [phaseMap[currentStep]]: {
                  ...prev[phaseMap[currentStep]],
                  description: e.target.value,
                },
              }))
            }
            className="flex-1"
          />
        </div>

        <div className="mr-4 mb-4 ml-4 flex items-start gap-4">
          <label className="w-24 pt-2 text-lg font-medium">Ação</label>
          <Input
            name="action"
            placeholder={`Ação - ${currentStep}`}
            className="flex-1"
            value={paramByPhase[phaseMap[currentStep]].action}
            onChange={(e) =>
              setParamByPhase((prev) => ({
                ...prev,
                [phaseMap[currentStep]]: {
                  ...prev[phaseMap[currentStep]],
                  action: e.target.value,
                },
              }))
            }
          />
        </div>

        <ProtocolList
          protocols={displayProtocols}
          onEdit={handleEditProtocol}
          onRemove={handleRemoveProtocol}
        />

        <div className="mt-8 mr-4 flex items-center justify-end gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTaskModalOpen(true)}
            leftIcon={<Plus size={16} />}
            disabled={!city || !cobrade}
            title={
              !city || !cobrade
                ? 'Selecione Cidade e COBRADE primeiro'
                : undefined
            }
          >
            Adicionar Tarefa
          </Button>

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

      <CreateTask
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditTask(null);
        }}
        onSave={(taskData) => {
          if (taskData.id) {
            setProtocols((prev) =>
              prev.map((p) =>
                p.id === taskData.id
                  ? {
                      ...p,
                      description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
                      phase: phaseMap[currentStep],

                      isExisting: p.isExisting,
                      canEdit: p.canEdit,
                    }
                  : p,
              ),
            );
          } else {
            const newProtocol: Protocol = {
              id: Date.now().toString(),
              description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
              phase: phaseMap[currentStep],
              isExisting: false,
              canEdit: true,
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
                description: editTask.description.split(' (')[0],
                service:
                  editTask.description.match(/\(([^,]+),/)?.[1] || undefined,
              }
            : null
        }
      />
      <Toaster />
    </div>
  );
}
