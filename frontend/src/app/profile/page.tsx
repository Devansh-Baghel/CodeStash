"use client";
import { useUserStore } from "@/store/userStore";

export default function Profile() {
  const loginState = useUserStore((state) => state.isLoggedIn);
  const changeLoginStatus = useUserStore((state) => state.changeLoginStatus);

  return (
    <button onClick={changeLoginStatus}>
      Change login state: {loginState ? "True" : "False"}
    </button>
  );
}
