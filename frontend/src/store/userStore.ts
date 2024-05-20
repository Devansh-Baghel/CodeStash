import { axiosInstance } from "@/utils/axios";
import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  // FIXME: Add proper types of userData
  userData: Object;
  getCurrentUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  userData: {},
  // changeLoginStatus: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
  getCurrentUser: async () => {
    await axiosInstance
      .get("/users/get-current-user")
      .then((res) => {
        set(() => ({ userData: res.data.data.user }));
        set(() => ({ isLoggedIn: true }));
      })
      .catch((error) => {
        if (error.status === 401) {
          console.log("error 401");
        }
      });
  },
}));
