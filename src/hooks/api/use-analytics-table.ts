import { useGenericTable } from './use-generic-table';
import { generateDummyAnalyticsEvents } from '~/utils/analytics-data-generator';
import type { AnalyticsEvent } from '~/utils/analytics-data-generator';
import {useAxios} from '../useAxios';

export function useAnalyticsTable() {
  const { $http, fetchData } = useAxios();

  const result = useGenericTable<AnalyticsEvent>(
    ['analytics'],
    async (state) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateDummyAnalyticsEvents(state.page, state.limit, state.search);
    },
    { page: 1, limit: 10, search: '' }
  );

  return {
    data: result.data,
    tableState: result.tableState,
    totalPages: result.data?.totalPages || 0,
    total: result.data?.total || 0,
    loading: result.isLoading,
    error: result.error,
    setPage: result.setPage,
    setLimit: result.setLimit,
    setSearch: result.setSearch,
  };
}
