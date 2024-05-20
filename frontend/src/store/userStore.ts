import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  userData: Object;
  changeLoginStatus: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  userData: {},
  changeLoginStatus: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
}));
