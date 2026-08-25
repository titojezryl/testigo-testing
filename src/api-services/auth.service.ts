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
import { sessionStorageService } from './session-storage.service';
import { TokenUtils } from './token.utils';

export class AuthService {
  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // response.data is the AuthResponse { user, tokens }
    const authData = response.data;

    // Store tokens using SessionStorageService
    if (authData.tokens) {
      sessionStorageService.storeTokens(authData.tokens);
      apiClient.setAuthToken(authData.tokens.accessToken);
      apiClient.setRefreshToken(authData.tokens.refreshToken);
    }

    return authData;
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);

      // response.data is the AuthResponse { user, tokens }
      const authData = response.data;

      // Store tokens using SessionStorageService
      if (authData.tokens) {
        sessionStorageService.storeTokens(authData.tokens);
        apiClient.setAuthToken(authData.tokens.accessToken);
        apiClient.setRefreshToken(authData.tokens.refreshToken);
      }

      return authData;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Get the refresh token before clearing it
      const refreshToken = sessionStorageService.getRefreshToken();

      // Get current user to get userId
      if (refreshToken && this.isAuthenticated()) {
        try {
          const user = await this.getCurrentUser();
          await apiClient.post('/auth/logout', {
            userId: user.id,
            refreshToken: refreshToken
          });
        } catch (error) {
          // If getting user fails, still try to logout with what we have
          console.warn('Failed to get user for logout:', error);
        }
      }
    } finally {
      // Always clear session data
      sessionStorageService.clearSession();
      apiClient.removeAuthToken();
      apiClient.removeRefreshToken();
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
      const refreshToken = apiClient.getRefreshToken();
      if (!refreshToken) return null;

      const response = await apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data.tokens) {
        apiClient.setAuthToken(response.data.tokens.accessToken);
        apiClient.setRefreshToken(response.data.tokens.refreshToken);
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

    // Store tokens using SessionStorageService
    if (response.success && response.data.tokens) {
      sessionStorageService.storeTokens(response.data.tokens);
      apiClient.setAuthToken(response.data.tokens.accessToken);
      apiClient.setRefreshToken(response.data.tokens.refreshToken);
    }

    return response.data;
  }

  // Check if user is authenticated with session validation
  isAuthenticated(): boolean {
    return sessionStorageService.isSessionValid();
  }

  // Get current auth token with validation
  getAuthToken(): string | null {
    const tokens = sessionStorageService.getTokens();
    if (!tokens) return null;

    // Return null if token is expired
    if (TokenUtils.isTokenExpired(tokens.accessToken)) {
      return null;
    }

    return tokens.accessToken;
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }
}

export const authService = new AuthService();