# Frontend Layered Architecture Guide

This document explains the frontend-only architecture pattern used in this TanStack Router application. The architecture is designed for maximum portability and deployment flexibility, consuming external APIs for all backend functionality.

## Architecture Overview

The application follows a client-side-only architecture with a clean separation between the UI layer and the API service layer:

```
Routes → Components → Hooks (TanStack Query) → API Services → External APIs
```

## Layer Definitions

### 1. Routes Layer (`src/routes/`)

**Purpose**: File-based client-side routing with TanStack Router.

**Responsibilities**:

- Define URL structure and parameters
- Handle route-level state and navigation
- Compose page components
- Prefetch data using loaders (optional, client-side)

**Example**: `src/routes/dashboard/index.tsx`

```typescript
export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: users } = useGetUsers(); // Hook for data fetching
  return <UserList users={users} />;
}
```

### 2. Components Layer (`src/components/`)

**Purpose**: Reusable UI components using Radix UI and Tailwind CSS.

**Responsibilities**:

- Render UI elements
- Handle user interactions
- Manage local component state (UI state only)
- Use hooks for data fetching and mutations

**Example**: `src/components/CreateUserDialog.tsx`

```typescript
export function CreateUserDialog() {
  const createUser = useCreateUser(); // Hook from API layer
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* UI form implementation */}
    </Dialog>
  );
}
```

### 3. Hooks Layer (`src/hooks/`)

**Purpose**: Custom React hooks that bridge UI components with API services using TanStack Query.

**Responsibilities**:

- Wrap API service methods with TanStack Query
- Provide caching, refetching, and optimistic updates
- Handle loading states and error messages
- Manage authentication state

**Directory Structure**:

- `src/hooks/api/` - TanStack Query hooks for API operations
  - `use-auth.ts` - Authentication state and operations
  - `use-users.ts` - User data queries and mutations
  - `use-storage.ts` - File upload/download operations
- `src/hooks/` - Reusable client-side hooks (navigation, etc.)

**Example**: `src/hooks/api/use-users.ts`

```typescript
export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => userService.createUser(data),
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}
```

### 4. API Services Layer (`src/api-services/`)

**Purpose**: Centralized HTTP client and service modules for external API communication.

**Responsibilities**:

- Configure HTTP client with interceptors
- Manage authentication tokens
- Define TypeScript interfaces for API contracts
- Implement domain-specific service modules
- Handle error responses and transformations

**Directory Structure**:

- `client.ts` - Base axios configuration with interceptors
- `types.ts` - TypeScript types and interfaces
- `auth.service.ts` - Authentication operations
- `user.service.ts` - User management operations
- `storage.service.ts` - File upload/download operations

**Example**: `src/api-services/user.service.ts`

```typescript
export const userService = {
  getUsers: async (params?: GetUsersParams) => {
    const response = await client.get<User[]>("/users", { params });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await client.get<User>(`/users/${userId}`);
    return response.data;
  },

  createUser: async (data: CreateUserInput) => {
    const response = await client.post<User>("/users", data);
    return response.data;
  },

  updateUser: async (userId: string, data: UpdateUserInput) => {
    const response = await client.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    await client.delete(`/users/${userId}`);
  },
};
```

### 5. HTTP Client (`src/api-services/client.ts`)

**Purpose**: Centralized axios instance with interceptors for authentication and error handling.

**Features**:

- Automatic token injection from localStorage
- Token refresh logic
- Global error handling
- Request/response logging (dev mode)
- Base URL configuration

**Example**: `src/api-services/client.ts`

```typescript
const client = axios.create({
  baseURL: publicEnv.API_BASE_URL,
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return client.request(error.config);
      }
      // Redirect to login
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);
```

## Data Flow Patterns

### Query Pattern (Fetching Data)

```
Route → Component → Hook (useQuery) → Service → HTTP Client → External API
```

**Example Flow**:

1. User navigates to `/dashboard`
2. Route renders `Dashboard` component
3. Component calls `useGetUsers()` hook
4. Hook uses TanStack Query to cache results
5. Hook calls `userService.getUsers()`
6. Service makes HTTP GET request via axios
7. External API returns user data
8. Data flows back through layers and is displayed

