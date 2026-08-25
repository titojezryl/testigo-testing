import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PaginatedResponse, TableState } from '~/api-services/types';

export function useGenericTable<T>(
  queryKey: string[],
  fetchFn: (state: TableState) => Promise<PaginatedResponse<T>>,
  initialState: TableState = { page: 1, limit: 10 }
) {
  const [tableState, setTableState] = useState<TableState>(initialState);

  // Only enable query if fetchFn is provided
  const query = useQuery({
    queryKey: [...queryKey, tableState],
    queryFn: () => fetchFn(tableState),
    enabled: !!fetchFn,
  });

  const setPage = (page: number) => {
    setTableState((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setTableState((prev) => ({ ...prev, limit, page: 1 }));
  };

  const setSearch = (search: string) => {
    setTableState((prev) => ({ ...prev, search: search.trim() || undefined, page: 1 }));
  };

  const setSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setTableState((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const resetSort = () => {
    setTableState((prev) => ({ ...prev, sortBy: undefined, sortOrder: undefined }));
  };

  const reset = () => {
    setTableState(initialState);
  };

  // Sync with URL params (optional enhancement for routing)
  useEffect(() => {
    // Can add URL sync logic here if needed
    // For now, we'll keep it simple with internal state
  }, []);

  return {
    ...query,
    tableState,
    setPage,
    setLimit,
    setSearch,
    setSort,
    resetSort,
    reset,
  };
}
