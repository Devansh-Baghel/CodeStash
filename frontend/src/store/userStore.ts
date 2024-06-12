import fetcher, { axiosInstance } from "@/utils/axios";
import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  userData: null | {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    madeBy: {
      fullName: string;
      _id: string;
    };
  };
  getCurrentUser: () => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  userData: null,
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
  logoutUser: async () => {
    await fetcher.post("/users/logout").then(() => {
      set(() => ({ isLoggedIn: false }));
    });
  },
}));
