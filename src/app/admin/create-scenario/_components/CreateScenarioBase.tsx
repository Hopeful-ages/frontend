'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import ProtocolList, { Protocol } from '@/components/ProtocolList';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Plus, Save } from 'lucide-react';
import { api } from '@/lib/api';
import {
  CobradeDTO,
  ServiceSummaryDTO,
  ScenarioResponseDTO,
  ScenarioRequestDTO,
  CityResponseDTO,
} from '@/lib/types';
import { CreateTask } from './CreateTask';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { Toaster } from '@/components/Toaster';

type Props = {
  scenarioId?: string;
};

const PLAN_STEPS = ['Antes', 'Durante', 'Depois'] as const;

const DEFAULT_PARAMS: Record<
  'ANTES' | 'DURANTE' | 'DEPOIS',
  { description: string; action: string }
> = {
  ANTES: { description: '', action: '' },
  DURANTE: { description: '', action: '' },
  DEPOIS: { description: '', action: '' },
};

export function CreateScenarioBase({ scenarioId }: Props) {
  const router = useRouter();
  const { success, error: toastError, warning } = useToast();

  const [currentStep, setCurrentStep] = useState<(typeof PLAN_STEPS)[number]>(
    PLAN_STEPS[0],
  );

  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [city, setCity] = useState<CityResponseDTO | null>(null);
  const [cobrades, setCobrades] = useState<CobradeDTO[]>([]);
  const [cobrade, setCobrade] = useState<CobradeDTO | null>(null);

  const [paramByPhase, setParamByPhase] =
    useState<typeof DEFAULT_PARAMS>(DEFAULT_PARAMS);

  const [services, setServices] = useState<ServiceSummaryDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Protocol | null>(null);
  const [existingScenario, setExistingScenario] =
    useState<ScenarioResponseDTO | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  const phaseMap: Record<string, 'ANTES' | 'DURANTE' | 'DEPOIS'> = useMemo(
    () => ({ Antes: 'ANTES', Durante: 'DURANTE', Depois: 'DEPOIS' }),
    [],
  );

  const mapStepToPhase = useCallback(
    (value?: string): 'ANTES' | 'DURANTE' | 'DEPOIS' | undefined => {
      if (!value) return undefined;
      const upper = value.toUpperCase();
      if (upper.includes('ANTES')) return 'ANTES';
      if (upper.includes('DURANTE')) return 'DURANTE';
      if (upper.includes('DEPOIS')) return 'DEPOIS';
      return undefined;
    },
    [],
  ); // carregar listas iniciais

  useEffect(() => {
    (async () => {
      try {
        const [citiesData, cobradesData, servicesData] = await Promise.all([
          api.getAllCities(),
          api.getAllCobrades(),
          api.getAllServices(),
        ]);
        setCities(citiesData);
        setCobrades(cobradesData);
        setServices(servicesData);
      } catch (err) {
        console.error(err);
        toastError('Erro ao carregar listas', 'Cidades, cobrade ou serviços');
      }
    })();
  }, [toastError]);

  const prefillFromScenario = useCallback(
    (scenario: ScenarioResponseDTO) => {
      setExistingScenario(scenario);

      setCity(scenario.city ?? null);
      setCobrade(scenario.cobrade ?? null);

      const tasksAsProtocols: Protocol[] = (scenario.tasks ?? []).map(
        (task) => {
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
        },
      );
      setProtocols(tasksAsProtocols);

      if (scenario.parameters?.length) {
        const next = { ...DEFAULT_PARAMS };
        scenario.parameters.forEach((p) => {
          const ph = mapStepToPhase(p.phase) ?? 'ANTES';
          next[ph] = {
            description: p.description ?? '',
            action: p.action ?? '',
          };
        });
        setParamByPhase(next);
      } else {
        setParamByPhase(DEFAULT_PARAMS);
      }
    },
    [mapStepToPhase],
  );

  useEffect(() => {
    if (!scenarioId) return;
    let aborted = false;

    (async () => {
      try {
        setLoadingScenario(true);
        const scenario = await api.getScenario(scenarioId);
        if (!aborted) prefillFromScenario(scenario);
      } catch (err) {
        console.error(err);
        if (!aborted) {
          toastError(
            'Erro ao carregar cenário',
            'ID inválido ou não encontrado',
          );
          setExistingScenario(null);
          setProtocols([]);
          setParamByPhase(DEFAULT_PARAMS);
        }
      } finally {
        if (!aborted) setLoadingScenario(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [scenarioId, prefillFromScenario, toastError]);

  useEffect(() => {
    if (scenarioId) return;
    const fetchExistingScenario = async () => {
      if (city?.id && cobrade?.id) {
        try {
          const scenario = await api.getScenarioByIdAndCobrade(
            city.id,
            cobrade.id,
          );
          prefillFromScenario(scenario);
        } catch {
          setExistingScenario(null);
          setProtocols([]);
          setParamByPhase(DEFAULT_PARAMS);
        }
      }
    };
    fetchExistingScenario();
  }, [city?.id, cobrade?.id, scenarioId, prefillFromScenario]);

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
      (p) =>
        (mapStepToPhase(p.phase) ?? phaseMap[currentStep]) ===
        phaseMap[currentStep],
    );

    if (currentPhaseProtocols.length === 0) {
      warning('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    try {
      const tasks = protocols.map((protocol) => {
        const description = protocol.description.split(' (')[0];

        const serviceMatch = protocol.description.match(/\(([^,]+),/);
        const serviceName = serviceMatch?.[1]?.trim();
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
          `Plano de contingência para ${
            cobrade.subgroup || cobrade.type || 'emergências'
          } em ${city.name}`,
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
      } else {
        const newScenario = await api.createScenario(scenarioData);
        success('Cenário criado com sucesso', `${city.name} - ${city.state}`);
        setExistingScenario(newScenario);
      }

      router.push('/admin/plans');
    } catch (error) {
      console.error('Erro ao salvar cenário:', error);
      toastError('Erro ao salvar o cenário', 'Tente novamente.');
    }
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
            <Header />     {' '}
      <main className="mx-auto max-w-4xl border p-4 pt-24">
               {' '}
        <h1 className="text-gray-850 my-1 mb-10 text-center text-3xl">
                    {scenarioId ? 'Editar Cenário' : 'Cadastrar Cenário'}     
           {' '}
        </h1>
               {' '}
        {loadingScenario ? (
          <div className="text-center text-gray-600">Carregando cenário…</div>
        ) : (
          <>
                       {' '}
            <div className="mb-6 ml-4 flex w-full gap-8">
                           {' '}
              <div className="flex-1">
                               {' '}
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
                             {' '}
              </div>
                           {' '}
              <div className="flex-1">
                               {' '}
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
                             {' '}
              </div>
                         {' '}
            </div>
                       {' '}
            <PlanStepsTabs
              steps={PLAN_STEPS as unknown as string[]}
              currentStep={currentStep}
              onChange={(newStep) =>
                setCurrentStep(newStep as (typeof PLAN_STEPS)[number])
              }
              size="md"
            />
                       {' '}
            <div className="mt-6 mr-4 mb-4 ml-4 flex items-start gap-4">
                           {' '}
              <label className="w-24 pt-2 text-lg font-medium">Parâmetro</label>
                           {' '}
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
                         {' '}
            </div>
                       {' '}
            <div className="mr-4 mb-4 ml-4 flex items-start gap-4">
                           {' '}
              <label className="w-24 pt-2 text-lg font-medium">Ação</label>
                           {' '}
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
                         {' '}
            </div>
            {/* INSERÇÃO DO TEXTO DE OBRIGATORIEDADE */}           {' '}
            <p className="mb-2 ml-4 text-sm font-semibold text-gray-500">
                            Obrigatório para adicionar tarefas ao cenário.      
                   {' '}
            </p>
                       {' '}
            <ProtocolList
              protocols={displayProtocols}
              onEdit={setEditTask}
              onRemove={(p) =>
                setProtocols((prev) => prev.filter((x) => x.id !== p.id))
              }
            />
                       {' '}
            <div className="mt-8 mr-4 flex items-center justify-end gap-4">
                           {' '}
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
                                Adicionar Tarefa              {' '}
              </Button>
                           {' '}
              <Button
                variant="secondary"
                size="md"
                onClick={handleSave}
                leftIcon={<Save size={16} />}
              >
                                Salvar              {' '}
              </Button>
                         {' '}
            </div>
                     {' '}
          </>
        )}
             {' '}
      </main>
           {' '}
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
            <Toaster />   {' '}
    </div>
  );
}
