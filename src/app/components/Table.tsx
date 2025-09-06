'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
} from 'lucide-react';

type SortDir = 'asc' | 'desc';
type SortState = { accessor: string | null; dir: SortDir };

type Size = 'sm' | 'md' | 'lg';
type Align = 'left' | 'center' | 'right';

type TableRootProps<T> = {
  rows: T[];
  className?: string;
  size?: Size;
  divider?: boolean;
  defaultSort?: { accessor: string; dir: SortDir };
  onSortChange?: (s: {
    accessor: string;
    dir: SortDir;
    index?: number;
  }) => void;
  pageSize?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

type TableHeadingProps<T> = PropsWithChildren<{
  accessor?: string;
  sortable?: boolean;
  width?: string;
  align?: Align;
  className?: string;
  decorate?: (args: { value: unknown; row: T }) => React.ReactNode;
}>;

type TableRowProps<T> = PropsWithChildren<{ row?: T; className?: string }>;

type TableCellProps = PropsWithChildren<{
  field?: string;
  width?: string;
  align?: Align;
  className?: string;
  title?: string;
}>;

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(' ');
}

function getValueFromPath(obj: unknown, path?: string): unknown {
  if (!path) return undefined;
  let cur: unknown = obj;
  for (const key of path.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<PropertyKey, unknown>)[key as PropertyKey];
  }
  return cur;
}

function isNumberLike(v: unknown) {
  return (
    typeof v === 'number' ||
    (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)))
  );
}

function formatCell(v: unknown): React.ReactNode {
  if (v == null) return '—';
  if (v instanceof Date) return v.toLocaleDateString();
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
    return String(v);
  return String(v);
}

type DecorateFn = (args: { value: unknown; row: unknown }) => React.ReactNode;

type TableCtx<T> = {
  size: Size;
  divider: boolean;
  rows: T[];
  sortedRows: T[];
  sort: SortState;
  setSort: (s: SortState) => void;
  collator: Intl.Collator;
  registerColumnDecorator: (colIndex: number, fn?: DecorateFn) => void;
  getColumnDecorator: (colIndex: number) => DecorateFn | undefined;
  page: number;
  pageSize: number | null;
  totalRows: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  paginatedRows: T[];
};

const TableContext = createContext<TableCtx<unknown> | null>(null);
const RowContext = createContext<{ row: unknown | undefined }>({
  row: undefined,
});

function useTable<T>() {
  const ctx = useContext(TableContext) as TableCtx<T> | null;
  if (!ctx) throw new Error('Table.* deve estar dentro de <Table>');
  return ctx;
}
function useRow<T>() {
  return useContext(RowContext).row as T | undefined;
}

