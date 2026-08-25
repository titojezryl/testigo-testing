import { DataTableWithSearch } from './ui/data-table-with-search';
import { TablePagination } from './ui/table-pagination';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import type { ColumnDef } from '~/api-services/types';

interface DataTableContainerProps<T> {
  queryKey: string[];
  fetchFn: (state: any) => Promise<any>;
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string | undefined;
  tableState: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  data?: T[];
  totalPages?: number;
  total?: number;
  loading?: boolean;
  error?: Error | null;
  refresh?: () => void;
  isRefreshing?: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
}

export function DataTableContainer<T>({
  fetchFn,
  columns,
  title,
  searchPlaceholder = 'Search...',
  onRowClick,
  rowClassName,
  tableState,
  data = [],
  totalPages = 0,
  total = 0,
  loading = false,
  error = null,
  refresh,
  isRefreshing = false,
  setPage,
  setLimit,
  setSearch,
}: DataTableContainerProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      {/* {(title || refresh) && (
        <div className="flex items-center justify-between">
          {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
          {refresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      )} */}

      <DataTableWithSearch
        data={data}
        title={title}
        columns={columns}
        loading={loading}
        emptyMessage={error ? 'Failed to load data. Try refreshing.' : 'No data available'}
        onRowClick={onRowClick}
        rowClassName={rowClassName}
        searchValue={tableState.search || ''}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
      />

      <TablePagination
        page={tableState.page}
        limit={tableState.limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
