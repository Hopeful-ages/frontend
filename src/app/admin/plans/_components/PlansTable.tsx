'use client';
import Table from '@/components/Table';
import { PlanResponseDTO } from '@/lib/types'; // Supondo que o tipo PlanResponseDTO esteja em @/lib/types
import { FileDown, Pencil } from 'lucide-react';

type PlansTableProps = {
  rows: PlanResponseDTO[];
  showPagination: boolean;
  onEdit: (id: string) => void;
  onDownload: (plan: PlanResponseDTO) => void;
};

export function PlansTable({
  rows,
  showPagination,
  onEdit,
  onDownload,
}: PlansTableProps) {
  const formatDate = (dateString: string) => {
    // Função simples para formatar a data, pode ser ajustada conforme necessário
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <Table<PlanResponseDTO>
      rows={rows}
      size="md"
      divider
      pageSize={10}
      defaultPage={1}
    >
      <Table.Header plain>
        <Table.Row>
          <Table.Heading accessor="cityName" sortable width="30%">
            Cidade
          </Table.Heading>
          <Table.Heading accessor="serviceName" width="25%">
            Serviço
          </Table.Heading>
          <Table.Heading accessor="cobrade" width="20%">
            Cobrade
          </Table.Heading>
          <Table.Heading accessor="lastUpdated" width="15%">
            Última Atualização
          </Table.Heading>
          <Table.Heading width="5%" align="center">
            Editar
          </Table.Heading>
          <Table.Heading width="5%" align="center">
            Download
          </Table.Heading>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Rows<PlanResponseDTO>>
          {(row) => (
            <Table.Row key={row.id} row={row}>
              <Table.Cell>{row.city?.name ?? '—'}</Table.Cell>
              <Table.Cell>{row.service?.name ?? '—'}</Table.Cell>
              <Table.Cell>{row.cobrade ?? '—'}</Table.Cell>
              <Table.Cell>{formatDate(row.lastUpdated)}</Table.Cell>

              <Table.Cell align="center">
                <button
                  type="button"
                  title="Editar Plano"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                  onClick={() => onEdit(row.id)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </Table.Cell>

              <Table.Cell align="center">
                <button
                  type="button"
                  title="Download do Plano"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                  onClick={() => onDownload(row)}
                >
                  <FileDown className="h-4 w-4" />
                </button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Rows>
      </Table.Body>

      {showPagination && (
        <Table.Footer>
          <Table.Pagination className="mt-2" />
        </Table.Footer>
      )}
    </Table>
  );
}
