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
  onEdit?: (id: string) => void;
  onDownload: (scenario: ScenarioResponseDTO) => void;
  isEditable?: boolean;
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
  isEditable = false,
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

  const columnWidths = isEditable
    ? ['25%', '25%', '20%', '15%', '15%']
    : ['35%', '35%', '20%', '10%'];
  const cellPadding = isEditable ? 'px-3 py-2' : 'px-4 py-3';

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
          <Table.Heading width={columnWidths[0]} accessor="city.name" sortable>
            Cidade
          </Table.Heading>
          <Table.Heading width={columnWidths[1]}>Cobrade</Table.Heading>
          <Table.Heading width={columnWidths[2]}>
            Última Atualização
          </Table.Heading>
          {isEditable && (
            <Table.Heading width={columnWidths[3]} align="center">
              Editar
            </Table.Heading>
          )}
          <Table.Heading
            width={isEditable ? columnWidths[4] : columnWidths[3]}
            align="center"
          >
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
                <Table.Cell className={cellPadding}>
                  {row.city ? `${row.city.name} - ${row.city.state}` : '—'}
                </Table.Cell>
                <Table.Cell className={cellPadding}>
                  {`${row.cobrade.code} - ${row.cobrade.subType || row.cobrade.type || row.cobrade.subgroup}`}
                </Table.Cell>
                <Table.Cell className={cellPadding}>
                  {lastUpdated ? formatDate(lastUpdated) : '—'}
                </Table.Cell>
                {isEditable && (
                  <Table.Cell align="center" className={cellPadding}>
                    <button
                      type="button"
                      title="Editar Plano"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-200"
                      onClick={() => onEdit?.(row.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Table.Cell>
                )}
                <Table.Cell align="center" className={cellPadding}>
                  <button
                    type="button"
                    title="Download do Plano"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-200"
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
