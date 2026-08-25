import { create } from 'zustand'

interface LoaderState {
  loading: boolean
  start: () => void
  stop: () => void
}

export const useLoader = create<LoaderState>((set) => ({
  loading: false,
  start: () => set({ loading: true }),
  stop: () => set({ loading: false })
}))
