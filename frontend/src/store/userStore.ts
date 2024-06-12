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
  registerUser: ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  loginUser: ({ email, password }: { email: string; password: string }) => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
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
  registerUser: async ({ firstName, lastName, email, password }) => {
    await fetcher
      .post("/users/register", {
        firstName,
        lastName,
        email,
        password,
      })
      .then(() => {
        get().loginUser({ email, password });
      });
  },
  loginUser: async ({ email, password }) => {
    const data = await fetcher.post("/users/login", { email, password });
    set(() => ({ userData: data }));
    set(() => ({ isLoggedIn: true }));
  },
  logoutUser: async () => {
    await fetcher.post("/users/logout").then(() => {
      set(() => ({ isLoggedIn: false }));
    });
  },
}));
