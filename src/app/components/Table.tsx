'use client';

import React, { useMemo, useState } from 'react';

export type IconProps = { className?: string };

export type ActionSpec<T> = {
  id: string;
  title: string;
  icon?: React.FC<IconProps>;
  disabled?(row: T): boolean;
};

export type DataColumn<T> = {
  header: string;
  accessor: keyof T | string;
  sortable?: boolean;
  type?: undefined;
};

export type ActionsColumn<T> = {
  header?: string;
  type: 'actions';
  actions: ActionSpec<T>[];
};

export type Column<T> = DataColumn<T> | ActionsColumn<T>;

type SortDir = 'asc' | 'desc';
type SortState = { key: string | null; dir: SortDir };

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onAction?(actionId: string, row: T): void;
  getRowId?(row: T, index: number): React.Key;
  className?: string;
};

export default function Table<T>({
  columns,
  rows,
  onAction,
  getRowId,
  className,
}: TableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: null, dir: 'asc' });

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows;

    const collator = new Intl.Collator('pt-BR', {
      numeric: true,
      sensitivity: 'base',
    });
    const dirFactor = sort.dir === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const va = getValue(a as Record<string, unknown>, sort.key!);
      const vb = getValue(b as Record<string, unknown>, sort.key!);

      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      if (isNumberLike(va) && isNumberLike(vb)) {
        return (Number(va) - Number(vb)) * dirFactor;
      }
      return collator.compare(String(va), String(vb)) * dirFactor;
    });
  }, [rows, sort]);

  const toggleSort = (accessor: string) => {
    setSort((prev) => {
      if (prev.key !== accessor)
        return { key: accessor, dir: 'asc' as SortDir };
      return { key: accessor, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <table className="min-w-full border-collapse overflow-hidden rounded-xl">
        <thead className="bg-gray-50">
          <tr className="text-left">
            {columns.map((col, idx) => {
              const isSortable =
                (col as DataColumn<T>).sortable &&
                (col as ActionsColumn<T>).type !== 'actions';
              const accessor =
                (col as DataColumn<T>).accessor !== undefined
                  ? String((col as DataColumn<T>).accessor)
                  : undefined;
              const isActive = accessor && sort.key === accessor;

              return (
                <th
                  key={idx}
                  className="border-b border-gray-200 px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-700"
                >
                  {isSortable && accessor ? (
                    <button
                      onClick={() => toggleSort(accessor)}
                      className="inline-flex items-center gap-1 select-none hover:opacity-80"
                      title="Ordenar"
                      type="button"
                    >
                      <span>{(col as DataColumn<T>).header}</span>
                      <SortIcon
                        active={!!isActive}
                        dir={isActive ? sort.dir : null}
                      />
                    </button>
                  ) : (
                    <span className="select-none">
                      {(col as DataColumn<T>).header ?? ''}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-white">
          {sortedRows.map((row, rIdx) => {
            const rowKey = getRowId?.(row, rIdx) ?? rIdx;
            return (
              <tr
                key={rowKey}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50"
              >
                {columns.map((col, cIdx) => {
                  if ((col as ActionsColumn<T>).type === 'actions') {
                    const actions = (col as ActionsColumn<T>).actions ?? [];
                    return (
                      <td
                        key={cIdx}
                        className="px-4 py-2 text-sm whitespace-nowrap text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          {actions.map((action) => {
                            const Icon = action.icon ?? DotIcon;
                            const disabled = action.disabled?.(row) ?? false;
                            return (
                              <button
                                key={action.id}
                                onClick={() =>
                                  !disabled && onAction?.(action.id, row)
                                }
                                className="rounded p-1 hover:bg-gray-200/70 disabled:cursor-not-allowed disabled:opacity-50"
                                title={action.title}
                                aria-label={action.title}
                                type="button"
                                disabled={disabled}
                              >
                                <Icon className="h-4 w-4" />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    );
                  }

                  const dataCol = col as DataColumn<T>;
                  const cell = getValue(
                    row as Record<string, unknown>,
                    String(dataCol.accessor),
                  );

                  return (
                    <td
                      key={cIdx}
                      className="px-4 py-2 text-sm whitespace-nowrap text-gray-700"
                      title={cell == null ? '' : String(cell)}
                    >
                      {cell == null ? '—' : String(cell)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td
                className="px-4 py-6 text-center text-sm text-gray-500"
                colSpan={columns.length}
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getValue(obj: Record<string, unknown>, accessor: string) {
  if (!accessor) return undefined;
  return accessor
    .split('.')
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
      obj,
    );
}

function isNumberLike(v: unknown): boolean {
  return typeof v === 'number' || (!!v && !isNaN(Number(v)));
}

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(' ');
}

function SortIcon({
  active,
  dir,
  className = 'h-3.5 w-3.5',
}: {
  active: boolean;
  dir: SortDir | null;
  className?: string;
}) {
  return (
    <span className="-my-1 inline-flex flex-col">
      <svg
        viewBox="0 0 24 24"
        className={cx(
          className,
          'opacity-40',
          active && dir === 'asc' && '!opacity-100',
        )}
        aria-hidden="true"
      >
        <path d="M7 14l5-5 5 5H7z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className={cx(
          className,
          'opacity-40',
          active && dir === 'desc' && '!opacity-100',
        )}
        aria-hidden="true"
      >
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    </span>
  );
}

export function PencilIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm14.71-9.04a1.002 1.002 0 000-1.42l-2.5-2.5a1.002 1.002 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z" />
    </svg>
  );
}

export function TrashIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z" />
    </svg>
  );
}

export function DotIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
