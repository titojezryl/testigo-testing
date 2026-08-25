import { useState, useEffect, useCallback } from "react";

/**
 * Hook to track elapsed time from a start timestamp.
 * Updates every second while active.
 *
 * @param startTime - The start time to measure from (Date or null to disable)
 * @param isActive - Whether the timer should be running
 * @returns Object with formatted elapsed time and raw seconds
 *
 * @example
 * ```tsx
 * function Timer({ startTime, isRunning }) {
 *   const { formatted, seconds } = useElapsedTime(startTime, isRunning);
 *   return <span>{formatted}</span>; // "0:45" or "1:23"
 * }
 * ```
 */
export function useElapsedTime(
  startTime: Date | null,
  isActive: boolean = true
) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Calculate initial elapsed time and set up interval
  useEffect(() => {
    if (!startTime || !isActive) {
      setElapsedSeconds(0);
      return;
    }

    // Calculate initial elapsed time
    const calculateElapsed = () => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      return Math.max(0, elapsed);
    };

    setElapsedSeconds(calculateElapsed());

    // Update every second
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  // Format seconds as MM:SS or H:MM:SS
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    /** Elapsed time in seconds */
    seconds: elapsedSeconds,
    /** Formatted elapsed time string (e.g., "0:45", "1:23", "1:02:34") */
    formatted: formatTime(elapsedSeconds),
    /** Minutes component */
    minutes: Math.floor(elapsedSeconds / 60),
  };
}
