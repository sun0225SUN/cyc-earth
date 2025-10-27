import { create } from 'zustand'

interface ActivityStore {
  selectedActivityId: number | null
  setSelectedActivityId: (id: number | null) => void
}

export const useActivityStore = create<ActivityStore>((set) => ({
  selectedActivityId: null,
  setSelectedActivityId: (id) => set({ selectedActivityId: id }),
}))
