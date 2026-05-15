import { create } from "zustand"

interface UIState {
  donationTotal: number
  setDonationTotal: (total: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  donationTotal: 0,
  setDonationTotal: (total) => set({ donationTotal: total }),
}))
