import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationState {
  isCollapsed: boolean
  isHydrated: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
  setHydrated: (hydrated: boolean) => void
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      isCollapsed: true, // Default to collapsed state
      isHydrated: false,

      toggleCollapsed: () => {
        set((state) => ({ isCollapsed: !state.isCollapsed }))
      },

      setCollapsed: (collapsed: boolean) => {
        set({ isCollapsed: collapsed })
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated })
      }
    }),
    {
      name: 'sidebar-collapsed',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed
      })
    }
  )
)