function Root<T>({
  rows,
  className,
  size = 'md',
  divider = true,
  defaultSort,
  onSortChange,
  children,
  pageSize,
  defaultPage = 1,
  onPageChange,
  onPageSizeChange,
}: PropsWithChildren<TableRootProps<T>>) {
  const [sort, setSortInner] = useState<SortState>({
    accessor: defaultSort?.accessor ?? null,
    dir: defaultSort?.dir ?? 'asc',
  });

  const collator = useMemo(
    () => new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' }),
    [],
  );

  const decoratorsRef = useRef<Map<number, DecorateFn>>(new Map());
  const [, forceDecoratorsTick] = useState(0);

  const registerColumnDecorator = useCallback(
    (index: number, fn?: DecorateFn) => {
      if (index == null) return;
      if (fn) decoratorsRef.current.set(index, fn);
      else decoratorsRef.current.delete(index);
      forceDecoratorsTick((t) => t + 1);
    },
    [],
  );

  const getColumnDecorator = useCallback(
    (index: number) => decoratorsRef.current.get(index),
    [],
  );

  const setSort = (s: SortState) => {
    setSortInner(s);
    if (s.accessor) onSortChange?.({ accessor: s.accessor, dir: s.dir });
  };

  const sortedRows = useMemo(() => {
    if (!sort.accessor) return rows;
    const dirFactor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = getValueFromPath(a, sort.accessor!);
      const vb = getValueFromPath(b, sort.accessor!);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (isNumberLike(va) && isNumberLike(vb))
        return (Number(va) - Number(vb)) * dirFactor;
      return collator.compare(String(va), String(vb)) * dirFactor;
    });
  }, [rows, sort, collator]);

  const [page, setPageState] = useState<number>(defaultPage);
  const [pageSizeState, setPageSizeState] = useState<number | null>(
    pageSize ?? null,
  );
  const totalRows = sortedRows.length;

  const setPage = (p: number) => {
    const totalPages = pageSizeState
      ? Math.max(1, Math.ceil(totalRows / pageSizeState))
      : 1;
    const next = pageSizeState ? Math.min(Math.max(1, p), totalPages) : 1;
    setPageState(next);
    onPageChange?.(next);
  };

  const setPageSize = (s: number) => {
    setPageSizeState(s);
    onPageSizeChange?.(s);
    setPageState(1);
  };

  React.useEffect(() => {
    if (!pageSizeState) return;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSizeState));
    if (page > totalPages) setPageState(totalPages);
  }, [totalRows, pageSizeState, page]);

  const paginatedRows = useMemo(() => {
    if (!pageSizeState) return sortedRows;
    const start = (page - 1) * pageSizeState;
    return sortedRows.slice(start, start + pageSizeState);
  }, [sortedRows, page, pageSizeState]);

  return (
    <TableContext.Provider
      value={{
        size,
        divider,
        rows,
        sortedRows,
        sort,
        setSort,
        collator,
        registerColumnDecorator,
        getColumnDecorator,
        page,
        pageSize: pageSizeState,
        totalRows,
        setPage,
        setPageSize,
        paginatedRows,
      }}
    >
      <div className={cx('mx-auto w-[95%] overflow-x-auto', className)}>
        <table className="min-w-full border-collapse overflow-hidden rounded-xl">
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

function Header({
  children,
  plain = false,
  className,
}: React.PropsWithChildren<{ plain?: boolean; className?: string }>) {
  return (
    <thead className={cx(plain ? 'bg-transparent' : 'bg-gray-50', className)}>
      {children}
    </thead>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <tfoot>
      <tr>
        <td colSpan={999} className="p-0">
          {children}
        </td>
      </tr>
    </tfoot>
  );
}

function Row<T>({ row, className, children }: TableRowProps<T>) {
  const { divider, size } = useTable<T>();
  const isHeader = row === undefined;
  return (
    <RowContext.Provider value={{ row }}>
      <tr
        className={cx(
          divider && 'border-b border-gray-100',
          !isHeader && 'hover:bg-gray-50',
          'transition-colors',
          className,
        )}
      >
        {React.Children.toArray(children).map((child, idx) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(
            child as React.ReactElement<{ __size?: Size; __colIndex?: number }>,
            { __size: size, __colIndex: idx },
          );
        })}
      </tr>
    </RowContext.Provider>
  );
}

