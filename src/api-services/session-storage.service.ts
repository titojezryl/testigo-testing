import type { TokenMetadata, AuthTokens } from './types';
import { TokenUtils } from './token.utils';

export class SessionStorageService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_METADATA_KEY = 'token_metadata';
  private static readonly SESSION_START_KEY = 'session_start';
  private static readonly LAST_ACTIVITY_KEY = 'last_activity';

  /**
   * Store tokens with metadata
   * @param tokens - Auth tokens to store
   */
  static storeTokens(tokens: AuthTokens): void {
    const accessTokenExp = TokenUtils.getTokenExpiry(tokens.accessToken);
    const refreshTokenExp = TokenUtils.getTokenExpiry(tokens.refreshToken);

    if (!accessTokenExp || !refreshTokenExp) {
      throw new Error('Invalid token format: missing expiration');
    }

    const metadata: TokenMetadata = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExp,
      refreshTokenExp,
      issuedAt: Date.now()
    };

    // localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    // localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.TOKEN_METADATA_KEY, JSON.stringify(metadata));
    localStorage.setItem(this.SESSION_START_KEY, Date.now().toString());
    localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
  }

  /**
   * Get stored tokens
   * @returns Auth tokens or null if not found
   */
  static getTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  /**
   * Get token metadata
   * @returns Token metadata or null if not found
   */
  static getTokenMetadata(): TokenMetadata | null {
    const metadata = localStorage.getItem(this.TOKEN_METADATA_KEY);
    return metadata ? JSON.parse(metadata) : null;
  }

  /**
   * Check if session is valid
   * @returns true if session is valid
   */
  static isSessionValid(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;

    // Check access token expiration
    if (TokenUtils.isTokenExpired(tokens.accessToken)) {
      // Check if refresh token is also expired
      if (TokenUtils.isTokenExpired(tokens.refreshToken)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update last activity timestamp
   */
  static updateLastActivity(): void {
    localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
  }

  /**
   * Get last activity timestamp
   * @returns Last activity timestamp in milliseconds
   */
  static getLastActivity(): number {
    const lastActivity = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    return lastActivity ? parseInt(lastActivity, 10) : 0;
  }

  /**
   * Get session duration in milliseconds
   * @returns Session duration in milliseconds
   */
  static getSessionDuration(): number {
    const sessionStart = localStorage.getItem(this.SESSION_START_KEY);
    if (!sessionStart) return 0;

    return Date.now() - parseInt(sessionStart, 10);
  }

  /**
   * Clear all session data
   */
  static clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_METADATA_KEY);
    localStorage.removeItem(this.SESSION_START_KEY);
    localStorage.removeItem(this.LAST_ACTIVITY_KEY);
  }

  /**
   * Get time until session expires in milliseconds
   * @returns Time until expiry in milliseconds
   */
  static getTimeUntilSessionExpiry(): number {
    const tokens = this.getTokens();
    if (!tokens) return 0;

    const accessTokenTime = TokenUtils.getTimeUntilExpiry(tokens.accessToken);
    const refreshTokenTime = TokenUtils.getTimeUntilExpiry(tokens.refreshToken);

    // Return the shorter of the two
    return Math.min(accessTokenTime, refreshTokenTime);
  }

  /**
   * Check if user has been inactive for a given duration
   * @param timeoutMs - Timeout in milliseconds
   * @returns true if inactive for longer than timeout
   */
  static isInactive(timeoutMs: number): boolean {
    const lastActivity = this.getLastActivity();
    if (lastActivity === 0) return false;
    return Date.now() - lastActivity > timeoutMs;
  }

  /**
   * Get access token
   * @returns Access token or null
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   * @returns Refresh token or null
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set access token
   * @param token - Access token
   */
  static setAccessToken(token: string): void {
    const tokens = this.getTokens();
    if (tokens) {
      this.storeTokens({ ...tokens, accessToken: token });
    }
  }

  /**
   * Set refresh token
   * @param token - Refresh token
   */
  static setRefreshToken(token: string): void {
    const tokens = this.getTokens();
    if (tokens) {
      this.storeTokens({ ...tokens, refreshToken: token });
    }
  }
}

export const sessionStorageService = SessionStorageService;

