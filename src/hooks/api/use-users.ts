import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '~/api-services';
import { CreateUserRequest, UpdateUserRequest, UpdateProfileRequest } from '~/api-services';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number; search?: string }) => 
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: (id: string) => [...userKeys.detail(id), 'profile'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  currentProfile: () => [...userKeys.current(), 'profile'] as const,
};

// Hooks
export function useUsers(page = 1, limit = 20, search?: string) {
  const queryKey = search 
    ? userKeys.list({ page, limit, search })
    : userKeys.list({ page, limit });

  return useQuery({
    queryKey,
    queryFn: () => search 
      ? userService.searchUsers(search, page, limit)
      : userService.getUsers(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.current(),
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => 
      userService.updateMyProfile(profileData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(userKeys.currentProfile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error('Update profile failed:', error);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: ({ file, onProgress }: { 
      file: File; 
      onProgress?: (progress: number) => void 
    }) => userService.uploadAvatar(file, onProgress),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error('Avatar upload failed:', error);
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: () => userService.removeAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error('Avatar removal failed:', error);
    },
  });

  const updateProfile = (profileData: UpdateProfileRequest) => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  const uploadAvatar = (file: File, onProgress?: (progress: number) => void) => {
    return uploadAvatarMutation.mutateAsync({ file, onProgress });
  };

  const removeAvatar = () => {
    return removeAvatarMutation.mutateAsync();
  };

  return {
    user,
    isLoading,
    error,
    refetch,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    mutations: {
      updateProfile: updateProfileMutation,
      uploadAvatar: uploadAvatarMutation,
      removeAvatar: removeAvatarMutation,
    },
  };
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCurrentUserProfile() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.currentProfile(),
    queryFn: () => userService.getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => 
      userService.updateMyProfile(profileData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(userKeys.currentProfile(), updatedProfile);
    },
    onError: (error) => {
      console.error('Update profile failed:', error);
    },
  });

  const updateProfile = (profileData: UpdateProfileRequest) => {
    return updateProfileMutation.mutateAsync(profileData);
  };

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    mutation: updateProfileMutation,
  };
}

// Admin hooks for user management
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Create user failed:', error);
    },
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => userService.updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Update user failed:', error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete user failed:', error);
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.suspendUser(userId),
    onSuccess: (updatedUser) => {
      const userId = updatedUser.id;
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Suspend user failed:', error);
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: (updatedUser) => {
      const userId = updatedUser.id;
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Activate user failed:', error);
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'super_admin' | 'admin' | 'guest' }) =>
      userService.updateUserRole(userId, role),
    onSuccess: (updatedUser) => {
      const userId = updatedUser.id;
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Update user role failed:', error);
    },
  });
}