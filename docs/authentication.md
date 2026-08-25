# Authentication System Documentation

This document explains how authentication works in this frontend-only React application using external API and JWT tokens.

## Overview

The project uses **External API Authentication** with JWT (JSON Web Tokens) for authentication. The frontend consumes a backend API that handles authentication, session management, and user data. All authentication tokens are stored in localStorage and managed through a centralized API service layer with TanStack Query for state management.

## Architecture Components

### 1. Authentication Service (`src/api-services/auth.service.ts`)

```typescript
export class AuthService {
  async signIn(credentials: SignInRequest): Promise<AuthResponse>
  async signUp(userData: SignUpRequest): Promise<AuthResponse>
  async signOut(): Promise<void>
  async resetPassword(request: ResetPasswordRequest): Promise<void>
  async updatePassword(request: UpdatePasswordRequest): Promise<void>
  async refreshToken(): Promise<AuthTokens | null>
  async getCurrentUser(): Promise<User>
  async verifyEmail(token: string): Promise<void>
  async resendVerificationEmail(email: string): Promise<void>
  async getOAuthUrl(provider: 'google' | 'github' | 'auth0'): Promise<string>
  async handleOAuthCallback(code: string, state: string): Promise<AuthResponse>
  isAuthenticated(): boolean
  getAuthToken(): string | null
}
```

**Key Features:**

- JWT-based authentication with access and refresh tokens
- Email and password authentication
- OAuth support for external providers (Google, GitHub, Auth0)
- Token refresh mechanism
- Session persistence in localStorage
- Type-safe API interface

### 2. React Hook (`src/hooks/api/use-auth.ts`)

```typescript
export function useAuth() {
  return {
    user,             // Current user object or null
    isAuthenticated,  // Boolean authentication status
    isLoading,        // Loading state for initial auth check
    signIn,           // Function to sign in
    signUp,           // Function to sign up
    signOut,          // Function to sign out
    isSigningIn,      // Loading state for sign in
    isSigningUp,      // Loading state for sign up
    isSigningOut,     // Loading state for sign out
  };
}
```

**Usage:**

```typescript
import { useAuth } from '~/hooks/api';

function MyComponent() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => signIn({ email, password })}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome {user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. HTTP Client (`src/api-services/client.ts`)

```typescript
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add auth token to all requests
    this.client.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: Handle 401 errors and token refresh
    this.client.interceptors.response.use(
      response => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          const newToken = await this.refreshAuthToken();
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return this.client(error.config);
          }
          this.handleAuthFailure();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }
}
```

**Features:**

- Automatic token injection from localStorage
- Token refresh on 401 errors
- Automatic redirect to login on auth failure
- Centralized error handling

## Authentication Flow

### 1. Sign-In Flow

```
User enters credentials → signIn() → auth.service.signIn() → POST /auth/signin
                                                          ↓
                                                    External API validates
                                                          ↓
                                                    Returns JWT tokens
                                                          ↓
                                                Tokens stored in localStorage
                                                          ↓
                                                    User data updated
                                                          ↓
                                                    Redirect to dashboard
```

**Implementation:**

```typescript
// In sign-in route
const { signIn, isSigningIn } = useAuth();
const router = useRouter();

const onSubmit = async (data: SignInForm) => {
  try {
    await signIn(data);
    router.navigate({ to: "/dashboard" });
  } catch (error) {
    setAuthError(error.message);
  }
};
```

### 2. Sign-Up Flow

```
User fills registration form → signUp() → auth.service.signUp() → POST /auth/signup
                                                                     ↓
                                                               External API creates user
                                                                     ↓
                                                               Returns JWT tokens
                                                                     ↓
                                                         Tokens stored in localStorage
                                                                     ↓
                                                           User data updated
                                                                     ↓
                                                         Redirect to home/dashboard
```

**Implementation:**

```typescript
const { signUp, isSigningUp } = useAuth();
const router = useRouter();

const onSubmit = async (data: SignUpForm) => {
  try {
    await signUp(data);
    router.navigate({ to: "/dashboard" });
  } catch (error) {
    setAuthError(error.message);
  }
};
```

### 3. Sign-Out Flow

```
User clicks sign out → signOut() → auth.service.signOut() → POST /auth/signout
                                                               ↓
                                                     Clear localStorage tokens
                                                               ↓
                                                    Clear TanStack Query cache
                                                               ↓
                                                   Redirect to home page
```

**Implementation:**

```typescript
const { signOut } = useAuth();
const router = useRouter();

const handleSignOut = async () => {
  await signOut();
  router.navigate({ to: "/" });
};
```

### 4. Token Refresh Flow

```
API request fails with 401 → Interceptor catches 401 → Call auth.service.refreshToken()
                                                                    ↓
                                                            POST /auth/refresh
                                                                    ↓
                                                             Returns new access token
                                                                    ↓
                                                        Store new token in localStorage
                                                                    ↓
                                                    Retry original request with new token
