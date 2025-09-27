'use client';
import Table from '@/components/Table';
import { ScenarioResponseDTO } from '@/lib/types';
import { FileDown, Pencil } from 'lucide-react';

type PlansTableProps = {
  rows: ScenarioResponseDTO[];
  showPagination: boolean;
  selectedPlanIds: string[];
  onSelectionChange: (newSelectedIds: string[]) => void;
  onEdit: (id: string) => void;
  onDownload: (scenario: ScenarioResponseDTO) => void;
};

const getLatestUpdate = (scenario: ScenarioResponseDTO): string | null => {
  if (!scenario.tasks || scenario.tasks.length === 0) {
    return null;
  }
  
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
  selectedPlanIds,
  onSelectionChange,
  onEdit,
  onDownload,
}: PlansTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(rows.map((row) => row.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = selectedPlanIds.includes(id)
      ? selectedPlanIds.filter((planId) => planId !== id)
      : [...selectedPlanIds, id];
    onSelectionChange(newSelection);
  };

  const isAllSelected =
    rows.length > 0 && selectedPlanIds.length === rows.length;

  return (
    <Table<ScenarioResponseDTO>
      rows={rows}
      size="md"
      divider
      pageSize={10}
      defaultPage={1}
    >
      <Table.Header plain>
        <Table.Row>
          <Table.Heading width="5%" align="center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
          </Table.Heading>
          <Table.Heading accessor="cityName" sortable width="30%">
            Cidade
          </Table.Heading>
          <Table.Heading accessor="cobrade" width="20%">
            Cobrade
          </Table.Heading>
          <Table.Heading accessor="lastUpdated" width="20%">
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
        <Table.Rows<ScenarioResponseDTO>>
          {(row) => {
            const lastUpdated = getLatestUpdate(row);
            return (
              <Table.Row key={row.id} row={row}>
                <Table.Cell align="center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedPlanIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </Table.Cell>
                <Table.Cell>{row.city.name ?? '—'}</Table.Cell>
                <Table.Cell>{row.cobrade.subgroup ?? '—'}</Table.Cell>
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