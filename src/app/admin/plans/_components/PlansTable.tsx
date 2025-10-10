'use client';
import Table from '@/components/Table';
import { ScenarioResponseDTO } from '@/lib/types';
import { FileDown, Pencil } from 'lucide-react';
import { useCallback } from 'react';

type PlansTableProps = {
  rows: ScenarioResponseDTO[];
  showPagination: boolean;
  selectedPlanIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (id: string) => void;
  onDownload: (scenario: ScenarioResponseDTO) => void;
};

const getLatestUpdate = (scenario: ScenarioResponseDTO): string | null => {
  if (!scenario.tasks || scenario.tasks.length === 0) return null;
  const latestTask = scenario.tasks.reduce((latest, current) => {
    const latestDate = new Date(latest.lastUpdateDate);
    const currentDate = new Date(current.lastUpdateDate);
    return currentDate > latestDate ? current : latest;
  });
  return latestTask.lastUpdateDate;
};

export function PlansTable({
  rows,
  showPagination,
  onSelectionChange,
  onEdit,
  onDownload,
}: PlansTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const handleSelectionChange = useCallback(
    (selectedRows: ScenarioResponseDTO[]) => {
      onSelectionChange(selectedRows.map((r) => r.id));
    },
    [onSelectionChange],
  );

  return (
    <Table<ScenarioResponseDTO>
      rows={rows}
      size="md"
      divider
      pageSize={10}
      defaultPage={1}
      selectable
      onSelectionChange={handleSelectionChange}
    >
      <Table.Header plain>
        <Table.Row>
          <Table.Heading accessor="city.name" sortable width="30%">
            Cidade
          </Table.Heading>
          <Table.Heading width="30%">Cobrade</Table.Heading>
          <Table.Heading width="20%">Última Atualização</Table.Heading>
          <Table.Heading width="15%" align="center">
            Editar
          </Table.Heading>
          <Table.Heading width="5%" align="center">
            Download
          </Table.Heading>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Rows<ScenarioResponseDTO>>
          {(row) => {
            const lastUpdated = getLatestUpdate(row);
            return (
              <Table.Row key={row.id} row={row}>
                <Table.Cell>
                  {row.city 
                    ? `${row.city.name} - ${row.city.state}` 
                    : '—'}
                </Table.Cell>
                <Table.Cell>
                  {`${row.cobrade.code} - ${row.cobrade.subType || row.cobrade.type || row.cobrade.subgroup}` } 
                </Table.Cell>
                <Table.Cell>
                  {lastUpdated ? formatDate(lastUpdated) : '—'}
                </Table.Cell>
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
            );
          }}
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