### Mutation Pattern (Creating/Updating Data)

```
Route → Component → Hook (useMutation) → Service → HTTP Client → External API
```

**Example Flow**:

1. User fills out form to create a new user
2. Form calls `useCreateUser().mutate(data)`
3. Hook makes request via `userService.createUser()`
4. Service makes HTTP POST request via axios
5. External API creates user and returns data
6. Hook invalidates relevant queries (refetches data)
7. Success message is displayed

### Authentication Flow

**Login Flow**:

1. User enters credentials in `/sign-in` route
2. Component calls `useAuth().signIn()` hook
3. Hook calls `authService.signIn()`
4. Service makes HTTP POST to `/auth/signin`
5. External API validates and returns JWT tokens
6. Tokens stored in localStorage (`auth_token` and `refresh_token`)
7. User data updated and cached in TanStack Query
8. User redirected to `/dashboard`

**Token Refresh Flow**:

1. HTTP interceptor detects 401 error
2. Interceptor calls `authService.refreshToken()`
3. Service makes HTTP POST to `/auth/refresh`
4. External API returns new access token
5. New token stored in localStorage
6. Original request retried with new token
7. If refresh fails, tokens cleared and redirect to `/sign-in`

## Service Modules

### Authentication Service (`auth.service.ts`)

Operations:

- `signIn(credentials)` - User sign in with email/password
- `signUp(userData)` - User registration
- `signOut()` - User logout
- `refreshToken()` - Refresh access token
- `resetPassword(email)` - Password reset request
- `updatePassword(token, password)` - Complete password reset
- `getCurrentUser()` - Get current authenticated user
- `getOAuthUrl(provider)` - Get OAuth URL for external providers
- `handleOAuthCallback(code, state)` - Handle OAuth callback
- `isAuthenticated()` - Check if user is authenticated
- `getAuthToken()` - Get current auth token

### User Service (`user.service.ts`)

Operations:

- `getUsers(params)` - List users with pagination, search, and filtering
- `getUserById(userId)` - Get single user by ID
- `getCurrentUser()` - Get current authenticated user
- `createUser(data)` - Create new user (admin function)
- `updateUser(userId, data)` - Update user profile and role
- `updateProfile(userId, bio)` - Update user profile bio
- `deleteUser(userId)` - Delete user (admin function)
- `searchUsers(query)` - Search users by name or email
- `updateAvatar(userId, file)` - Upload user avatar with progress tracking

### Storage Service (`storage.service.ts`)

Operations:

- `getPresignedUploadUrl(key, contentType, expiresIn)` - Get presigned upload URL
- `uploadFile(file, onProgress)` - Upload file with progress tracking
- `getFileMetadata(key)` - Get file metadata and details
- `getFiles(params)` - List files with pagination and filtering
- `getDownloadUrl(key, expiresIn)` - Get download URL with expiration
- `deleteFile(key)` - Delete file from storage
- `validateFile(file, allowedTypes, maxSizeInMB)` - Validate file before upload

## Best Practices

### When to Use Each Layer

- **Routes**: Only for routing logic and page composition
- **Components**: For UI rendering and local state (form inputs, modals, etc.)
- **Hooks**: For all server state management via TanStack Query
- **Services**: For API-specific logic and HTTP operations
- **Client**: For global HTTP configuration and interceptors

### Error Handling Guidelines

1. **Services**: Return error data from API responses
2. **Hooks**: Convert errors to user-friendly messages via toast
3. **Components**: Display error states from hooks (isError property)
4. **Client**: Handle authentication errors (401) globally

### Caching Strategies

1. **Stale Time**: Set appropriate stale times for different data types
2. **Query Invalidation**: Invalidate after mutations using query keys
3. **Prefetching**: Prefetch data in route loaders when beneficial
4. **Optimistic Updates**: Use for better UX on destructive operations

### Type Safety

1. **API Contracts**: Define all API request/response types in `types.ts`
2. **Service Methods**: Ensure typed parameters and return values
3. **Hook Parameters**: Use TypeScript for all hook inputs
4. **Component Props**: Type all component props with clear interfaces

## Authentication Management

### Token Storage

