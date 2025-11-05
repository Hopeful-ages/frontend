'use client';
import Table from '@/components/Table';
import { DepartmentResponseDTO } from '@/lib/types';
import { Hammer, X } from 'lucide-react';

type ServicesTableProps = {
  rows: DepartmentResponseDTO[];
  showPagination: boolean;
  onDeleteAction: (id: string) => void;
};

export function ServicesTable({
  rows,
  showPagination,
  onDeleteAction,
}: ServicesTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table<DepartmentResponseDTO>
        rows={rows}
        size="md"
        divider
        className="min-w-full"
        pageSize={10}
        defaultPage={1}
      >
        <Table.Header plain>
          <Table.Row>
            <Table.Heading accessor="name" sortable width="35%">
              Nome
            </Table.Heading>
            <Table.Heading
              width="7%"
              align="center"
              className="sticky right-0 bg-white"
            >
              Excluir
            </Table.Heading>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Rows<DepartmentResponseDTO>>
            {(row) => (
              <Table.Row key={row.id} row={row}>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Hammer className="h-5 w-5 flex-shrink-0 text-gray-600" />
                    <span className="truncate">{row.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell align="center" className="sticky right-0 bg-white">
                  <button
                    type="button"
                    title="Excluir"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                    onClick={() => onDeleteAction(row.id)}
                  >
                    <X className="h-4 w-4" />
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
    </div>
  );
}
