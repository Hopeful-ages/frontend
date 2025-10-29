import { useState } from 'react';
import { api } from '@/lib/api';
import { ScenarioResponseDTO } from '@/lib/types';
import { useToast } from './useToast';

export function useDownloadPdf() {
  const { error } = useToast();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedPlanForDownload, setSelectedPlanForDownload] =
    useState<ScenarioResponseDTO | null>(null);

  const handleDownload = (plan: ScenarioResponseDTO) => {
    setSelectedPlanForDownload(plan);
    setIsDownloadModalOpen(true);
  };

  const downloadPdf = async (plan: ScenarioResponseDTO) => {
    try {
      const res = await api.downloadScenarioPdf(plan.id);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const prefix = plan.published ? '' : '[NAO-PUBLICADO]-';
      a.download = `${prefix}plano-contingencia-${plan.city.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao baixar PDF:', err);
      error('Erro ao baixar o PDF. Tente novamente.');
      throw err;
    }
  };

  const handleConfirmDownload = async () => {
    if (selectedPlanForDownload) {
      await downloadPdf(selectedPlanForDownload);
    }
    setIsDownloadModalOpen(false);
    setSelectedPlanForDownload(null);
  };

  const handleCancelDownload = () => {
    setIsDownloadModalOpen(false);
    setSelectedPlanForDownload(null);
  };

  return {
    isDownloadModalOpen,
    selectedPlanForDownload,
    handleDownload,
    handleConfirmDownload,
    handleCancelDownload,
    downloadPdf,
  };
}