- **Access Token**: Stored in localStorage with key `auth_token`
- **Refresh Token**: Stored in localStorage with key `refresh_token`
- **Token Expiry**: Tokens validated on each request
- **Automatic Refresh**: HTTP interceptor handles 401 errors and token refresh

### Protected Routes

Protected routes use the `useAuth()` hook:

```typescript
export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
  beforeLoad: () => {
    const token = getToken();
    if (!token) {
      throw redirect({ to: "/sign-in" });
    }
  },
});
```

### Session Persistence

Tokens persist across page reloads via localStorage. On app initialization, the token is loaded and used for all API requests.

## File Upload Pattern

File uploads use presigned URLs from external storage:

```typescript
export function useFileUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const key = `uploads/${Date.now()}_${file.name}`;
      const uploadUrl = await storageService.getPresignedUploadUrl(
        key,
        file.type,
      );
      return storageService.uploadFile(uploadUrl, file);
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
  });
}
```

## Current Implementation

### Hooks Available

The application provides the following React hooks for data fetching and state management:

**Authentication Hooks** (`src/hooks/api/use-auth.ts`)

```typescript
const {
  user, // Current user object or null
  isAuthenticated, // Boolean authentication status
  isLoading, // Loading state for initial auth check
  signIn, // Function to sign in
  signUp, // Function to sign up
  signOut, // Function to sign out
  isSigningIn, // Loading state for sign in
  isSigningUp, // Loading state for sign up
  isSigningOut, // Loading state for sign out
} = useAuth();
```

**User Hooks** (`src/hooks/api/use-users.ts`)

```typescript
// Queries
const { data: users, isLoading, error } = useUsers(params);
const { data: user, isLoading } = useUser(userId);
const { data: currentUser } = useCurrentUser();

// Mutations
const createUser = useCreateUser();
const updateUser = useUpdateUser();
const updateProfile = useUpdateProfile();
const deleteUser = useDeleteUser();
const searchUsers = useSearchUsers();
const updateAvatar = useUpdateAvatar();
```

**Storage Hooks** (`src/hooks/api/use-storage.ts`)

```typescript
// Queries
const { data: files } = useFiles(params);
const { data: fileMetadata } = useFileMetadata(key);

// Mutations
const uploadFile = useUploadFile();
const uploadWithProgress = useUploadWithProgress();
const deleteFile = useDeleteFile();
const getDownloadUrl = useDownloadUrl();
const validateFile = useValidateFile();
```

### Usage Examples

**Authentication in Components**

```typescript
import { useAuth } from '~/hooks/api';

function MyComponent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

**Protected Routes**

```typescript
import { useAuth } from '~/hooks/api';
import { Navigate } from '@tanstack/react-router';

function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  return <DashboardContent />;
}
```

## External API Integration

### Required External Services

1. **Backend API**: RESTful API for authentication, users, and business logic
2. **Authentication Provider**: OAuth/JWT provider (optional, can be part of backend API)
3. **Storage Service**: S3-compatible storage for file uploads

### API Endpoint Requirements

Your backend API must implement these endpoints:

**Authentication**

- `POST /auth/signin` - User sign in
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User sign out
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/reset-password` - Request password reset
- `POST /auth/update-password` - Update password
- `POST /auth/verify-email` - Verify email
- `POST /auth/resend-verification` - Resend verification email

**Users**

- `GET /users` - List users with pagination
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (admin)
- `PUT /users/:id` - Update user
- `PATCH /users/:id/profile` - Update profile
- `DELETE /users/:id` - Delete user (admin)
- `GET /users/search` - Search users
- `POST /users/:id/avatar` - Upload avatar

**Storage**

- `POST /storage/presigned-url` - Get presigned upload URL
- `GET /storage/files` - List files
- `GET /storage/files/:key` - Get file metadata
- `GET /storage/download-url` - Get download URL
- `DELETE /storage/files/:key` - Delete file

### API Contract Types

