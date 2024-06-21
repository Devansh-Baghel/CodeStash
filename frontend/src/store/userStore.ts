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
    upvotedPosts: string[];
    downvotedPosts: string[];
    savedPosts: string[];
    communitiesJoined: string[];
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified: boolean;
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
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  joinCommunity: (name: string) => void;
  leaveCommunity: (name: string) => void;
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
    await fetcher.post("/users/login", { email, password }).then((res) => {
      set(() => ({ userData: res.user }));
      set(() => ({ isLoggedIn: true }));
    });
  },
  logoutUser: async () => {
    await fetcher.post("/users/logout").then(() => {
      set(() => ({ isLoggedIn: false }));
      set(() => ({ userData: null }));
    });
  },
  upvotePost: async (postId) => {
    await fetcher.patch(`/posts/upvote`, { postId }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
  downvotePost: async (postId) => {
    await fetcher.patch(`/posts/downvote`, { postId }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
  joinCommunity: async (name) => {
    await fetcher.post("/community/join", { community: name }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
  leaveCommunity: async (name) => {
    await fetcher.post("/community/leave", { community: name }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
}));
