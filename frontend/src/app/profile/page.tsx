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

// TODO: This page should show the user's personal details, saved posts, etc (i.e. everything that is publically visible + everything that is NOT publically visible)
export default function Profile() {
  const { isLoggedIn, userData } = useUserStore();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar src="" size="lg" className="mx-auto mb-6 h-32 w-32" />
          <CardTitle className="text-lg">You aren&apos;t logged in</CardTitle>
          <CardDescription>
            Login or sign up to view your profile
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="flat"
            radius="full"
            color="primary"
            className="w-full max-w-80"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            variant="solid"
            radius="full"
            className="w-full max-w-80 bg-primary text-white"
            onClick={() => {
              router.push("/register");
            }}
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <h1>{userData?.firstName}</h1>
    </div>
  );
}
