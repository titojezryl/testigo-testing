import { queryOptions } from "@tanstack/react-query";
import { getCurrentUserFn, getUserByIdFn, listUsersFn } from "~/fn/users";
import { adminGetUserFn, adminListUsersFn } from "~/fn/admin";
import type { UserRole, UserStatus } from "~/db/schema";

/**
 * Options for filtering and paginating user queries
 */
export type UserListFilters = {
  page?: number;
  limit?: number;
  status?: UserStatus;
  role?: UserRole;
  isAdmin?: boolean;
  search?: string;
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

/**
 * Query key factory for user management
 * Provides type-safe, hierarchical query keys for optimal cache management
 */
export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserListFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
};

/**
 * Query options for fetching the current authenticated user
 * Returns user data including role for permission checks
 */
export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.current(),
    queryFn: () => getCurrentUserFn(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query options for fetching a single user by ID (authenticated users)
 * Returns public user data without email
 */
export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserByIdFn({ data: { userId } }),
    enabled: !!userId,
  });

/**
 * Query options for fetching a single user by ID (admin only)
 * Returns complete user data including email
 */
export const adminUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...userKeys.detail(userId), "admin"] as const,
    queryFn: () => adminGetUserFn({ data: { userId } }),
    enabled: !!userId,
  });

/**
 * Query options for listing users with filtering and pagination
 * Used by admin panel for user management
 */
export const listUsersQueryOptions = (filters: UserListFilters = {}) =>
  queryOptions({
    queryKey: userKeys.list(filters),
    queryFn: () => listUsersFn({ data: filters }),
  });

/**
 * Query options for admin listing users with filtering and pagination
 * Provides complete user data for admin management
 */
export const adminListUsersQueryOptions = (filters: UserListFilters = {}) =>
  queryOptions({
    queryKey: [...userKeys.list(filters), "admin"] as const,
    queryFn: () => adminListUsersFn({ data: filters }),
  });
