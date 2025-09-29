'use client';

import { Button } from '@/components/Button';
import ProtocolList, { Protocol } from '@/components/ProtocolList';
import Header from '@/components/Header';
import { PlanStepsTabs } from '@/components/PlanStepsTabs';
import { Dropdown } from '@/components/Dropdown';
import { Plus, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  CobradeDTO,
  ScenarioRequestDTO,
  UserResponseDTO,
  ApiError,
} from '@/lib/types';
import { CreateUserTask } from './_components/CreateUserTask';
import { useProtectedPage } from '@/hooks/useProtectedPage';

const PLAN_STEPS = ['Antes', 'Durante', 'Depois'];

export default function CreateUserScenario() {
  const { userInfo, hasAccess } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  const [currentStep, setCurrentStep] = useState(PLAN_STEPS[0]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
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
        console.log('Buscando dados do usuário com ID do JWT:', userInfo.sub);

        const userData = await api.getUser(userInfo.sub);

        console.log(
          '✅ Dados do usuário obtidos com sucesso via /api/users/{id}:',
          {
            id: userData.id,
            email: userData.email,
            hasService: !!userData.service,
            hasCity: !!userData.city,
            accountStatus: userData.accountStatus,
          },
        );

        console.log('Dados do usuário recebidos com sucesso:', {
          id: userData.id,
          email: userData.email,
          hasService: !!userData.service,
          hasCity: !!userData.city,
          accountStatus: userData.accountStatus,
        });

        if (!userData.accountStatus) {
          setUserLoadingError(
            'Sua conta está inativa. Entre em contato com o administrador.',
          );
          setHasUserDataAccess(false);
          return;
        }

        // Validar se o usuário tem cidade e serviço configurados
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

        // Log detalhado do erro para debug
        console.error('Detalhes do erro:', {
          status: apiError?.status,
          message: apiError?.data,
          userJWT: {
            sub: userInfo.sub,
            email: userInfo.email,
            roles: userInfo.roles,
          },
        });

        // Tratar diferentes tipos de erro com mensagens específicas
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

  const handleEditProtocol = (protocolToEdit: Protocol) => {
    setEditTask(protocolToEdit);
    setIsTaskModalOpen(true);
  };

  const handleRemoveProtocol = (protocolToRemove: Protocol) => {
    setProtocols((prev) => prev.filter((p) => p.id !== protocolToRemove.id));
  };

  const handleSave = async () => {
    if (!cobrade) {
      alert('Por favor, selecione um tipo de emergência (COBRADE).');
      return;
    }

    if (!userDetails?.city) {
      alert('Erro: cidade do usuário não encontrada.');
      return;
    }

    if (!userDetails?.service) {
      alert(
        'Erro: você deve estar associado a um serviço para criar cenários.',
      );
      return;
    }

    // Validar se há pelo menos uma tarefa em alguma fase
    if (protocols.length === 0) {
      alert('Adicione pelo menos uma tarefa antes de salvar o cenário.');
      return;
    }

    try {
      // Preparar dados das tasks - todas com o serviço do usuário
      const tasks = protocols.map((protocol) => {
        const description = protocol.description.split(' (')[0];

        return {
          description,
          phase: mapStepToPhase(protocol.phase) || phaseMap[currentStep],
          serviceId: userDetails.service!.id, // Sempre o serviço do usuário
        };
      });

      const scenarioData: ScenarioRequestDTO = {
        description: `Plano de contingência para ${cobrade.subgroup || cobrade.type || 'emergências'}`,
        origin: `Plano criado por ${userDetails.service.name} para ${cobrade.subType || cobrade.type || 'emergências'} em ${userDetails.city.name}`,
        cityId: userDetails.city.id,
        cobradeId: cobrade.id,
        tasks,
        parameters: [], // Usuários não podem definir parâmetros
      };

      await api.createScenario(scenarioData);
      alert(
        `Cenário criado com sucesso para ${cobrade.subType || cobrade.type} em ${userDetails.city.name}!`,
      );

      // Limpar formulário após sucesso
      setProtocols([]);
      setCobrade(null);
      setCurrentStep(PLAN_STEPS[0]);
    } catch (error) {
      console.error('Erro ao salvar cenário:', error);
      alert('Erro ao salvar o cenário. Tente novamente.');
    }
  };

  // Mapeia label da tab para enum de fase
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

  // Protocolos filtrados pela fase atual
  const filteredProtocols = protocols
    .filter(
      (p) =>
        (mapStepToPhase(p.phase) || phaseMap[currentStep]) ===
        phaseMap[currentStep],
    )
    .filter((p) => mapStepToPhase(p.phase) === phaseMap[currentStep]);

  // Caso nenhum protocolo tenha fase (legado), mostra os da fase atual (após criação)
  const displayProtocols =
    filteredProtocols.length > 0
      ? filteredProtocols
      : protocols.filter((p) => !p.phase);

  // Verificação de acesso à página
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Verificando permissões de acesso...</div>
      </div>
    );
  }

  // Carregamento dos dados do usuário
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

  // Erro ao validar acesso aos dados do usuário
  if (userLoadingError || !hasUserDataAccess) {
    return (
      <div className="b-l b-r min-h-screen">
        <Header />
        <main className="mx-auto max-w-4xl border p-4 pt-24">
          <div className="text-center">
            <h1 className="text-gray-850 my-1 mb-10 text-3xl">
              Cadastrar Cenário
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
                <button
                  onClick={() => (window.location.href = '/user')}
                  className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Validação final - dados do usuário devem estar disponíveis
  if (!userDetails) {
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

  // Se usuário não tem serviço associado
  if (!userDetails.service) {
    return (
      <div className="b-l b-r min-h-screen">
        <Header />
        <main className="mx-auto max-w-4xl border p-4 pt-24">
          <div className="text-center">
            <h1 className="text-gray-850 my-1 mb-10 text-3xl">
              Cadastrar Cenário
            </h1>
            <div className="rounded-lg bg-yellow-50 p-6">
              <p className="text-yellow-800">
                Para criar cenários, você precisa estar associado a um serviço.
                Entre em contato com o administrador.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Se usuário não tem cidade associada
  if (!userDetails.city) {
    return (
      <div className="b-l b-r min-h-screen">
        <Header />
        <main className="mx-auto max-w-4xl border p-4 pt-24">
          <div className="text-center">
            <h1 className="text-gray-850 my-1 mb-10 text-3xl">
              Cadastrar Cenário
            </h1>
            <div className="rounded-lg bg-yellow-50 p-6">
              <p className="text-yellow-800">
                Para criar cenários, você precisa estar associado a uma cidade.
                Entre em contato com o administrador.
              </p>
            </div>
          </div>
        </main>
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

        <div className="mr-4 mb-6 ml-4 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">
                <strong>Como criar seu cenário:</strong> Selecione o tipo de
                emergência e organize as tarefas
              </p>
              <p className="mt-1 text-xs text-blue-700">
                1. Escolha o tipo de emergência (COBRADE) • 2. Organize tarefas
                por fases (Antes/Durante/Depois) • 3. Salve seu plano
              </p>
            </div>
          </div>
        </div>

        {/* Informações do usuário e seleção de emergência */}
        <div className="mr-4 mb-6 ml-4 grid gap-6 md:grid-cols-3">
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

          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Emergência *
              </label>
              <Dropdown
                label="Selecione o tipo de emergência"
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
              <p className="mt-1 text-xs text-gray-500">
                Obrigatório para classificar a emergência
              </p>
            </div>
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

      <CreateUserTask
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
                      phase: phaseMap[currentStep],
                    }
                  : p,
              ),
            );
          } else {
            // Criando nova tarefa
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
