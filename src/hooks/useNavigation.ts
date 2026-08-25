import { useEffect } from "react";
import { useNavigationStore } from "~/store/useNavigationStore";

/**
 * Hook for managing sidebar navigation collapsed state with localStorage persistence.
 * Defaults to collapsed state (true) on initial load.
 *
 * Uses Zustand store for shared state across all components.
 * The hydration check prevents layout shift during initial render.
 */
export function useNavigation() {
  const { isCollapsed, toggleCollapsed, setCollapsed, isHydrated, setHydrated } =
    useNavigationStore();

  // Mark as hydrated after initial mount to prevent SSR mismatch
  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return {
    isCollapsed,
    isHydrated,
    toggleCollapsed,
    setCollapsed,
  };
}
