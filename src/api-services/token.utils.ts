import type { DecodedToken } from './types';

export class TokenUtils {
  /**
   * Decode JWT token without verification
   * @param token - JWT token string
   * @returns Decoded token payload or null if invalid
   */
  static decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - JWT token string
   * @returns true if token is expired or invalid
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // Convert to milliseconds and compare with current time
    return Date.now() >= decoded.exp * 1000;
  }

  /**
   * Get token expiration time in milliseconds
   * @param token - JWT token string
   * @returns Expiration timestamp in milliseconds or null if invalid
   */
  static getTokenExpiry(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  }

  /**
   * Get time until token expires in milliseconds
   * @param token - JWT token string
   * @returns Time until expiry in milliseconds (0 if expired or invalid)
   */
  static getTimeUntilExpiry(token: string): number {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    return expiry - Date.now();
  }

  /**
   * Check if token will expire soon
   * @param token - JWT token string
   * @param thresholdMinutes - Threshold in minutes (default: 5)
   * @returns true if token will expire within threshold
   */
  static willExpireSoon(token: string, thresholdMinutes = 5): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    return timeUntilExpiry <= thresholdMinutes * 60 * 1000;
  }

  /**
   * Format time until expiry for display
   * @param token - JWT token string
   * @returns Formatted string (e.g., "5 minutes", "2 hours")
   */
  static formatTimeUntilExpiry(token: string): string {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    if (timeUntilExpiry <= 0) return 'Expired';

    const minutes = Math.floor(timeUntilExpiry / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Less than a minute';
    }
  }
}

