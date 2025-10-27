'use client';

import { api } from '@/lib/api';
import { CityResponseDTO, ScenarioResponseDTO } from '@/lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/providers/LoadingProvider';
import { useRouter } from 'next/navigation';
import { ConfirmDownloadModal } from './_components/ConfirmDownloadModal';
import { FiltersBar } from './_components/FiltersBar';
import { PlansTable } from './_components/PlansTable';
import { ConfirmPublishModal } from './_components/ConfirmPublishModal';

type Field = 'cityId' | 'serviceId' | 'cobrade';
type Errors = Partial<Record<Field, string>>;

export default function AdminPlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<ScenarioResponseDTO[]>([]);
  const [cities, setCities] = useState<CityResponseDTO[]>([]);

  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);

  const [pendingCityFilter, setPendingCityFilter] = useState<string | null>(
    null,
  );
  const [pendingCobradeFilter, setPendingCobradeFilter] = useState<
    string | null
  >(null);

  const [appliedCityFilter, setAppliedCityFilter] = useState<string | null>(
    null,
  );
  const [appliedCobradeFilter, setAppliedCobradeFilter] = useState<
    string | null
  >(null);

  const [pendingPublishedFilter, setPendingPublishedFilter] = useState<
    string | null
  >(null);
  const [appliedPublishedFilter, setAppliedPublishedFilter] = useState<
    string | null
  >(null);

  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [scenarioForDownload, setScenarioForDownload] =
    useState<ScenarioResponseDTO | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  const [scenarioForPublish, setScenarioForPublish] =
    useState<ScenarioResponseDTO | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);

  const { success, error } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const loadingShown = useRef(false);
  const { isLoading: isAuthLoading } = useProtectedPage({
    requiredRole: 'ROLE_USER',
  });

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
    const adjustedCity = pendingCityFilter
      ? pendingCityFilter.split(' - ')[0]
      : null;

    setAppliedCityFilter(adjustedCity);
    setAppliedCobradeFilter(pendingCobradeFilter);
    setAppliedPublishedFilter(pendingPublishedFilter);
  };

  const handleClearFilters = () => {
    setPendingCityFilter(null);
    setPendingCobradeFilter(null);
    setPendingPublishedFilter(null);
    setAppliedCityFilter(null);
    setAppliedCobradeFilter(null);
    setAppliedPublishedFilter(null);
  };

  const filteredScenarios = useMemo(() => {
    if (!appliedCityFilter && !appliedCobradeFilter && !appliedPublishedFilter)
      return scenarios;

    return scenarios.filter((s) => {
      const byCity = appliedCityFilter
        ? s.city.name.toLowerCase().includes(appliedCityFilter.toLowerCase())
        : true;
      const byCobrade = appliedCobradeFilter
        ? s.cobrade.subgroup.toLowerCase() ===
          appliedCobradeFilter.toLowerCase()
        : true;
      const byPublished =
        appliedPublishedFilter === 'Publicado'
          ? s.published
          : appliedPublishedFilter === 'Não publicado'
            ? !s.published
            : true;

      return byCity && byCobrade && byPublished;
    });
  }, [
    scenarios,
    appliedCityFilter,
    appliedCobradeFilter,
    appliedPublishedFilter,
  ]);

  const showPagination = filteredScenarios.length > 10;

  const cityNames = cities.map((c) => `${c.name} - ${c.state}`);

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
    router.push(`/admin/create-scenario/${id}`);
  };

  const onDownload = (scenario: ScenarioResponseDTO) => {
    setScenarioForDownload(scenario);
    setDownloadModalOpen(true);
  };

  const handleBulkDownload = () => {
    const selectedScenarios = scenarios.filter((s) =>
      selectedScenarioIds.includes(s.id),
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

  const onPublish = (scenario: ScenarioResponseDTO) => {
    setScenarioForPublish(scenario);
    setPublishModalOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!scenarioForPublish) return;
    setPublishLoading(true);
    try {
      const updated = await api.publishScenario(scenarioForPublish.id);
      success(
        `Plano "${updated.city.name} - ${updated.cobrade.code}" publicado com sucesso!`,
      );
      setPublishModalOpen(false);
      setScenarios((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (e) {
      console.error(e);
      error('Erro ao publicar o plano.');
    } finally {
      setPublishLoading(false);
    }
  };

  if (isAuthLoading) {
    return null;
  }

  return (
    <main className="mx-auto mt-20 w-full flex-1 px-6 py-6">
      <div className="mb-5 ml-5 flex items-center justify-between">
        <h1 className="mb-5 text-3xl font-bold">Planos de Contingência</h1>
      </div>

      <FiltersBar
        cobradeOptions={cobradeOptions}
        cityOptions={cityNames}
        cityValue={pendingCityFilter}
        onSelectCity={setPendingCityFilter}
        onSelectCobrade={setPendingCobradeFilter}
        cobradeValue={pendingCobradeFilter}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        publishedSearchable={true}
        publishedValue={pendingPublishedFilter}
        onSelectPublished={setPendingPublishedFilter}
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
          isEditable={true}
          isPublishable={true}
          onEdit={onEdit}
          onDownload={onDownload}
          onPublish={onPublish}
        />
      )}

      {selectedScenarioIds.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleBulkDownload}
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            Download ({selectedScenarioIds.length})
          </button>
        </div>
      )}

      <ConfirmDownloadModal
        open={isDownloadModalOpen}
        loading={downloadLoading}
        scenario={scenarioForDownload}
        onConfirm={handleConfirmDownload}
        onClose={() => setDownloadModalOpen(false)}
      />

      <ConfirmPublishModal
        open={isPublishModalOpen}
        loading={publishLoading}
        scenario={scenarioForPublish}
        onConfirm={handleConfirmPublish}
        onClose={() => setPublishModalOpen(false)}
      />
    </main>
  );
}
