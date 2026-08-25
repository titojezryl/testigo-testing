# Frontend-Only Architecture Guide

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
- `src/hooks/` - Reusable client-side hooks

**Example**: `src/hooks/api/use-users.ts`

```typescript
export function useGetUsers(search?: string) {
  return useQuery({
    queryKey: ["users", search],
    queryFn: () => userService.getUsers({ search }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
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
  }
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

1. User enters credentials in `/sign-in`
2. Component calls `useLogin()` hook
3. Hook calls `authService.login()`
4. Service makes HTTP POST to `/auth/login`
5. External API validates and returns JWT tokens
6. Token stored in localStorage
7. User redirected to `/dashboard`

**Token Refresh Flow**:

1. HTTP interceptor detects 401 error
2. Interceptor calls `authService.refreshToken()`
3. Service makes HTTP POST to `/auth/refresh`
4. External API returns new access token
5. Old request retried with new token
6. If refresh fails, redirect to login

## Service Modules

### Authentication Service (`auth.service.ts`)

Operations:
- `login(email, password)` - User login
- `logout()` - User logout
- `register(data)` - User registration
- `refreshToken()` - Refresh access token
- `resetPassword(email)` - Password reset request
- `confirmResetPassword(token, password)` - Complete password reset

### User Service (`user.service.ts`)

Operations:
- `getUsers(params)` - List users with pagination/search
- `getUserById(userId)` - Get single user
- `currentUser()` - Get current authenticated user
- `createUser(data)` - Create new user (admin)
- `updateUser(userId, data)` - Update user profile
- `deleteUser(userId)` - Delete user (admin)
- `updateAvatar(userId, file)` - Upload user avatar

### Storage Service (`storage.service.ts`)

Operations:
- `getPresignedUploadUrl(key, options)` - Get upload URL
- `uploadFile(file, onProgress)` - Upload file with progress
- `downloadFile(key)` - Get download URL
- `deleteFile(key)` - Delete file
- `getFiles(params)` - List files

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

- **Access Token**: Stored in localStorage with key `access_token`
- **Refresh Token**: Stored in localStorage with key `refresh_token`
- **Token Expiry**: Tokens validated on each request

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
        file.type
      );
      return storageService.uploadFile(uploadUrl, file);
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
  });
}
```

## External API Integration

### Required External Services

1. **Backend API**: RESTful API for authentication, users, and business logic
2. **Authentication Provider**: OAuth/JWT provider (optional, can be part of backend API)
3. **Storage Service**: S3-compatible storage for file uploads

### API Contract Types

All API contracts are defined in `src/api-services/types.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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
VITE_API_BASE_URL="https://your-api.com/api"
VITE_AUTH_PROVIDER_URL="https://your-auth.com"
VITE_AUTH_CLIENT_ID="your-client-id"
VITE_AUTH_CALLBACK_URL="https://your-app.com/auth/callback"
VITE_STORAGE_BASE_URL="https://your-storage.com"
VITE_STORAGE_BUCKET="your-bucket"
```

## Benefits of Frontend-Only Architecture

1. **Portability**: Deploy anywhere static assets can be hosted
2. **Simplicity**: No server-side code to maintain
3. **Scalability**: Leverage CDN for global distribution
4. **Separation**: Clear separation between frontend and backend concerns
5. **Flexibility**: Easy to swap backend providers without frontend changes
6. **Developer Experience**: Fast local development, no backend setup required
7. **Cost**: Lower hosting costs (static hosting vs server hosting)

This frontend-only architecture provides a clean, maintainable codebase that can be deployed rapidly to millions of users while consuming powerful external APIs for all backend functionality.
