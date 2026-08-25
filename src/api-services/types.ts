// User and Authentication related types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: 'super_admin' | 'admin' | 'guest';
  status: 'active' | 'suspended';
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

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
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

// File and Storage related types
export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  fileUrl: string;
  fields?: Record<string, string>;
}

// API Response wrappers
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

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Request/Response transformers
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'guest';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  status?: 'active' | 'suspended';
  role?: 'super_admin' | 'admin' | 'guest';
}

export interface UpdateProfileRequest {
  bio?: string;
}