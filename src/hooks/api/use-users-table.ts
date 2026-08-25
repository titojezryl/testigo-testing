import { useGenericTable } from './use-generic-table';
import { generateDummyUsers } from '~/utils/dummy-data-generator';
import type { User } from '~/api-services/types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from '~/hooks/useAxios';

export function useUsersTable() {
  const { $http } = useAxios();
  const [search, setSearch] = useState('');

  const result = useGenericTable<User>(
    ['users'],
    async (state) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const res = await $http.get('/users', {
          params: { page: state.page, limit: state.limit, search: state.search },
        });

        // Transform backend response to match expected PaginatedResponse format
        // Handle both old format (users/pagination) and new format (data/total/totalPages)
        const backendData = res.data;
        const users = backendData.users || backendData.data || [];
        const total = backendData.total || backendData.pagination?.total || users.length;
        const totalPages = backendData.totalPages || backendData.pagination?.totalPages || Math.ceil(total / state.limit);

        return {
          data: users,
          total: total,
          page: backendData.page || state.page,
          limit: backendData.limit || state.limit,
          totalPages: totalPages,
        };
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Fallback to dummy data on error
        return generateDummyUsers(state.page, state.limit, state.search);
      }
    },
    { page: 1, limit: 10, search: '' }
  );


  return {
    data: result.data?.data || [],
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
