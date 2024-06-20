"use client";

import NotLoggedIn from "@/components/NotLoggedIn";
import { useUserStore } from "@/store/userStore";

export default function CreateCommunity() {
  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return <NotLoggedIn description="Login or sign up to create communities" />;
  }

  return (
    <div>
      <p>Form to create community</p>
    </div>
  );
}