function Heading<T>({
  accessor,
  sortable,
  width,
  align = 'left',
  className,
  children,
  decorate,
  __size,
  __colIndex,
}: TableHeadingProps<T> & { __size?: Size; __colIndex?: number }) {
  const { sort, setSort, registerColumnDecorator } = useTable<T>();

  useLayoutEffect(() => {
    if (__colIndex == null) return;
    const fn: DecorateFn | undefined = decorate
      ? ({ value, row }) => decorate({ value, row: row as T })
      : undefined;
    registerColumnDecorator(__colIndex, fn);
    return () => registerColumnDecorator(__colIndex, undefined);
  }, [__colIndex, decorate, registerColumnDecorator]);

  const onClick = () => {
    if (!sortable || !accessor) return;
    const isActive = sort.accessor === accessor;
    setSort({
      accessor,
      dir: isActive ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc',
    });
  };

  const isActive = accessor && sort.accessor === accessor;
  const pad = __size === 'sm' ? 'py-2' : __size === 'lg' ? 'py-4' : 'py-3';

  return (
    <th
      style={width ? { width } : undefined}
      className={cx(
        'border-b border-gray-200 px-4 text-sm font-semibold whitespace-nowrap text-gray-700',
        pad,
        align === 'right'
          ? 'text-right'
          : align === 'center'
            ? 'text-center'
            : 'text-left',
        className,
      )}
      aria-sort={
        isActive ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      {sortable && accessor ? (
        <button
          type="button"
          onClick={onClick}
          title="Ordenar"
          className={cx(
            'inline-flex items-center gap-2 select-none hover:opacity-80',
            align === 'right' && 'justify-end',
            align === 'center' && 'justify-center',
          )}
        >
          <span>{children}</span>
          <span className="-my-1 inline-flex flex-col leading-none">
            <ChevronUp
              className={cx(
                'h-3.5 w-3.5',
                isActive && sort.dir === 'asc' ? 'opacity-100' : 'opacity-40',
              )}
              aria-hidden
            />
            <ChevronDown
              className={cx(
                '-mt-1 h-3.5 w-3.5',
                isActive && sort.dir === 'desc' ? 'opacity-100' : 'opacity-40',
              )}
              aria-hidden
            />
          </span>
        </button>
      ) : (
        <div
          className={cx(
            align === 'right' && 'text-right',
            align === 'center' && 'text-center',
          )}
        >
          {children}
        </div>
      )}
    </th>
  );
}

function Body({ children }: PropsWithChildren) {
  return <tbody className="bg-white">{children}</tbody>;
}

function Cell<T>({
  field,
  width,
  align = 'left',
  className,
  title,
  children,
  __size,
  __colIndex,
}: TableCellProps & { __size?: Size; __colIndex?: number }) {
  const row = useRow<T>();
  const { getColumnDecorator } = useTable<T>();
  const value = row ? getValueFromPath(row, field) : undefined;
  const pad = __size === 'sm' ? 'py-2' : __size === 'lg' ? 'py-3.5' : 'py-2.5';

  const decorator =
    __colIndex != null ? getColumnDecorator(__colIndex) : undefined;
  const content =
    children ?? (decorator ? decorator({ value, row }) : formatCell(value));

  return (
    <td
      style={width ? { width } : undefined}
      className={cx(
        'px-4 text-sm whitespace-nowrap text-gray-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        pad,
        className,
      )}
      title={title ?? (value == null ? '' : String(value))}
    >
      {content}
    </td>
  );
}

function Rows<T>({
  children,
}: {
  children: (row: T, index: number) => React.ReactNode;
}) {
  const { paginatedRows } = useTable<T>();
  return <>{paginatedRows.map((r, i) => children(r as T, i))}</>;
}

function Pagination({
  className,
}: {
  className?: string;
  pageSizeOptions?: number[];
}) {
  const { page, pageSize, totalRows, setPage } = useTable<unknown>();
  if (!pageSize || totalRows <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalRows, page * pageSize);
  const go = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const btn =
    'inline-flex items-center justify-center h-8 px-2 rounded-lg ' +
    'border border-gray-300 bg-white text-gray-700 ' +
    'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-400';
  const icon = 'h-4 w-4';

  return (
    <div
      className={cx(
        'flex items-center justify-between gap-3 border-t border-gray-200 py-3',
        className,
      )}
    >
      <div className="text-sm text-gray-600">
        {start}-{end} de {totalRows}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={btn}
            onClick={() => go(1)}
            disabled={page <= 1}
            aria-label="Primeira"
            title="Primeira"
          >
            <ChevronsLeft className={icon} />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            aria-label="Anterior"
            title="Anterior"
          >
            <ChevronLeft className={icon} />
          </button>

          <span className="px-2 text-sm text-gray-700">
            pág. {page} / {totalPages}
          </span>

          <button
            type="button"
            className={btn}
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            aria-label="Próxima"
            title="Próxima"
          >
            <ChevronRight className={icon} />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => go(totalPages)}
            disabled={page >= totalPages}
            aria-label="Última"
            title="Última"
          >
            <ChevronsRight className={icon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const Table = Object.assign(Root, {
  Header,
  Body,
  Row,
  Heading,
  Cell,
  Rows,
  Pagination,
  Footer,
});
export default Table;
