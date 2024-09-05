"use client";

import ChangePassword from "@/components/ChangePassword";
import NotLoggedIn from "@/components/NotLoggedIn";
import UpdateUsername from "@/components/UpdateUsername";
import useTitle from "@/hooks/useTitle";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { cardLayout } from "@/utils/classnames";

export default function AccountSettings() {
  useTitle("Account Settings");

  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return (
      <NotLoggedIn
        title="Account Settings"
        description="Login or sign up to view your account settings"
      />
    );
  }

  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">
        Account Settings
      </h1>
      <UpdateUsername />
      <ChangePassword />
    </section>
  );
}
