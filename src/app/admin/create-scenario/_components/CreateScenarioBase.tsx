'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import ProtocolList, { Protocol } from '@/components/ProtocolList';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Plus, Save, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import {
  CobradeDTO,
  DepartmentSummaryDTO,
  ScenarioResponseDTO,
  ScenarioRequestDTO,
  CityResponseDTO,
} from '@/lib/types';
import { CreateTask } from './CreateTask';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { Toaster } from '@/components/Toaster';
import { ConfirmPublishModal } from '../../plans/_components/ConfirmPublishModal';

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

  const [departments, setDepartments] = useState<DepartmentSummaryDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Protocol | null>(null);
  const [existingScenario, setExistingScenario] =
    useState<ScenarioResponseDTO | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

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
  );

  useEffect(() => {
    (async () => {
      try {
        const [citiesData, cobradesData, departmentsData] = await Promise.all([
          api.getAllCities(),
          api.getAllCobrades(),
          api.getAllDepartments(),
        ]);
        setCities(citiesData);
        setCobrades(cobradesData);
        setDepartments(departmentsData);
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
            id: String(task.id),
            description: `${task.description} (${task.department?.name || 'Sem serviço'}, ${lastUpdateYear})`,
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

    (async () => {
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
    })();
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

    // Validação: deve ter pelo menos uma tarefa em qualquer fase
    if (protocols.length === 0) {
      warning('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    const currentPhaseProtocols = protocols.filter(
      (p) =>
        (mapStepToPhase(p.phase) ?? phaseMap[currentStep]) ===
        phaseMap[currentStep],
    );

    if (currentPhaseProtocols.length === 0) {
      warning(
        `Adicione pelo menos uma tarefa na fase "${currentStep}" antes de salvar o cenário.`,
      );
      return;
    }

    try {
      const tasks = protocols.map((protocol) => {
        const description = protocol.description.split(' (')[0];

        const serviceMatch = protocol.description.match(/\(([^,]+),/);
        const serviceName = serviceMatch?.[1]?.trim();
        const service = departments.find((d) => d.name === serviceName);

        return {
          description,
          phase: mapStepToPhase(protocol.phase) || phaseMap[currentStep],
          departmentId: service?.id || null,
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
        published: existingScenario?.published,
      };

      if (existingScenario) {
        await api.updateScenario(existingScenario.id, scenarioData);
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

  const handlePublish = async () => {
    if (!existingScenario) return;
    setPublishLoading(true);
    try {
      const updated = await api.togglePublishScenario(existingScenario.id);
      const action = updated.published ? 'publicado' : 'despublicado';
      success(
        `Plano "${updated.city.name} - ${updated.cobrade.code}" ${action} com sucesso!`,
      );
      setPublishModalOpen(false);

      setExistingScenario((prev) =>
        prev ? { ...prev, published: updated.published } : prev,
      );
    } catch (err) {
      console.error(err);
      toastError('Erro ao alterar status de publicação', 'Tente novamente.');
    } finally {
      setPublishLoading(false);
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
    <div className="b-l b-r">
      <main className="mx-auto mb-10 max-w-4xl flex-1 border p-4 pt-24 md:px-8 md:pb-8">
        <h1 className="text-gray-850 my-1 mb-6 text-center text-3xl">
          {scenarioId ? 'Editar Cenário' : 'Cadastrar Cenário'}
        </h1>

        {loadingScenario ? (
          <div className="text-center text-gray-600">Carregando cenário…</div>
        ) : (
          <>
            <div className="flex w-full flex-col gap-8 p-4 md:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <Dropdown
                  label="Selecione uma Cidade"
                  items={cities.map((c) => `${c.name} - ${c.state}`)}
                  size="large"
                  fullWidth
                  value={city ? `${city.name} - ${city.state}` : null}
                  onSelect={async (cityString) => {
                    const cityName = cityString.split(' - ')[0];
                    const selectedCity =
                      cities.find((c) => c.name === cityName) || null;
                    setCity(selectedCity);
                    if (selectedCity && cobrade) {
                      try {
                        const scenario = await api.getScenarioByIdAndCobrade(
                          selectedCity.id,
                          cobrade.id,
                        );
                        prefillFromScenario(scenario);
                      } catch {
                        setExistingScenario(null);
                        setProtocols([]);
                        setParamByPhase(DEFAULT_PARAMS);
                      }
                    } else {
                      setExistingScenario(null);
                      setProtocols([]);
                      setParamByPhase(DEFAULT_PARAMS);
                    }
                  }}
                  useAutoComplete
                />
                <p className="mt-1 text-xs text-gray-500">
                  Obrigatório selecionar uma cidade
                </p>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  COBRADE
                </label>
                <Dropdown
                  label="Selecione o tipo de Cenário (COBRADE)"
                  items={cobrades.map(
                    (c) => `${c.code} - ${c.subType || c.type || c.subgroup}`,
                  )}
                  size="large"
                  fullWidth
                  value={
                    cobrade
                      ? `${cobrade.code} - ${cobrade.subType || cobrade.type || cobrade.subgroup}`
                      : null
                  }
                  onSelect={async (desc) => {
                    const selectedCobrade =
                      cobrades.find(
                        (c) =>
                          `${c.code} - ${c.subType || c.type || c.subgroup}` ===
                          desc,
                      ) || null;
                    setCobrade(selectedCobrade);
                    if (city && selectedCobrade) {
                      try {
                        const scenario = await api.getScenarioByIdAndCobrade(
                          city.id,
                          selectedCobrade.id,
                        );
                        prefillFromScenario(scenario);
                      } catch {
                        setExistingScenario(null);
                        setProtocols([]);
                        setParamByPhase(DEFAULT_PARAMS);
                      }
                    } else {
                      setExistingScenario(null);
                      setProtocols([]);
                      setParamByPhase(DEFAULT_PARAMS);
                    }
                  }}
                  useAutoComplete
                />
                <p className="mt-1 text-xs text-gray-500">
                  Obrigatório para visualizar ou adicionar tarefas ao cenário
                </p>
              </div>
            </div>

            <PlanStepsTabs
              steps={PLAN_STEPS as unknown as string[]}
              currentStep={currentStep}
              onChange={(newStep) =>
                setCurrentStep(newStep as (typeof PLAN_STEPS)[number])
              }
              size="md"
            />

            <div className="mx-4 mt-6 mb-4 flex flex-col items-start gap-4 md:flex-row">
              <label className="w-full pt-2 text-lg font-medium md:w-24">
                Parâmetro
              </label>
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

            <div className="mx-4 mb-4 flex flex-col items-start gap-4 md:flex-row">
              <label className="w-full pt-2 text-lg font-medium md:w-24">
                Ação
              </label>
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
              onEdit={(p) => {
                setEditTask({ ...p, id: String(p.id) });
                setIsTaskModalOpen(true);
              }}
              onRemove={(p) =>
                setProtocols((prev) => prev.filter((x) => x.id !== p.id))
              }
            />

            <div className="mx-4 mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
              {scenarioId ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setPublishModalOpen(true)}
                  leftIcon={<Upload size={16} />}
                  className="w-full disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                  disabled={!!existingScenario?.published}
                  title={
                    existingScenario?.published
                      ? 'Cenário já publicado'
                      : 'Publicar cenário'
                  }
                >
                  {existingScenario?.published ? 'Publicado' : 'Publicar'}
                </Button>
              ) : (
                <div className="hidden w-[130px] md:block" />
              )}

              <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
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
            </div>
          </>
        )}
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
                String(p.id) === String(taskData.id)
                  ? {
                      ...p,
                      description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
                      phase: p.phase || phaseMap[currentStep],
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
        serviceNames={departments.map((s) => s.name)}
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

      <ConfirmPublishModal
        open={isPublishModalOpen}
        loading={publishLoading}
        scenario={existingScenario}
        onConfirm={handlePublish}
        onClose={() => setPublishModalOpen(false)}
      />

      <Toaster />
    </div>
  );
}
