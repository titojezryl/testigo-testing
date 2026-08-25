export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  roles: 'super_admin' | 'admin' | 'manager' | 'user';
  status: 'active' | 'suspended';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenMetadata {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: number;  // Unix timestamp (milliseconds)
  refreshTokenExp: number; // Unix timestamp (milliseconds)
  issuedAt: number;        // Unix timestamp (milliseconds)
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  token: string;
  password: string;
}

export interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: 'super_admin' | 'admin' | 'manager' | 'user';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  roles?: 'super_admin' | 'admin' | 'manager' | 'user';
  status?: 'active' | 'suspended';
}

export interface UpdateProfileRequest {
  bio?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  isActionColumn?: boolean;
  width?: string;
}

export interface TableState {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
