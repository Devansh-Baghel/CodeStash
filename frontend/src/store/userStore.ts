import { create } from "zustand";
import fetcher, { axiosInstance } from "@/utils/axios";
import toast from "react-hot-toast";

interface UserState {
  isLoggedIn: boolean;
  userData: null | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    madeBy: {
      fullName: string;
      _id: string;
    };
    avatar: string;
    upvotedPosts: string[];
    downvotedPosts: string[];
    upvotedComments: string[];
    downvotedComments: string[];
    savedPosts: string[];
    communitiesJoined: string[];
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified: boolean;
  };
  setUserData: (userData: UserState["userData"]) => void;
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
  upvoteComment: (commentId: string) => void;
  downvoteComment: (commentId: string) => void;
  joinCommunity: (name: string) => void;
  leaveCommunity: (name: string) => void;
  savePost: (postId: string) => void;
  removeSavedPost: (postId: string) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  isLoggedIn: false,
  userData: null,
  setUserData: (userData) => {
    set(() => ({ userData }));
  },
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
    const registerUserPromise = fetcher
      .post("/users/register", {
        firstName,
        lastName,
        email,
        password,
      })
      .then(() => {
        get().loginUser({ email, password });
      });

    toast.promise(registerUserPromise, {
      loading: "Signing up...",
      success: "Sign up successful",
      error: "Failed to sign up",
    });
  },
  loginUser: ({ email, password }) => {
    const loginToastPromise = fetcher
      .post("/users/login", { email, password })
      .then((res) => {
        set(() => ({ userData: res.user }));
        set(() => ({ isLoggedIn: true }));
      });

    toast.promise(loginToastPromise, {
      loading: "Logging in...",
      success: "Login successful",
      error: "Failed to login",
    });
  },
  logoutUser: async () => {
    const logoutUserPromise = fetcher.post("/users/logout").then(() => {
      set(() => ({ isLoggedIn: false }));
      set(() => ({ userData: null }));
    });

    toast.promise(logoutUserPromise, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out"
    })
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
  upvoteComment: async (commentId) => {
    await fetcher.patch(`/comments/upvote`, { commentId }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
  downvoteComment: async (commentId) => {
    await fetcher.patch(`/comments/downvote`, { commentId }).then((res) => {
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
  savePost: async (postId) => {
    await fetcher.post("/posts/save", { postId }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
  removeSavedPost: async (postId) => {
    await fetcher.patch("/posts/remove-saved-post", { postId }).then((res) => {
      console.log(res);
      set(() => ({ userData: res.user }));
    });
  },
}));
