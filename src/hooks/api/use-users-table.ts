import { useGenericTable } from './use-generic-table';
import { generateDummyUsers } from '~/utils/dummy-data-generator';
import type { User } from '~/api-services/types';

export function useUsersTable() {
  const result = useGenericTable<User>(
    ['users'],
    async (state) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateDummyUsers(state.page, state.limit, state.search);
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
