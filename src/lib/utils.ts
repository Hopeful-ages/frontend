/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/AAAA)
 * @param dateString - String de data no formato ISO ou qualquer formato válido
 * @returns Data formatada em DD/MM/AAAA ou o valor original se inválido
 */
export function formatDate(dateString: string): string {
  if (!dateString || dateString === 'N/A') return 'N/A';

  try {
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formata uma data ISO para o formato brasileiro com hora (DD/MM/AAAA HH:mm)
 * @param dateString - String de data no formato ISO ou qualquer formato válido
 * @returns Data formatada em DD/MM/AAAA HH:mm ou o valor original se inválido
 */
export function formatDateTime(dateString: string): string {
  if (!dateString || dateString === 'N/A') return 'N/A';

  try {
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
