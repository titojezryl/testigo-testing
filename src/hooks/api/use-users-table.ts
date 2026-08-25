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
      const res = await $http.get('/users', {
        params: { page: state.page, limit: state.limit, search: state.search },
      });
      
      // Transform backend response to match expected PaginatedResponse format
      const backendData = res.data;
      const totalPages = Math.ceil(backendData.total / backendData.limit);
      
      return {
        users: backendData.users,
        pagination: {
          page: backendData.page,
          limit: backendData.limit,
          total: backendData.total,
          totalPages: totalPages
        }
      };
      // return generateDummyUsers(state.page, state.limit, state.search);
    },
    { page: 1, limit: 10, search: '' }
  );


  return {
    data: result.data?.users || [],
    tableState: result.tableState,
    totalPages: result.data?.pagination?.totalPages || 0,
    total: result.data?.pagination?.total || 0,
    loading: result.isLoading,
    error: result.error,
    setPage: result.setPage,
    setLimit: result.setLimit,
    setSearch: result.setSearch,
  };
}
