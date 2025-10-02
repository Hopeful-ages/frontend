'use client';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import ProtocolList, { Protocol } from '@/components/ProtocolList';
import { Toaster } from '@/components/Toaster';
import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import {
  ApiError,
  CobradeDTO,
  ScenarioRequestDTO,
  TaskSummaryDTO,
  UserResponseDTO,
} from '@/lib/types';
import { Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateUserTask } from './_components/CreateUserTask';

const PLAN_STEPS = ['Antes', 'Durante', 'Depois'];

export default function UserPage() {
  const { success, error: toastError, warning, info } = useToast();
  const { userInfo, hasAccess } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  const [currentStep, setCurrentStep] = useState(PLAN_STEPS[0]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [existingTasks, setExistingTasks] = useState<TaskSummaryDTO[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(
    null,
  );
  const [cobrades, setCobrades] = useState<CobradeDTO[]>([]);
  const [cobrade, setCobrade] = useState<CobradeDTO | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Protocol | null>(null);
  const [userDetails, setUserDetails] = useState<UserResponseDTO | null>(null);
  const [userLoadingError, setUserLoadingError] = useState<string | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [hasUserDataAccess, setHasUserDataAccess] = useState(false);

  useEffect(() => {
    const validateUserAccess = async () => {
      if (!userInfo?.sub) {
        setIsLoadingUserData(false);
        return;
      }

      setIsLoadingUserData(true);
      setUserLoadingError(null);

      try {
        const userData = await api.getUser(userInfo.sub);

        if (!userData.accountStatus) {
          setUserLoadingError(
            'Sua conta está inativa. Entre em contato com o administrador.',
          );
          setHasUserDataAccess(false);
          return;
        }

        if (!userData.city) {
          setUserLoadingError(
            'Sua conta não tem uma cidade associada. Entre em contato com o administrador para configurar sua cidade.',
          );
          setHasUserDataAccess(false);
          return;
        }

        if (!userData.service) {
          setUserLoadingError(
            'Sua conta não tem um serviço associado. Entre em contato com o administrador para configurar seu serviço.',
          );
          setHasUserDataAccess(false);
          return;
        }

        setUserDetails(userData);
        setHasUserDataAccess(true);
        setUserLoadingError(null);
      } catch (error) {
        console.error('❌ Erro ao buscar dados do usuário:', error);

        const apiError = error as ApiError;
        setHasUserDataAccess(false);

        if (apiError?.status === 404) {
          setUserLoadingError(
            `Usuário com ID "${userInfo.sub}" não foi encontrado no sistema. Verifique se sua conta foi criada pelo administrador.`,
          );
        } else if (apiError?.status === 401) {
          setUserLoadingError(
            'Sua sessão expirou ou o token JWT é inválido. Faça login novamente.',
          );
        } else if (apiError?.status === 403) {
          setUserLoadingError(
            `Acesso negado ao buscar usuário "${userInfo.sub}". Isso pode acontecer se você não tem permissão para acessar dados de usuário ou se há uma configuração incorreta no backend.`,
          );
        } else if (apiError?.status >= 500) {
          setUserLoadingError(
            'Erro interno do servidor. Tente novamente em alguns minutos.',
          );
        } else {
          setUserLoadingError(
            `Erro desconhecido (${apiError?.status || 'sem código'}): ${JSON.stringify(apiError?.data) || 'Verifique sua conexão com a internet'}.`,
          );
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    if (userInfo && hasAccess) {
      validateUserAccess();
    }
  }, [userInfo, hasAccess]);

  // Buscar COBRADEs disponíveis
  useEffect(() => {
    const fetchCobrades = async () => {
      try {
        const data = await api.getAllCobrades();
        setCobrades(data);
      } catch (err) {
        console.error('Erro ao buscar COBRADES', err);
      }
    };

    fetchCobrades();
  }, []);

  // Buscar tasks existentes quando COBRADE é selecionado
  useEffect(() => {
    const fetchExistingTasks = async () => {
      if (!cobrade || !userDetails?.city) {
        setExistingTasks([]);
        return;
      }

      try {
        const scenario = await api.getScenarioByIdAndCobrade(
          userDetails.city.id,
          cobrade.id,
        );
        if (scenario) {
          setCurrentScenarioId(scenario.id);
          if (scenario.tasks) {
            setExistingTasks(scenario.tasks);
          } else {
            setExistingTasks([]);
          }
        } else {
          setCurrentScenarioId(null);
          setExistingTasks([]);
        }
      } catch {
        console.log('Nenhum cenário existente encontrado para esta COBRADE');
        setCurrentScenarioId(null);
        setExistingTasks([]);
      }
    };

    if (userDetails && cobrade) {
      fetchExistingTasks();
    }
  }, [cobrade, userDetails]);

  const handleEditProtocol = (protocolToEdit: Protocol) => {
    // Verificar se pode editar (apenas tasks do próprio serviço ou criadas localmente)
    if (protocolToEdit.isExisting && !protocolToEdit.canEdit) {
      warning('Você só pode editar tasks criadas pelo seu serviço.');
      return;
    }

    setEditTask(protocolToEdit);
    setIsTaskModalOpen(true);
  };

  const handleRemoveProtocol = (protocolToRemove: Protocol) => {
    // Verificar se pode remover (apenas tasks do próprio serviço ou criadas localmente)
    if (protocolToRemove.isExisting && !protocolToRemove.canEdit) {
      warning('Você só pode remover tasks criadas pelo seu serviço.');
      return;
    }

    if (protocolToRemove.isExisting) {
      // Para tasks existentes do servidor, remover da lista de existentes
      setExistingTasks((prev) =>
        prev.filter((t) => t.id !== protocolToRemove.id),
      );
    } else {
      // Para tasks criadas localmente, remover da lista de protocolos
      setProtocols((prev) => prev.filter((p) => p.id !== protocolToRemove.id));
    }
  };

  const handleSave = async () => {
    if (!cobrade) {
      warning('Por favor, selecione um tipo de emergência (COBRADE).');
      return;
    }

    if (!userDetails?.city) {
      toastError('Erro ao salvar', 'Cidade do usuário não encontrada.');
      return;
    }

    if (!userDetails?.service) {
      toastError(
        'Erro: Serviço não associado',
        'Associe-se a um serviço para criar cenários.',
      );
      return;
    }

    // Verificar se há pelo menos uma task (local ou existente)
    const localTasks = protocols.filter((p) => !p.isExisting);

    if (localTasks.length === 0 && existingTasks.length === 0) {
      warning('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    try {
      // Converter tasks locais (novas)
      const newTasks = localTasks.map((protocol) => {
        const description = protocol.description.split(' (')[0];

        return {
          description,
          phase: mapStepToPhase(protocol.phase) || phaseMap[currentStep],
          serviceId: userDetails.service!.id,
        };
      });

      // Preservar tasks existentes (somente leitura para backend: enviamos novamente para não perder)
      const existingTasksPayload = existingTasks
        .filter((t) => t.id) // garantir
        .map((t) => ({
          description: t.description,
          phase: mapStepToPhase(t.phase) || phaseMap[currentStep],
          serviceId: t.service?.id || userDetails.service!.id,
        }));

      const baseScenarioData: ScenarioRequestDTO = {
        description: `Plano de contingência para ${cobrade.subgroup || cobrade.type || 'emergências'}`,
        origin: `Plano criado por ${userDetails.service.name} para ${cobrade.subType || cobrade.type || 'emergências'} em ${userDetails.city.name}`,
        cityId: userDetails.city.id,
        cobradeId: cobrade.id,
        tasks:
          newTasks.length > 0 || existingTasksPayload.length > 0
            ? [...existingTasksPayload, ...newTasks]
            : undefined,
        parameters: [],
      };

      if (currentScenarioId) {
        // UPDATE (user scope) - enviar conjunto completo (existentes + novas) para não sobrescrever
        if (newTasks.length === 0) {
          await api.updateScenario(currentScenarioId, baseScenarioData);
          info('Nenhuma nova tarefa', 'Cenário mantido sem adições.');
        } else {
          await api.updateScenario(currentScenarioId, baseScenarioData);
          success(
            'Cenário atualizado',
            `${newTasks.length} nova(s) tarefa(s).`,
          );
        }
      } else {
        // CREATE
        await api.createScenario({ ...baseScenarioData, tasks: [...newTasks] });
        success(
          'Cenário criado',
          `${newTasks.length} tarefa(s) adicionada(s) para ${cobrade.subType || cobrade.type} em ${userDetails.city.name}`,
        );
      }

      // Limpar apenas as tasks locais, manter COBRADE selecionado para ver tasks existentes
      setProtocols([]);
      // Recarregar tasks existentes e cenário
      if (cobrade && userDetails?.city) {
        try {
          const scenario = await api.getScenarioByIdAndCobrade(
            userDetails.city.id,
            cobrade.id,
          );
          if (scenario) {
            setCurrentScenarioId(scenario.id);
            if (scenario.tasks) setExistingTasks(scenario.tasks);
          }
        } catch {}
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

  const allTasks = [
    ...existingTasks.map((task): Protocol => {
      const lastUpdateYear = task.lastUpdateDate
        ? new Date(task.lastUpdateDate).getFullYear()
        : new Date().getFullYear();

      return {
        id: task.id,
        description: `${task.description} (${task.service?.name || 'Sem serviço'}, ${lastUpdateYear})`,
        phase: task.phase,
        isExisting: true,
        canEdit: task.service?.id === userDetails?.service?.id,
      };
    }),
    ...protocols.map(
      (p): Protocol => ({ ...p, isExisting: false, canEdit: true }),
    ),
  ];

  const filteredProtocols = allTasks.filter(
    (p) =>
      (mapStepToPhase(p.phase) || phaseMap[currentStep]) ===
      phaseMap[currentStep],
  );

  const displayProtocols =
    filteredProtocols.length > 0
      ? filteredProtocols
      : allTasks.filter((p) => !p.phase);

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Verificando permissões de acesso...</div>
      </div>
    );
  }

  if (isLoadingUserData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-lg">
            Validando acesso às suas informações...
          </div>
          <div className="text-sm text-gray-600">
            Verificando perfil e permissões
          </div>
        </div>
      </div>
    );
  }

  if (userLoadingError || !hasUserDataAccess) {
    return (
      <div className="b-l b-r min-h-screen">
        <Header />
        <main className="mx-auto max-w-4xl border p-4 pt-24">
          <div className="text-center">
            <h1 className="text-gray-850 my-1 mb-10 text-3xl">
              Criar Cenário de Contingência
            </h1>
            <div className="rounded-lg bg-red-50 p-6">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-red-800">
                Problema de Acesso
              </h3>
              <p className="mb-4 text-red-700">{userLoadingError}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!userDetails || !userDetails.city || !userDetails.service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-lg text-red-600">Erro inesperado</div>
          <div className="text-sm text-gray-600">
            Dados do usuário não disponíveis
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="b-l b-r min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl border p-4 pt-24">
        <h1 className="text-gray-850 my-1 mb-6 text-center text-3xl">
          Criar Cenário de Contingência
        </h1>

        {/* Informações do usuário */}
        <div className="mr-4 mb-4 ml-4 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                {userDetails.city.name} - {userDetails.city.state}
              </div>
              <p className="mt-1 text-xs text-gray-500">Sua cidade atual</p>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Seu Serviço
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                {userDetails.service.name}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Todas as tarefas serão associadas ao seu serviço
              </p>
            </div>
          </div>
        </div>

        <div className="mr-4 mb-6 ml-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              COBRADE *
            </label>
            <div className="relative">
              <Dropdown
                label="Selecione o tipo de Cenário (COBRADE)"
                items={cobrades.map(
                  (c) => `${c.code} - ${c.subType || c.type || c.subgroup}`,
                )}
                size="large"
                fullWidth={true}
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
            <p className="mt-1 text-xs text-gray-500">
              Obrigatório para adicionar tarefas ao cenário
            </p>
          </div>
        </div>

        <PlanStepsTabs
          steps={PLAN_STEPS}
          currentStep={currentStep}
          onChange={(newStep) => setCurrentStep(newStep)}
          size="md"
        />

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
            disabled={!cobrade || !userDetails?.city || !userDetails?.service}
            title={
              !cobrade
                ? 'Selecione um COBRADE primeiro'
                : !userDetails?.city || !userDetails?.service
                  ? 'Dados de cidade/serviço indisponíveis'
                  : undefined
            }
          >
            Adicionar Ação
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
      <Toaster />

      <CreateUserTask
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditTask(null);
        }}
        onSave={(taskData) => {
          if (taskData.id) {
            // Se a edição é de uma task existente do servidor, refletir apenas visualmente (não perdemos o id)
            const isExistingTask = existingTasks.some(
              (t) => t.id === taskData.id,
            );
            if (isExistingTask) {
              // Atualiza em existingTasks para que próxima montagem do payload inclua descrição atualizada
              setExistingTasks((prev) =>
                prev.map((t) =>
                  t.id === taskData.id
                    ? {
                        ...t,
                        description: taskData.description,
                        phase: phaseMap[currentStep],
                        service: t.service, // mantém service original
                      }
                    : t,
                ),
              );
            } else {
              // Task local
              setProtocols((prev) =>
                prev.map((p) =>
                  p.id === taskData.id
                    ? {
                        ...p,
                        description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
                        phase: phaseMap[currentStep],
                      }
                    : p,
                ),
              );
            }
          } else {
            const newProtocol: Protocol = {
              id: Date.now().toString(),
              description: `${taskData.description} (${taskData.service}, ${new Date().getFullYear()})`,
              phase: phaseMap[currentStep],
            };
            setProtocols((prev) => [...prev, newProtocol]);
          }
        }}
        userServiceName={userDetails.service.name}
        currentPhase={currentStep}
        editingTask={
          editTask
            ? {
                id: String(editTask.id),
                description: editTask.description.split(' (')[0],
              }
            : null
        }
      />
    </div>
  );
}
