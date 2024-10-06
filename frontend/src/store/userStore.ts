import { queryClient } from "@/app/providers";
import fetcher, { axiosInstance } from "@/utils/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  showProfileCard: boolean;
  setShowProfileCard: (state: boolean) => void;
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
    downloadPath: string;
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
  showProfileCard: false,
  setShowProfileCard: (state) => {
    set(() => ({ showProfileCard: state }));
  },
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
        set(() => ({ showProfileCard: true }));
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
  loginUser: async ({ email, password }) => {
    toast.loading("Logging in...", { id: "login" });

    await fetcher
      .post("/users/login", { email, password })
      .then((res) => {
        set(() => ({ userData: res.user }));
        set(() => ({ isLoggedIn: true }));
        set(() => ({ showProfileCard: true }));
        toast.success("Logged in successfully", { id: "login" });
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            toast.error("Invalid email or password", { id: "login" });
            break;
          case 404:
            toast.error("User not found", { id: "login" });
            break;
          default:
            toast.error("Something went wrong", { id: "login" });
            break;
        }
      });
  },
  logoutUser: () => {
    const logoutToastPromise = fetcher.post("/users/logout").then(() => {
      set(() => ({ isLoggedIn: false }));
      set(() => ({ userData: null }));
      set(() => ({ showProfileCard: false }));
    });

    toast.promise(logoutToastPromise, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to logout",
    });
  },
  upvotePost: async (postId) => {
    await fetcher.patch(`/posts/upvote`, { postId }).then((res) => {
      set(() => ({ userData: res.user }));
      queryClient.invalidateQueries({ queryKey: [postId] });
      queryClient.invalidateQueries({ queryKey: ["upvoted-posts"] });
      queryClient.invalidateQueries({ queryKey: ["downvoted-posts"] });
    });
  },
  downvotePost: async (postId) => {
    await fetcher.patch(`/posts/downvote`, { postId }).then((res) => {
      set(() => ({ userData: res.user }));
      queryClient.invalidateQueries({ queryKey: [postId] });
      queryClient.invalidateQueries({ queryKey: ["upvoted-posts"] });
      queryClient.invalidateQueries({ queryKey: ["downvoted-posts"] });
    });
  },
  upvoteComment: async (commentId) => {
    await fetcher.patch(`/comments/upvote`, { commentId }).then((res) => {
      set(() => ({ userData: res.user }));
    });
  },
  downvoteComment: async (commentId) => {
    await fetcher.patch(`/comments/downvote`, { commentId }).then((res) => {
      set(() => ({ userData: res.user }));
    });
  },
  joinCommunity: (name) => {
    const joinCommunityPromise = fetcher
      .post("/community/join", { community: name })
      .then((res) => {
        console.log(res);
        set(() => ({ userData: res.user }));
      });

    toast.promise(joinCommunityPromise, {
      loading: `Joining c/${name}`,
      success: `Joined c/${name} successfully`,
      error: `Failed to join c/${name}`,
    });
  },
  leaveCommunity: (name) => {
    const leaveCommunityPromise = fetcher
      .post("/community/leave", { community: name })
      .then((res) => {
        set(() => ({ userData: res.user }));
      });

    toast.promise(leaveCommunityPromise, {
      loading: `Leaving c/${name}`,
      success: `Left c/${name} successfully`,
      error: `Failed to leave c/${name}`,
    });
  },
  savePost: (postId) => {
    const savePostToastPromise = fetcher
      .post("/posts/save", { postId })
      .then((res) => {
        set(() => ({ userData: res.user }));
        queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      });

    toast.promise(savePostToastPromise, {
      loading: "Saving post...",
      success: "Saved post successfully",
      error: "Error saving post",
    });
  },
  removeSavedPost: (postId) => {
    const removeSavedPostPromise = fetcher
      .patch("/posts/remove-saved-post", { postId })
      .then((res) => {
        set(() => ({ userData: res.user }));
        queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      });

    toast.promise(removeSavedPostPromise, {
      loading: "Removing post from saved...",
      success: "Removed post from saved",
      error: "Error removing post from saved",
    });
  },
}));
