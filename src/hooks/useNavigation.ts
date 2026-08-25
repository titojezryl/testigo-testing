import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sidebar-collapsed";

/**
 * Hook for managing sidebar navigation collapsed state with localStorage persistence.
 * Defaults to collapsed state (true) on initial load.
 */
export function useNavigation() {
  // Initialize with collapsed state (true) as default
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved preference from localStorage on mount (client-side only)
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
    // else keep the default collapsed state (true)
    setIsHydrated(true);
  }, []);

  // Persist state changes to localStorage
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      return newValue;
    });
  }, []);

  // Allow setting collapsed state directly (useful for programmatic control)
  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, []);

  return {
    isCollapsed,
    isHydrated,
    toggleCollapsed,
    setCollapsed,
  };
}
