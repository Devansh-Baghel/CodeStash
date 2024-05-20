"use client";
import { useUserStore } from "@/store/userStore";

export default function Profile() {
  const loginState = useUserStore((state) => state.isLoggedIn);
  const getCurrentUser = useUserStore((state) => state.getCurrentUser);
  const userData = useUserStore((state) => state.userData);

  return (
    <div>
      <button onClick={getCurrentUser}>
        Change login state: {loginState ? "True" : "False"}
      </button>

      <h1>{userData.firstName}</h1>
    </div>
  );
}
