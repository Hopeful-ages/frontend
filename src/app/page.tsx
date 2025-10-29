'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { ScenarioResponseDTO } from '@/lib/types';
import { useToast } from '@/hooks/useToast';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';
import { FiltersBar } from './admin/plans/_components/FiltersBar';
import { PlansTable } from './admin/plans/_components/PlansTable';
import PlanCard from '@/components/PlanCard';
import DownloadModal from '@/components/DownloadModal';
import FiltersModal from '@/components/FiltersModal';
import { Filter } from 'lucide-react';

export default function PlanSearchPage() {
  const { error } = useToast();
  const {
    isDownloadModalOpen,
    selectedPlanForDownload,
    handleDownload,
    handleConfirmDownload,
    handleCancelDownload,
  } = useDownloadPdf();

  const [loading, setLoading] = useState(true);

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

  const [plans, setPlans] = useState<ScenarioResponseDTO[]>([]);

  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const publishedScenarios = await api.searchScenariosByCityAndCobrade(
          null,
          null,
        );
        if (!mounted) return;
        setPlans(publishedScenarios);
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

  const handleSearch = () => {
    setAppliedCityFilter(pendingCityFilter);
    setAppliedCobradeFilter(pendingCobradeFilter);
  };

  const handleClearFilters = () => {
    setPendingCityFilter(null);
    setPendingCobradeFilter(null);
    setAppliedCityFilter(null);
    setAppliedCobradeFilter(null);
  };

  const cityNames = useMemo(() => {
    const uniqueCities = new Map<string, string>();
    plans.forEach((plan) => {
      const key = `${plan.city.name} - ${plan.city.state}`;
      uniqueCities.set(plan.city.id, key);
    });
    return Array.from(uniqueCities.values()).sort();
  }, [plans]);

  const cobradeOptions = useMemo(() => {
    const uniqueCobrades = new Map<string, string>();
    plans.forEach((plan) => {
      const key = `${plan.cobrade.code} - ${plan.cobrade.subType || plan.cobrade.type || plan.cobrade.subgroup}`;
      uniqueCobrades.set(plan.cobrade.id, key);
    });
    return Array.from(uniqueCobrades.values()).sort();
  }, [plans]);

  const filteredPlans = useMemo(() => {
    if (!appliedCityFilter && !appliedCobradeFilter) return plans;
    return plans.filter((p) => {
      const cityKey = `${p.city.name} - ${p.city.state}`;
      const cobradeKey = `${p.cobrade.code} - ${p.cobrade.subType || p.cobrade.type || p.cobrade.subgroup}`;

      const byCity = appliedCityFilter ? cityKey === appliedCityFilter : true;
      const byCobrade = appliedCobradeFilter
        ? cobradeKey === appliedCobradeFilter
        : true;
      return byCity && byCobrade;
    });
  }, [plans, appliedCityFilter, appliedCobradeFilter]);

  return (
    <main className="mx-auto mt-15 w-full px-6 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Planos de Contingência
        </h1>
      </div>

      <div className="mb-5 flex md:hidden">
        <button
          onClick={() => setIsFiltersModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          Filtrar
        </button>
      </div>

      <div className="hidden md:block">
        <FiltersBar
          cobradeOptions={cobradeOptions}
          cityOptions={cityNames}
          cityValue={pendingCityFilter}
          onSelectCity={setPendingCityFilter}
          onSelectCobrade={setPendingCobradeFilter}
          cobradeValue={pendingCobradeFilter}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-700">
          Carregando planos...
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <PlansTable
              rows={filteredPlans}
              showPagination={filteredPlans.length > 10}
              selectedPlanIds={selectedPlanIds}
              onSelectionChange={setSelectedPlanIds}
              isEditable={false}
              onDownload={handleDownload}
            />
          </div>

          <div className="flex flex-col items-center space-y-4 md:hidden">
            {filteredPlans.map((plan) => {
              const latestUpdate =
                plan.tasks.length > 0
                  ? plan.tasks.reduce((latest, current) => {
                      const latestDate = new Date(latest.lastUpdateDate);
                      const currentDate = new Date(current.lastUpdateDate);
                      return currentDate > latestDate ? current : latest;
                    }).lastUpdateDate
                  : 'N/A';

              return (
                <PlanCard
                  key={plan.id}
                  city={`${plan.city.name} - ${plan.city.state}`}
                  cobrade={`${plan.cobrade.code} - ${plan.cobrade.subType || plan.cobrade.type || plan.cobrade.subgroup}`}
                  lastUpdate={latestUpdate}
                  onDownload={() => handleDownload(plan)}
                />
              );
            })}
          </div>
        </>
      )}

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        cityOptions={cityNames}
        cobradeOptions={cobradeOptions}
        cityValue={pendingCityFilter}
        cobradeValue={pendingCobradeFilter}
        onSelectCity={setPendingCityFilter}
        onSelectCobrade={setPendingCobradeFilter}
        onApplyFilters={handleSearch}
        onClearFilters={handleClearFilters}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        city={
          selectedPlanForDownload
            ? `${selectedPlanForDownload.city.name} - ${selectedPlanForDownload.city.state}`
            : ''
        }
        year={
          selectedPlanForDownload && selectedPlanForDownload.tasks.length > 0
            ? new Date(selectedPlanForDownload.tasks[0].lastUpdateDate)
                .getFullYear()
                .toString()
            : new Date().getFullYear().toString()
        }
        onConfirm={handleConfirmDownload}
        onCancel={handleCancelDownload}
      />
    </main>
  );
}