All API contracts are defined in `src/api-services/types.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "super_admin" | "admin" | "guest";
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: "super_admin" | "admin" | "guest";
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: "super_admin" | "admin" | "guest";
  status?: "active" | "suspended";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Deployment

This architecture produces static assets that can be deployed to any frontend hosting platform:

- **Vercel**: Automatic deployment from git
- **Netlify**: Simple drag-and-drop or git deployment
- **Cloudflare Pages**: High-performance CDN deployment
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for public projects

### Build Process

```bash
npm run build
```

This generates optimized static assets in the `dist/` directory.

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# External API Configuration
VITE_API_BASE_URL="http://localhost:8000/api"

# External Authentication (for OAuth providers)
VITE_AUTH_PROVIDER_URL="https://your-auth-provider.com"
VITE_AUTH_CLIENT_ID=""
VITE_AUTH_CALLBACK_URL="http://localhost:3000/auth/callback"

# External Storage (S3, Cloudflare R2, etc.)
VITE_STORAGE_BASE_URL="https://your-storage-service.com"
VITE_STORAGE_BUCKET=""

# Anthropic (for AI features, optional)
ANTHROPIC_API_KEY=""
```

### Response Format

All API endpoints should return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

For authentication endpoints:

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Login successful"
}
```

## Migration from Full-Stack

If you're migrating from a full-stack TanStack Start with Better Auth and Drizzle:

### Key Changes

1. **Removed Backend Components**
   - No more `src/db/` with Drizzle schema
   - No server-side API routes (`createServerFileRoute`)
   - No Better Auth middleware
   - No server functions (`createServerFn`)

2. **Added API Service Layer**
   - All data fetching now goes through `src/api-services/`
   - HTTP client with interceptors in `client.ts`
   - Domain-specific services for auth, users, storage
   - Type-safe API contracts in `types.ts`

3. **Updated State Management**
   - Components now use `useAuth()` hook instead of `authClient`
   - All queries use TanStack Query hooks
   - Automatic caching and invalidation via React Query

4. **Authentication Changes**
   - JWT tokens stored in localStorage (not cookies)
   - External API handles auth logic
   - No database connection from frontend
   - OAuth support for external providers

### Migration Checklist

- [ ] Remove Better Auth dependencies
- [ ] Delete `src/db/` directory
- [ ] Delete server routes (`createServerFileRoute`)
- [ ] Update components to use `useAuth()` hook
- [ ] Replace server functions with API service calls
- [ ] Set up external API environment variables
- [ ] Configure authentication with external provider
- [ ] Update all data fetching to use TanStack Query hooks
- [ ] Test authentication flows (sign in, sign up, sign out)
- [ ] Test token refresh mechanism
- [ ] Test file upload/download operations

## Benefits of Frontend-Only Architecture

1. **Portability**: Deploy anywhere static assets can be hosted
2. **Simplicity**: No server-side code to maintain
3. **Scalability**: Leverage CDN for global distribution
4. **Separation**: Clear separation between frontend and backend concerns
5. **Flexibility**: Easy to swap backend providers without frontend changes
6. **Developer Experience**: Fast local development, no backend setup required
7. **Cost**: Lower hosting costs (static hosting vs server hosting)
8. **Team Collaboration**: Frontend and backend teams can work independently
9. **Testing Simplification**: No need to mock server functions for tests
10. **Deployment Speed**: Instant deployments with CI/CD pipelines

## Quick Reference

### File Locations

| Layer      | Path                        | Purpose                     |
| ---------- | --------------------------- | --------------------------- |
| Routes     | `src/routes/`               | Page components and routing |
| Components | `src/components/`           | Reusable UI components      |
| Hooks      | `src/hooks/api/`            | TanStack Query hooks        |
| Services   | `src/api-services/`         | API communication layer     |
| Types      | `src/api-services/types.ts` | API contracts               |

### Common Imports

```typescript
// Authentication
import { useAuth } from "~/hooks/api";

// User operations
import { useUsers, useUser, useCreateUser } from "~/hooks/api";

// Storage operations
import { useUploadFile, useDeleteFile } from "~/hooks/api";

// Direct service access
import { authService, userService, storageService } from "~/api-services";

// Types
import type { User, AuthResponse, CreateUserInput } from "~/api-services";
```

This frontend-only architecture provides a clean, maintainable codebase that can be deployed rapidly to millions of users while consuming powerful external APIs for all backend functionality.
