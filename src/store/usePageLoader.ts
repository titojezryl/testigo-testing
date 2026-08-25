import { create } from 'zustand'

interface PageLoaderState {
  loading: boolean
  start: () => void
  stop: () => void
}

export const usePageLoader = create<PageLoaderState>((set) => ({
  loading: false,
  start: () => set({ loading: true }),
  stop: () => set({ loading: false })
}))
