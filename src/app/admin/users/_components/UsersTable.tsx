'use client';
import Table from '@/components/Table';
import { UserResponseDTO } from '@/lib/types';
import { Pencil, User as UserIcon, UserRoundX } from 'lucide-react';

type UsersTableProps = {
  rows: UserResponseDTO[];
  showPagination: boolean;
  onEdit: (id: string) => void;
  onToggleAsk: (user: UserResponseDTO) => void;
};

export function UsersTable({
  rows,
  showPagination,
  onEdit,
  onToggleAsk,
}: UsersTableProps) {
  return (
    <Table<UserResponseDTO>
      rows={rows}
      size="md"
      divider
      className=""
      pageSize={10}
      defaultPage={1}
    >
      <Table.Header plain>
        <Table.Row>
          <Table.Heading accessor="name" sortable width="35%">
            Nome
          </Table.Heading>
          <Table.Heading accessor="serviceName" width="30%">
            Serviço
          </Table.Heading>
          <Table.Heading accessor="cityName" width="20%">
            Cidade
          </Table.Heading>
          <Table.Heading accessor="accountStatus" width="10%">
            Ativo
          </Table.Heading>
          <Table.Heading width="7%" align="center">
            Editar
          </Table.Heading>
          <Table.Heading width="7%" align="center">
            Ações
          </Table.Heading>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Rows<UserResponseDTO>>
          {(row) => (
            <Table.Row key={row.id} row={row}>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span>{row.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell>{row.service?.name ?? '—'}</Table.Cell>
              <Table.Cell>
                {row.city ? `${row.city.name} - ${row.city.state}` : '—'}
              </Table.Cell>
              <Table.Cell>{row.accountStatus ? 'Sim' : 'Não'}</Table.Cell>
              <Table.Cell align="center">
                <button
                  type="button"
                  title="Editar"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                  onClick={() => onEdit(row.id)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </Table.Cell>
              <Table.Cell align="center">
                <button
                  type="button"
                  title={row.accountStatus ? 'Desativar' : 'Ativar'}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                  onClick={() => onToggleAsk(row)}
                >
                  <UserRoundX className="h-4 w-4" />
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
