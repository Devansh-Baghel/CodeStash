"use client";

import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn";

// TODO: This page should show the user's personal details, saved posts, etc (i.e. everything that is publically visible + everything that is NOT publically visible)
export default function Profile() {
  const { isLoggedIn, userData } = useUserStore();

  if (!isLoggedIn) {
    return <NotLoggedIn description="Login or sign up to view your profile" />;
  }

  return (
    <div>
      <h1>{userData?.firstName}</h1>
    </div>
  );
}
