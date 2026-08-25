import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { sessionStorageService } from '~/api-services/session-storage.service';
import { TokenUtils } from '~/api-services/token.utils';
import { toast } from 'sonner';

interface UseSessionOptions {
  // Warn user N minutes before expiration
  warningThresholdMinutes?: number;
  // Auto logout if inactive for N minutes
  inactivityTimeoutMinutes?: number;
  // Check expiration every N milliseconds
  checkIntervalMs?: number;
}

export function useSession(options: UseSessionOptions = {}) {
  const {
    warningThresholdMinutes = 5,
    inactivityTimeoutMinutes = 30,
    checkIntervalMs = 60000, // Check every minute
  } = options;

  const { logout } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const warningShownRef = useRef<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityListenersAddedRef = useRef<boolean>(false);

  // Check if user is authenticated
  const isSessionValid = sessionStorageService.isSessionValid();

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (!isSessionValid) return;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, inactivityTimeoutMinutes * 60 * 1000);
  }, [isSessionValid, inactivityTimeoutMinutes]);

  // Handle inactivity logout
  const handleInactivityLogout = useCallback(async () => {
    // Only logout if session is still valid (user hasn't logged out manually)
    if (sessionStorageService.isSessionValid()) {
      toast.error('You have been logged out due to inactivity');
      await logout();
    }
  }, [logout]);

  // Check token expiration
  const checkTokenExpiration = useCallback(() => {
    const tokens = sessionStorageService.getTokens();
    if (!tokens) return;

    const accessTokenExpiry = TokenUtils.getTimeUntilExpiry(tokens.accessToken);
    const refreshTokenExpiry = TokenUtils.getTimeUntilExpiry(tokens.refreshToken);

    // Use whichever expires first
    const timeUntilExpiry = Math.min(accessTokenExpiry, refreshTokenExpiry);
    setTimeUntilExpiry(timeUntilExpiry);

    // Show warning if approaching expiration
    if (timeUntilExpiry <= warningThresholdMinutes * 60 * 1000) {
      if (!warningShownRef.current) {
        setShowWarning(true);
        warningShownRef.current = true;

        const minutes = Math.ceil(timeUntilExpiry / 60000);
        toast.warning(`Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`);
      }
    } else {
      setShowWarning(false);
      warningShownRef.current = false;
    }

    // Auto logout if token is expired
    if (timeUntilExpiry <= 0) {
      handleAutoLogout();
    }
  }, [warningThresholdMinutes]);

  // Handle automatic logout
  const handleAutoLogout = useCallback(async () => {
    // Only logout if session is still valid
    if (sessionStorageService.isSessionValid()) {
      toast.error('Your session has expired. Please sign in again.');
      await logout();
    }
  }, [logout]);

  // Handle activity events
  const handleActivity = useCallback(() => {
    if (!isSessionValid) return;

    sessionStorageService.updateLastActivity();
    resetInactivityTimer();
  }, [isSessionValid, resetInactivityTimer]);

  useEffect(() => {
    // Only set up activity listeners if user is authenticated
    if (!isSessionValid) {
      // Clear any existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    // Avoid adding listeners multiple times
    if (activityListenersAddedRef.current) return;
    activityListenersAddedRef.current = true;

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start inactivity timer
    resetInactivityTimer();

    // Check expiration periodically
    const expirationInterval = setInterval(checkTokenExpiration, checkIntervalMs);

    // Initial check
    checkTokenExpiration();

    return () => {
      // Cleanup
      activityListenersAddedRef.current = false;

      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }

      clearInterval(expirationInterval);
    };
  }, [isSessionValid, handleActivity, resetInactivityTimer, checkTokenExpiration, checkIntervalMs]);

  return {
    timeUntilExpiry,
    showWarning,
    isSessionValid,
    sessionDuration: sessionStorageService.getSessionDuration(),
    lastActivity: sessionStorageService.getLastActivity(),
    timeUntilInactivity: Math.max(0, inactivityTimeoutMinutes * 60 * 1000 - (Date.now() - sessionStorageService.getLastActivity())),
  };
}

