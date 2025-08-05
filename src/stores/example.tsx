import { create } from 'zustand'

interface ExampleStore {
  counter: number
  addCounter: () => void
  clearCounter: () => void
}

const useExampleStore = create<ExampleStore>((set) => ({
  counter: 0,
  addCounter: () => set((state) => ({ counter: state.counter + 1 })),
  clearCounter: () => set({ counter: 0 }),
}))

export default useExampleStore