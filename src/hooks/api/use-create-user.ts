import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '~/api-services';
import type { CreateUserInput } from '~/api-services/types';
import { useAxios } from '~/hooks/useAxios';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { $http } = useAxios();

  const mutation = useMutation({
    mutationFn: (userData: CreateUserInput) => $http.post('/users/create', userData),
    onSuccess: (data) => {
      toast.success('User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create user:', error);
    },
  });

  return {
    createUser: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}