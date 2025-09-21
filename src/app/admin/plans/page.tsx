'use client';

import { api } from '@/lib/api';
import {
  CityResponseDTO,
  PlanResponseDTO,
  PlanUpdateDTO,
  ServiceResponseDTO,
} from '@/lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { ConfirmDownloadModal } from './_components/ConfirmDownloadModal';
import { FiltersBar } from './_components/FiltersBar';
import { PlanFormModal, PlanFormState } from './_components/PlanFormModal';
import { PlansTable } from './_components/PlansTable';

// Tipos específicos para o formulário de Planos
type Field = 'cityId' | 'serviceId' | 'cobrade';
type Errors = Partial<Record<Field, string>>;

export default function AdminPlansPage() {
  // --- Estados de Dados e UI ---
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanResponseDTO[]>([]);
  const [services, setServices] = useState<ServiceResponseDTO[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);

  // --- Estados de Filtros ---
  const [pendingCityFilter, setPendingCityFilter] = useState<string | null>(
    null,
  );
  const [pendingServiceFilter, setPendingServiceFilter] = useState<
    string | null
  >(null);
  const [pendingCobradeFilter, setPendingCobradeFilter] = useState<
    string | null
  >(null);

  // --- Estados para os filtros APLICADOS (após clicar em "Buscar") ---
  const [appliedCityFilter, setAppliedCityFilter] = useState<string | null>(
    null,
  );
  const [appliedServiceFilter, setAppliedServiceFilter] = useState<
    string | null
  >(null);
  const [appliedCobradeFilter, setAppliedCobradeFilter] = useState<
    string | null
  >(null);

  // --- Estados do Modal de Formulário (Criar/Editar) ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- Estados do Modal de Confirmação (Download) ---
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [planForDownload, setPlanForDownload] =
    useState<PlanResponseDTO | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // --- Hooks Customizados ---
  const { success, error, warning } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const loadingShown = useRef(false);
  const { isLoading: isAuthLoading } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  // --- Estados do Formulário ---
  const [form, setForm] = useState<PlanFormState>({
    cityId: '',
    serviceId: '',
    cobrade: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  // --- Dados Derivados para UI ---
  const serviceNames = services.map((s) => s.name);
  const cityNames = cities.map((c) => c.name);
  const cobradeOptions = useMemo(() => {
    // Extrai opções únicas de Cobrade a partir dos planos existentes
    const uniqueCobrades = new Set(plans.map((p) => p.cobrade));
    return Array.from(uniqueCobrades);
  }, [plans]);

  // Função para lidar com o clique no botão "Buscar"
  const handleSearch = () => {
    setAppliedCityFilter(pendingCityFilter);
    setAppliedServiceFilter(pendingServiceFilter);
    setAppliedCobradeFilter(pendingCobradeFilter);
  };

  // --- Efeito para Loading de Autenticação ---
  useEffect(() => {
    if (isAuthLoading) {
      if (!loadingShown.current) {
        showLoading('Verificando autenticação...');
        loadingShown.current = true;
      }
    } else {
      hideLoading();
    }
  }, [isAuthLoading, showLoading, hideLoading]);

  // --- Funções Auxiliares para o Formulário ---
  const serviceNameById = (id: string) =>
    services.find((s) => s.id === id)?.name ?? null;
  const cityNameById = (id: string) =>
    cities.find((c) => c.id === id)?.name ?? null;

  const setServiceByName = (name: string) => {
    const id = services.find((s) => s.name === name)?.id ?? '';
    onUpdate('serviceId', id);
  };

  const setCityByName = (name: string) => {
    const id = cities.find((c) => c.name === name)?.id ?? '';
    onUpdate('cityId', id);
  };

  // --- Lógica de Validação ---
  function validateField(field: Field, value: string): string {
    switch (field) {
      case 'cityId':
        return value ? '' : 'Selecione uma cidade';
      case 'serviceId':
        return value ? '' : 'Selecione um serviço';
      case 'cobrade':
        return value.trim() ? '' : 'O campo Cobrade é obrigatório';
      default:
        return '';
    }
  }

  function validateOnSubmit(): boolean {
    const next: Errors = {
      cityId: validateField('cityId', form.cityId),
      serviceId: validateField('serviceId', form.serviceId),
      cobrade: validateField('cobrade', form.cobrade),
    };
    setErrors(next);
    const ok = Object.values(next).every((v) => !v);
    if (!ok) {
      warning('Corrija os campos destacados!');
    }
    return ok;
  }

  const canClickSave =
    !!form.cityId && !!form.serviceId && !!form.cobrade.trim();

  // --- Efeito para Busca Inicial de Dados ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [fetchedPlans, fetchedServices, fetchedCities] =
          await Promise.all([
            api.getPlans(),
            api.getAllServices(),
            api.getAllCities(),
          ]);
        if (!mounted) return;
        setPlans(fetchedPlans);
        setServices(fetchedServices);
        setCities(fetchedCities);
      } catch (e) {
        console.error(e);
        error('Falha ao carregar dados da página');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [error]);

  // --- Lógica de Filtragem ---
  const filteredPlans = useMemo(() => {
    // Se nenhum filtro foi aplicado ainda, retorna todos os planos
    if (!appliedCityFilter && !appliedServiceFilter && !appliedCobradeFilter) {
      return plans;
    }
    return plans.filter((p) => {
      const byCity = appliedCityFilter
        ? (p.city?.name ?? '').toLowerCase() === appliedCityFilter.toLowerCase()
        : true;
      const byService = appliedServiceFilter
        ? (p.service?.name ?? '').toLowerCase() ===
          appliedServiceFilter.toLowerCase()
        : true;
      const byCobrade = appliedCobradeFilter
        ? p.cobrade.toLowerCase() === appliedCobradeFilter.toLowerCase()
        : true;
      return byCity && byService && byCobrade;
    });
  }, [plans, appliedCityFilter, appliedServiceFilter, appliedCobradeFilter]);

  const showPagination = filteredPlans.length > 10;

  // --- Handlers de Ações da UI ---
  const openCreateForm = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({ cityId: '', serviceId: '', cobrade: '' });
    setErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const onEdit = async (id: string) => {
    try {
      showLoading('Carregando plano...');
      const plan = await api.getPlan(id);
      setIsEdit(true);
      setEditingId(plan.id);
      setForm({
        cityId: plan.city?.id ?? '',
        serviceId: plan.service?.id ?? '',
        cobrade: plan.cobrade ?? '',
      });
      setErrors({});
      setIsFormOpen(true);
    } catch (err) {
      console.error(err);
      error('Falha ao carregar dados do plano para edição');
    } finally {
      hideLoading();
    }
  };

  const onSave = async () => {
    if (!validateOnSubmit()) return;

    showLoading(isEdit ? 'Atualizando plano...' : 'Criando plano...');
    try {
      if (isEdit && editingId) {
        const payload: PlanUpdateDTO = {
          cityId: form.cityId,
          serviceId: form.serviceId,
          cobrade: form.cobrade.trim(),
        };
        const updated = await api.editPlan(editingId, payload);
        setPlans((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        success('Plano atualizado com sucesso');
      } else {
        const created = await api.createPlan({
          cityId: form.cityId,
          serviceId: form.serviceId,
          cobrade: form.cobrade.trim(),
        });
        setPlans((prev) => [created, ...prev]);
        success('Plano criado com sucesso');
      }
      closeForm();
    } catch (err) {
      console.error(err);
      error(
        isEdit
          ? 'Não foi possível editar o plano'
          : 'Não foi possível criar o plano',
      );
    } finally {
      hideLoading();
    }
  };

  const onUpdate = (field: Field, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      const msg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
    }
  };

  // --- Handlers do Modal de Download ---
  const openDownloadModal = (plan: PlanResponseDTO) => {
    setPlanForDownload(plan);
    setDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setDownloadModalOpen(false);
    setPlanForDownload(null);
    setDownloadLoading(false);
  };

  const confirmDownload = async () => {
    if (!planForDownload) return;
    setDownloadLoading(true);
    try {
      // Simula uma chamada de API e abre o arquivo
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.open(planForDownload.fileUrl, '_blank');
      success('Download iniciado.');
      closeDownloadModal();
    } catch (err) {
      error('Falha ao iniciar o download.');
      setDownloadLoading(false);
    }
  };

  if (isAuthLoading) {
    return null; // O provedor de loading global já está ativo
  }

  // --- Renderização do Componente ---
  return (
    <main className="mx-auto mt-20 w-full px-6 py-6">
      <div className="mb-5 ml-5 flex items-center justify-between">
        <h1 className="mb-5 text-3xl font-bold">Planos de Contingência</h1>
      </div>

      <FiltersBar
        serviceOptions={serviceNames}
        cobradeOptions={cobradeOptions}
        cityOptions={cityNames}
        onSelectCity={setPendingCityFilter}
        onSelectService={setPendingServiceFilter}
        onSelectCobrade={setPendingCobradeFilter}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-700">
          Carregando planos...
        </div>
      ) : (
        <PlansTable
          rows={filteredPlans}
          showPagination={showPagination}
          onEdit={onEdit}
          onDownload={openDownloadModal}
        />
      )}

      {/* Para este modal funcionar, crie o arquivo PlanFormModal.tsx similar ao UserFormModal.tsx */}
      <PlanFormModal
        isOpen={isFormOpen}
        isEdit={isEdit}
        form={form}
        errors={errors}
        canClickSave={canClickSave}
        cityNames={cityNames}
        serviceNames={serviceNames}
        valueCityName={cityNameById(form.cityId)}
        valueServiceName={serviceNameById(form.serviceId)}
        onClose={closeForm}
        onSave={onSave}
        onUpdate={onUpdate}
        onSelectCityByName={setCityByName}
        onSelectServiceByName={setServiceByName}
      />

      <ConfirmDownloadModal
        open={isDownloadModalOpen}
        loading={downloadLoading}
        plan={planForDownload}
        onConfirm={confirmDownload}
        onClose={closeDownloadModal}
      />
    </main>
  );
}
