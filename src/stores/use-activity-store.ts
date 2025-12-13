import { create } from 'zustand'

interface ActivityStore {
  selectedActivityId: number | null
  setSelectedActivityId: (id: number | null) => void
  selectedYear: number | null
  setSelectedYear: (year: number | null) => void
}

// 默认显示当前年份
export const useActivityStore = create<ActivityStore>((set) => ({
  selectedActivityId: null,
  setSelectedActivityId: (id) => set({ selectedActivityId: id }),
  selectedYear: new Date().getFullYear(),
  setSelectedYear: (year) => set({ selectedYear: year }),
}))
