'use client';

import { api } from '@/lib/api';
import {
  CityResponseDTO,
  ScenarioResponseDTO,
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

type Field = 'cityId' | 'serviceId' | 'cobrade';
type Errors = Partial<Record<Field, string>>;

export default function AdminPlansPage() {
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<ScenarioResponseDTO[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);

  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);

  const [pendingCityFilter, setPendingCityFilter] = useState('');
  const [pendingCobradeFilter, setPendingCobradeFilter] = useState<
    string | null
  >(null);

  const [appliedCityFilter, setAppliedCityFilter] = useState('');
  const [appliedCobradeFilter, setAppliedCobradeFilter] = useState<
    string | null
  >(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [scenarioForDownload, setScenarioForDownload] =
    useState<ScenarioResponseDTO | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const { success, error, warning } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const loadingShown = useRef(false);
  const { isLoading: isAuthLoading } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

  const [form, setForm] = useState<PlanFormState>({
    cityId: '',
    serviceId: '',
    cobrade: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const cobradeOptions = useMemo(() => {
    const uniqueCobrades = new Set(scenarios.map((s) => s.cobrade.subgroup));
    return Array.from(uniqueCobrades);
  }, [scenarios]);

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

  const handleSearch = () => {
    setAppliedCityFilter(pendingCityFilter);
    setAppliedCobradeFilter(pendingCobradeFilter);
  };

  const handleClearFilters = () => {
    setPendingCityFilter('');
    setPendingCobradeFilter(null);
    setAppliedCityFilter('');
    setAppliedCobradeFilter(null);
  };

  const filteredScenarios = useMemo(() => {
    if (!appliedCityFilter && !appliedCobradeFilter) {
      return scenarios;
    }
    return scenarios.filter((s) => {
      const byCity = appliedCityFilter
        ? s.city.name.toLowerCase().includes(appliedCityFilter.toLowerCase())
        : true;
      const byCobrade = appliedCobradeFilter
        ? s.cobrade.subgroup.toLowerCase() ===
          appliedCobradeFilter.toLowerCase()
        : true;
      return byCity && byCobrade;
    });
  }, [scenarios, appliedCityFilter, appliedCobradeFilter]);

  const showPagination = filteredScenarios.length > 10;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [fetchedScenarios, fetchedCities] = await Promise.all([
          api.getScenarios(),
          api.getAllCities(),
        ]);
        if (!mounted) return;
        setScenarios(fetchedScenarios);
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

  const onEdit = (id: string) => {
    console.log('Editando cenário:', id);
  };

  const onDownload = (scenario: ScenarioResponseDTO) => {
    setScenarioForDownload(scenario);
    setDownloadModalOpen(true);
  };

  const handleBulkDownload = () => {
    const selectedScenarios = scenarios.filter((s) =>
      selectedScenarioIds.includes(s.id)
    );
    if (selectedScenarios.length === 0) {
      error('Nenhum plano selecionado para download.');
      return;
    }

    success(`Iniciando download de ${selectedScenarios.length} plano(s)...`);
    selectedScenarios.forEach((scenario) => {
      const downloadUrl = `/api/scenarios/${scenario.id}/download`;
      window.open(downloadUrl, '_blank');
    });
  };

  const handleConfirmDownload = () => {
    if (scenarioForDownload) {
      const downloadUrl = `/api/scenarios/${scenarioForDownload.id}/download`;
      window.open(downloadUrl, '_blank');
      setDownloadModalOpen(false);
    }
  };

  if (isAuthLoading) {
    return null;
  }

  return (
    <main className="mx-auto mt-20 w-full px-6 py-6">
      <div className="mb-5 ml-5 flex items-center justify-between">
        <h1 className="mb-5 text-3xl font-bold">Planos de Contingência</h1>
      </div>

      <FiltersBar
        cobradeOptions={cobradeOptions}
        cityFilter={pendingCityFilter}
        onCityChange={setPendingCityFilter}
        onSelectCobrade={setPendingCobradeFilter}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-700">
          Carregando planos...
        </div>
      ) : (
        <PlansTable
          rows={filteredScenarios}
          showPagination={showPagination}
          selectedPlanIds={selectedScenarioIds}
          onSelectionChange={setSelectedScenarioIds}
          onEdit={onEdit}
          onDownload={onDownload}
        />
      )}

      {selectedScenarioIds.length > 0 && (
        <div className="fixed right-5 bottom-5 z-20">
          <button
            onClick={handleBulkDownload}
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            Downloads ({selectedScenarioIds.length})
          </button>
        </div>
      )}

      <PlanFormModal
        isOpen={isFormOpen}
        isEdit={isEdit}
        form={form}
        errors={errors}
        canClickSave={true}
        cityNames={cities.map((c) => c.name)}
        serviceNames={[]}
        valueCityName={null}
        valueServiceName={null}
        onClose={() => setIsFormOpen(false)}
        onSave={() => {}}
        onUpdate={() => {}}
        onSelectCityByName={() => {}}
        onSelectServiceByName={() => {}}
      />

      <ConfirmDownloadModal
        open={isDownloadModalOpen}
        loading={downloadLoading}
        scenario={scenarioForDownload}
        onConfirm={handleConfirmDownload}
        onClose={() => setDownloadModalOpen(false)}
      />
    </main>
  );
}