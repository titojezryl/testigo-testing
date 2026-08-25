import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUserFn, updateUserFn, suspendUserFn } from "~/fn/users";
import {
  adminCreateUserFn,
  adminUpdateUserFn,
  adminUpdateUserStatusFn,
  adminUpdateUserRoleFn,
  adminSuspendUserFn,
  adminUnsuspendUserFn,
  resetUserPasswordFn,
} from "~/fn/admin";
import {
  currentUserQueryOptions,
  userQueryOptions,
  adminUserQueryOptions,
  listUsersQueryOptions,
  adminListUsersQueryOptions,
  userKeys,
  type UserListFilters,
} from "~/queries/users";

/**
 * Hook for fetching the current authenticated user
 * Returns user data including role for permission checks
 */
export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}

/**
 * Hook for fetching a single user by ID (public profile)
 * Returns user data without email
 */
export function useUser(userId: string) {
  return useQuery(userQueryOptions(userId));
}

/**
 * Hook for fetching a single user by ID (admin view)
 * Returns complete user data including email
 */
export function useAdminUser(userId: string) {
  return useQuery(adminUserQueryOptions(userId));
}

/**
 * Hook for fetching paginated list of users
 * Supports filtering by status, role, search, and sorting
 */
export function useListUsers(filters: UserListFilters = {}) {
  return useQuery(listUsersQueryOptions(filters));
}

/**
 * Hook for fetching paginated list of users (admin view)
 * Provides complete user data for admin management
 */
export function useAdminListUsers(filters: UserListFilters = {}) {
  return useQuery(adminListUsersQueryOptions(filters));
}

/**
 * Hook for creating a new user (admin only)
 * Invalidates user list queries on success
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserFn,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}

/**
 * Hook for creating a new user via admin endpoint
 * Invalidates user list queries on success
 */
export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminCreateUserFn,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}

/**
 * Hook for updating a user (admin only)
 * Invalidates both list and detail queries on success
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserFn,
    onSuccess: (data) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
}

/**
 * Hook for updating a user via admin endpoint
 * Invalidates both list and detail queries on success
 */
export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateUserFn,
    onSuccess: (data) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
}

/**
 * Hook for updating user status (active/suspended)
 * Invalidates both list and detail queries on success
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateUserStatusFn,
    onSuccess: (data) => {
      const statusMessage =
        data.status === "suspended" ? "User suspended" : "User activated";
      toast.success(statusMessage);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}

/**
 * Hook for updating user role
 * Invalidates both list and detail queries on success
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUpdateUserRoleFn,
    onSuccess: (data) => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
}

/**
 * Hook for suspending a user account
 * Invalidates both list and detail queries on success
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendUserFn,
    onSuccess: (data) => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to suspend user");
    },
  });
}

/**
 * Hook for suspending a user via admin endpoint
 * Invalidates both list and detail queries on success
 */
export function useAdminSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminSuspendUserFn,
    onSuccess: (data) => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to suspend user");
    },
  });
}

/**
 * Hook for unsuspending (reactivating) a user account
 * Invalidates both list and detail queries on success
 */
export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUnsuspendUserFn,
    onSuccess: (data) => {
      toast.success("User reactivated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reactivate user");
    },
  });
}

/**
 * Hook for resetting a user's password (super_admin only)
 * Wraps the resetUserPasswordFn server function with:
 * - Optimistic updates for UI responsiveness
 * - Toast notifications for success/failure feedback
 * - Query cache invalidation for user detail and list queries
 */
export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetUserPasswordFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches for the user being updated
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(variables.data.userId),
      });

      // Snapshot the previous value for potential rollback
      const previousUser = queryClient.getQueryData(
        userKeys.detail(variables.data.userId)
      );

      return { previousUser };
    },
    onSuccess: (_data, variables) => {
      toast.success("Password has been reset successfully");
      // Invalidate user detail query to refresh any cached data
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.data.userId),
      });
      // Invalidate user lists in case any list views need refreshing
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: Error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.data.userId),
          context.previousUser
        );
      }
      toast.error(error.message || "Failed to reset password");
    },
  });
}
