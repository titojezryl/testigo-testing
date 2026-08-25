import { apiClient } from './client';
import {
  SignInRequest,
  SignUpRequest,
  AuthResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  AuthTokens,
  User
} from './types';

export class AuthService {
  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    
    // Store tokens in localStorage
    if (response.success && response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }
    
    return response.data;
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
    
    // Store tokens in localStorage
    if (response.success && response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }
    
    return response.data;
  }

  async signOut(): Promise<void> {
    try {
      await apiClient.post('/auth/signout');
    } finally {
      // Always clear local tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', request);
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<void> {
    await apiClient.post('/auth/update-password', request);
  }

  async refreshToken(): Promise<AuthTokens | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return null;

      const response = await apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data.tokens) {
        localStorage.setItem('auth_token', response.data.tokens.accessToken);
        localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
        return response.data.tokens;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email });
  }

  // OAuth methods for external providers
  async getOAuthUrl(provider: 'google' | 'github' | 'auth0'): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/auth/oauth/${provider}`);
    return response.data.url;
  }

  async handleOAuthCallback(code: string, state: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/oauth/callback', { code, state });
    
    // Store tokens in localStorage
    if (response.success && response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }
    
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }
}

export const authService = new AuthService();