```

**Automatic Process:**

The token refresh is handled automatically by the HTTP client interceptor. If a refresh fails, the user is redirected to the sign-in page.

## Token Storage

### Token Keys

- **Access Token**: `auth_token` - Stored in localStorage
- **Refresh Token**: `refresh_token` - Stored in localStorage

### Token Lifecycle

```
Sign In/Sign Up      → Create tokens and store in localStorage
API Requests         → Access token sent in Authorization header
Token Expires (401)  → Use refresh token to get new access token
Refresh Fails        → Clear tokens and redirect to sign-in
Sign Out             → Clear tokens from localStorage
```

## Type Definitions

### User Type

```typescript
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
```

### Authentication Requests/Responses

```typescript
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

## Protected Routes

### Using useAuth Hook

Protected routes can check authentication status using the `useAuth` hook:

```typescript
export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <DashboardContent />;
}
```

### Route-level Protection

For route-level protection, use TanStack Router's `beforeLoad`:

```typescript
export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      });
    }
  },
  component: Dashboard,
});
```

## OAuth Integration

The authentication service supports OAuth providers:

```typescript
const { signIn } = useAuth();

// Get OAuth URL
const oauthUrl = await authService.getOAuthUrl('google');

// Handle OAuth callback
await authService.handleOAuthCallback(code, state);
```

**Supported Providers:**
- Google
- GitHub
- Auth0
- Custom OAuth providers

## User Profile Management

### Update Profile

```typescript
import { useUpdateProfile } from '~/hooks/api';

function ProfileForm() {
  const updateProfile = useUpdateProfile();

  const handleSubmit = (bio: string) => {
    updateProfile.mutate({ userId: user.id, bio });
  };
}
```

### Update Avatar

```typescript
import { useUpdateAvatar } from '~/hooks/api';

function AvatarUpload() {
  const updateAvatar = useUpdateAvatar();

  const handleFileChange = (file: File) => {
    updateAvatar.mutate({ userId: user.id, file });
  };
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# External API Configuration
VITE_API_BASE_URL="http://localhost:8000/api"

# External Authentication
VITE_AUTH_PROVIDER_URL="https://your-auth-provider.com"
VITE_AUTH_CLIENT_ID=""
VITE_AUTH_CALLBACK_URL="http://localhost:3000/auth/callback"
```

## External API Requirements

Your backend API must provide the following endpoints:

### Authentication Endpoints

- `POST /auth/signin` - User sign in
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User sign out
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/verify-email` - Verify email
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/reset-password` - Request password reset
- `POST /auth/update-password` - Update password

### OAuth Endpoints

- `GET /auth/oauth/{provider}` - Get OAuth URL
- `POST /auth/oauth/callback` - Handle OAuth callback

### Expected Response Format

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

## Common Patterns

### 1. Using Authentication State

```typescript
import { useAuth } from '~/hooks/api';

function Header() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  if (isLoading) return <Skeleton />;
  if (!isAuthenticated) return <SignInButton />;

  return (
    <div>
      <UserAvatar name={user.name} />
      <DropdownMenu>
        <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
```

### 2. Displaying User Information

```typescript
function UserProfile() {
  const { user } = useAuth();

  return (
    <Card>
      <UserAvatar name={user.name} image={user.image} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Badge>{user.role}</Badge>
    </Card>
  );
}
```

### 3. Handling Authentication Errors

```typescript
const { signIn } = useAuth();

const handleSubmit = async (data: SignInForm) => {
  try {
    await signIn(data);
    toast.success('Welcome back!');
  } catch (error) {
    if (error.message.includes('Invalid credentials')) {
      setError('Invalid email or password');
    } else if (error.message.includes('Account not verified')) {
      setError('Please verify your email address');
    } else {
      setError('An error occurred. Please try again.');
    }
  }
};
```

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage are accessible via JavaScript. For production, consider using httpOnly cookies (if your backend API supports them).

2. **HTTPS**: Always use HTTPS in production to prevent token interception.

3. **Token Expiration**: Access tokens should have a short expiration time (e.g., 15-30 minutes). Refresh tokens should have a longer expiration (e.g., 7-30 days).

4. **CORS**: Ensure your backend API allows CORS from your frontend domain.

5. **CSRF Protection**: Your backend API should implement CSRF protection, especially for state-changing operations.

## Troubleshooting

### Common Issues

1. **"No token" errors**: Ensure the user is authenticated before making API requests.

2. **Authentication loops**: Check redirect logic and token storage.

3. **Token not refreshing**: Verify `/auth/refresh` endpoint is working correctly.

4. **401 errors after refresh**: Check if the refresh token is valid and not expired.

5. **Type errors**: Ensure all types are properly imported from `~/api-services/types`.

### Debug Tools

```typescript
// Check authentication status
const { isAuthenticated, user } = useAuth();
console.log('Is authenticated:', isAuthenticated);
console.log('User:', user);

// Check stored tokens
console.log('Access token:', localStorage.getItem('auth_token'));
console.log('Refresh token:', localStorage.getItem('refresh_token'));
```

## Migration from Better Auth

If you're migrating from Better Auth to this external API authentication:

1. Remove Better Auth dependencies
2. Update all components to use `useAuth()` hook instead of `authClient`
3. Replace server-side auth checks with token-based checks
4. Update API calls to use the new api-services layer
5. Test authentication flows thoroughly

This authentication system provides a clean, secure foundation for user management with type safety throughout the application, while consuming external APIs for all backend functionality.
