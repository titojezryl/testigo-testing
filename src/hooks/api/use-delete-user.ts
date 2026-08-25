import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAxios } from '~/hooks/useAxios';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { $http } = useAxios();

  const mutation = useMutation({
    mutationFn: (userId: string) => $http.delete(`/users/${userId}`),
    onSuccess: () => {
      toast.success('User deleted successfully!');
      // Invalidate and refetch users query to refresh the table
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user. Please try again.');
    },
  });

  return {
    deleteUser: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}